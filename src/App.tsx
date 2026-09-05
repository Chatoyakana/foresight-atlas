import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { AlignLeft, ArrowDownAZ, ArrowRight, ArrowUpRight, BookOpen, Bookmark, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp, Compass, Download, FileJson, Folder, FolderPlus, Image, Layers3, Menu, Network, PanelRightOpen, Plus, Search, Settings2, Shapes, Shuffle, UsersRound, X } from 'lucide-react';
import Graph, { type GraphSettings } from './components/Graph';
import DetailPanel from './components/DetailPanel';
import Modal from './components/Modal';
import NodeMark from './components/NodeMark';
import { edges, getConnections, matchesSearch, nodeById, nodes, palette, schools, typeLabels, type AtlasNode, type EntityType, type School } from './data/atlas';

type Page = 'graph' | 'authors' | 'concepts' | 'reading' | 'collection';
type Collection = { id: string; name: string; nodeIds: string[] };
type ModalName = 'about' | 'export' | 'create' | 'save' | null;
type Dropdown = 'type' | 'school' | 'settings' | 'sort' | null;
const STORAGE_KEY = 'foresight-atlas-collections-v1';
const defaultCollections: Collection[] = [{ id: 'discoveries', name: 'My discoveries', nodeIds: [] }];

function readCollections(): Collection[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!Array.isArray(raw)) return defaultCollections;
    const valid = raw.filter((item): item is Collection => !!item && typeof item.id === 'string' && typeof item.name === 'string' && Array.isArray(item.nodeIds));
    return valid.length ? valid.map((item) => ({ ...item, nodeIds: [...new Set(item.nodeIds.filter((id) => typeof id === 'string' && nodeById.has(id)))] })) : defaultCollections;
  } catch { return defaultCollections; }
}

function BrandMark() {
  return <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"><path d="M20 3v9m0 16v9M3 20h9m16 0h9M8 8l6.3 6.3m11.4 11.4L32 32M8 32l6.3-6.3m11.4-11.4L32 8" /></g><circle cx="20" cy="20" r="4" fill="currentColor" /><circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1.1" opacity=".35" /></svg>;
}

// Some embedded hosts block anchor-driven downloads and mediate saves through
// their own confirmation instead. Use that route when it is offered.
interface SandboxHost { use?: (name: string) => Promise<{ save: (file: { filename: string; data: string }) => Promise<unknown> } | null> }

async function downloadFile(content: string, name: string, type: string) {
  const host = (window as unknown as { claude?: SandboxHost }).claude;
  if (host?.use) {
    try {
      const downloads = await host.use('downloads');
      if (downloads) { await downloads.save({ filename: name, data: content }); return true; }
    } catch { return false; }
  }
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}

export default function App() {
  const [page, setPage] = useState<Page>('graph');
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');
  const [selectedId, setSelectedId] = useState('inayatullah');
  const [detailsOpen, setDetailsOpen] = useState(() => window.innerWidth >= 900);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<EntityType | 'all'>('all');
  const [schoolFilter, setSchoolFilter] = useState<School | 'all'>('all');
  const [dropdown, setDropdown] = useState<Dropdown>(null);
  const [settings, setSettings] = useState<GraphSettings>({ labels: true, connections: true, highlight: true });
  const [sort, setSort] = useState<'alphabetical' | 'connections'>('alphabetical');
  const [expanded, setExpanded] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [modal, setModal] = useState<ModalName>(null);
  const [collections, setCollections] = useState<Collection[]>(readCollections);
  const [activeCollection, setActiveCollection] = useState('discoveries');
  const [saveTarget, setSaveTarget] = useState<AtlasNode | null>(null);
  const [pendingCollections, setPendingCollections] = useState<string[]>([]);
  const [collectionName, setCollectionName] = useState('');
  const [collectionError, setCollectionError] = useState('');
  const [exportFormat, setExportFormat] = useState<'svg' | 'json'>('svg');
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchIndex, setSearchIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const savedIds = useMemo(() => new Set(collections.flatMap((item) => item.nodeIds)), [collections]);
  const selectedNode = nodeById.get(selectedId)!;
  const collection = collections.find((item) => item.id === activeCollection) || collections[0];
  const isGraph = page === 'graph' && viewMode === 'graph';
  const authorCount = nodes.filter((node) => node.type === 'author').length;
  const ideaCount = nodes.length - authorCount;

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(collections)); setStorageAvailable(true); }
    catch { setStorageAvailable(false); }
  }, [collections]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const outside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown-root]')) setDropdown(null);
      if (!target.closest('[data-search-root]')) setSearchOpen(false);
    };
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const editing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;
      if (!modal && (((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') || event.key === '/' && !editing)) {
        event.preventDefault(); searchRef.current?.focus();
      }
      if (event.key === 'Escape') {
        if (modal) setModal(null);
        else if (dropdown) setDropdown(null);
        else if (searchOpen) setSearchOpen(false);
        else if (mobileNav) setMobileNav(false);
        else if (detailsOpen && window.innerWidth <= 900) setDetailsOpen(false);
        else if (expanded) setExpanded(false);
        else if (focusId) setFocusId(null);
      }
    };
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  }, [modal, dropdown, searchOpen, mobileNav, detailsOpen, expanded, focusId]);

  const baseNodes = useMemo(() => {
    if (page === 'authors') return nodes.filter((node) => node.type === 'author');
    if (page === 'concepts') return nodes.filter((node) => node.type !== 'author');
    if (page === 'reading') return nodes.filter((node) => savedIds.has(node.id));
    if (page === 'collection') return nodes.filter((node) => collection.nodeIds.includes(node.id));
    return nodes;
  }, [page, savedIds, collection]);

  const visibleNodes = useMemo(() => {
    const focused = focusId ? new Set([focusId, ...getConnections(focusId).map((item) => item.node.id)]) : null;
    return baseNodes.filter((node) => (typeFilter === 'all' || node.type === typeFilter)
      && (schoolFilter === 'all' || node.school === schoolFilter)
      && matchesSearch(node, query)
      && (!focused || focused.has(node.id)));
  }, [baseNodes, typeFilter, schoolFilter, query, focusId]);

  const visibleEdges = useMemo(() => {
    const ids = new Set(visibleNodes.map((node) => node.id));
    return edges.filter((edge) => ids.has(edge.source) && ids.has(edge.target));
  }, [visibleNodes]);

  const listNodes = useMemo(() => [...visibleNodes].sort((a, b) => sort === 'alphabetical' ? a.name.localeCompare(b.name) : getConnections(b.id).length - getConnections(a.id).length || a.name.localeCompare(b.name)), [visibleNodes, sort]);
  const searchResults = useMemo(() => nodes.filter((node) => matchesSearch(node, query)).slice(0, 6), [query]);
  const suggestionsVisible = searchOpen && query.trim().length > 0 && isGraph;
  const hasFilters = query.length > 0 || typeFilter !== 'all' || schoolFilter !== 'all' || focusId !== null;
  const viewSummary = isGraph ? `${visibleEdges.length} connections` : sort === 'alphabetical' ? 'A to Z' : 'Most connected';

  function notify(message: string) { setToast({ message, id: Date.now() }); }
  function resetFilters() { setQuery(''); setTypeFilter('all'); setSchoolFilter('all'); setFocusId(null); setDropdown(null); setSearchOpen(false); }
  function navigate(next: Page, collectionId?: string) {
    setPage(next); setViewMode(next === 'graph' ? 'graph' : 'list'); resetFilters(); setMobileNav(false); setExpanded(false);
    if (collectionId) setActiveCollection(collectionId);
    setDetailsOpen(next === 'graph' && window.innerWidth >= 900);
  }
  function selectNode(node: AtlasNode) { setSelectedId(node.id); setDetailsOpen(true); }
  function jumpToNode(node: AtlasNode) { resetFilters(); setPage('graph'); setViewMode('graph'); selectNode(node); }
  function focusNode(node: AtlasNode) {
    resetFilters(); setPage('graph'); setViewMode('graph'); setFocusId(node.id); selectNode(node);
    if (window.innerWidth <= 900) setDetailsOpen(false);
  }
  function surprise() {
    const options = nodes.filter((node) => node.id !== selectedId);
    const node = options[Math.floor(Math.random() * options.length)];
    jumpToNode(node); notify(`A new thread to follow: ${node.name}`);
  }
  function openSave(node: AtlasNode) {
    setSaveTarget(node);
    const containing = collections.filter((item) => item.nodeIds.includes(node.id)).map((item) => item.id);
    setPendingCollections(containing.length ? containing : [collections[0].id]);
    setModal('save');
  }
  function saveCollections() {
    if (!saveTarget) return;
    setCollections((current) => current.map((item) => ({ ...item, nodeIds: pendingCollections.includes(item.id) ? [...new Set([...item.nodeIds, saveTarget.id])] : item.nodeIds.filter((id) => id !== saveTarget.id) })));
    setModal(null);
    notify(pendingCollections.length ? `${saveTarget.name} saved to ${pendingCollections.length === 1 ? collections.find((item) => item.id === pendingCollections[0])?.name : `${pendingCollections.length} collections`}.` : `${saveTarget.name} removed from your collections.`);
  }
  function quickSave(node: AtlasNode) {
    if (page === 'collection') {
      setCollections((current) => current.map((item) => item.id === collection.id ? { ...item, nodeIds: item.nodeIds.filter((id) => id !== node.id) } : item));
      notify(`Removed from ${collection.name}.`);
    } else if (savedIds.has(node.id)) {
      setCollections((current) => current.map((item) => ({ ...item, nodeIds: item.nodeIds.filter((id) => id !== node.id) })));
      notify(`${node.name} removed from your collections.`);
    } else {
      setCollections((current) => current.map((item, index) => index === 0 ? { ...item, nodeIds: [...item.nodeIds, node.id] } : item));
      notify(`Saved to ${collections[0].name}.`);
    }
  }
  function openCreate() { setCollectionName(''); setCollectionError(''); setModal('create'); }
  function createCollection(event: FormEvent) {
    event.preventDefault();
    const name = collectionName.trim();
    if (!name) { setCollectionError('Give your collection a name first.'); return; }
    if (collections.some((item) => item.name.toLowerCase() === name.toLowerCase())) { setCollectionError('A collection with this name already exists.'); return; }
    const id = `collection-${Date.now().toString(36)}`;
    setCollections((current) => [...current, { id, name, nodeIds: [] }]);
    setModal(null); navigate('collection', id); notify(`Your collection "${name}" is ready to explore.`);
  }
  async function exportGraph() {
    let delivered = false;
    if (exportFormat === 'svg' && svgRef.current) {
      const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clone.setAttribute('width', '1440'); clone.setAttribute('height', '1035');
      clone.querySelectorAll('[tabindex]').forEach((element) => element.removeAttribute('tabindex'));
      delivered = await downloadFile(new XMLSerializer().serializeToString(clone), 'foresight-atlas.svg', 'image/svg+xml');
    } else {
      const data = {
        title: 'The Foresight Atlas', exportedAt: new Date().toISOString(),
        note: 'A curated, non-exhaustive atlas. Author links indicate contributions, not sole ownership. An author-background reference is biographical context, not a direct citation for every relationship.',
        nodes: visibleNodes,
        links: visibleEdges.map((edge) => ({
          ...edge,
          evidence: edge.reference ? 'direct-reference' : nodeById.get(edge.source)?.type === 'author' ? 'author-background' : 'editorial-association',
          reference: edge.reference || (nodeById.get(edge.source)?.type === 'author' ? nodeById.get(edge.source)?.source : null),
        })),
      };
      delivered = await downloadFile(JSON.stringify(data, null, 2), 'foresight-atlas.json', 'application/json');
    }
    setModal(null);
    if (delivered) notify('Your atlas export is ready. Check your downloads.');
  }

  const heading = page === 'graph' ? 'Foresight, connected.' : page === 'authors' ? 'Meet the minds.' : page === 'concepts' ? 'Ideas for what comes next.' : page === 'reading' ? 'Your next chapter.' : collection.name;
  const description = page === 'graph' ? 'Discover the authors and ideas shaping how we think about the future.' : page === 'authors' ? 'Get to know the thinkers who opened up new ways to see the future.' : page === 'concepts' ? 'Explore the concepts and methods that turn possibility into perspective.' : page === 'reading' ? 'A little inspiration, set aside for another day. All your saved discoveries, together.' : 'Your own constellation of ideas. Follow a thread and see where it takes you.';
  const breadcrumb = page === 'graph' ? 'Knowledge graph' : page === 'authors' ? 'Authors' : page === 'concepts' ? 'Concepts & methods' : page === 'reading' ? 'Reading list' : collection.name;

  return <MotionConfig reducedMotion="user">
    <div className="app-shell">
      {mobileNav && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <button className="brand" onClick={() => navigate('graph')} aria-label="Foresight Atlas home"><BrandMark /><span className="brand-type">foresight<span>ATLAS</span></span></button>
        <div className="sidebar-body">
          <span className="nav-section-label">EXPLORE</span>
          <nav className="primary-nav" aria-label="Main navigation">
            <button className={page === 'graph' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('graph')} title="Knowledge graph"><Network size={18} /><span>Knowledge graph</span>{page === 'graph' && <span className="active-nav-dot" />}</button>
            <button className={page === 'authors' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('authors')} title="Authors"><UsersRound size={18} /><span>Authors</span><small>{authorCount}</small></button>
            <button className={page === 'concepts' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('concepts')} title="Concepts and methods"><Shapes size={18} /><span>Concepts</span><small>{ideaCount}</small></button>
            <button className={page === 'reading' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('reading')} title="Reading list"><BookOpen size={18} /><span>Reading list</span>{savedIds.size > 0 && <small>{savedIds.size}</small>}</button>
          </nav>
          <div className="collections-label"><span className="nav-section-label">YOUR COLLECTIONS</span><button className="icon-button" title="Create a collection" aria-label="Create a collection" onClick={openCreate}><Plus size={15} /></button></div>
          <nav className="collection-nav" aria-label="Saved collections">{collections.map((item) => <button key={item.id} title={item.name} className={`nav-item collection-item ${page === 'collection' && activeCollection === item.id ? 'active' : ''}`} onClick={() => navigate('collection', item.id)}><Folder size={17} /><span>{item.name}</span><small>{item.nodeIds.length}</small></button>)}</nav>
          <button className="new-collection-rail icon-button" aria-label="Create a collection" onClick={openCreate}><FolderPlus size={19} /></button>
        </div>
        <div className="sidebar-footer">
          <button className="getting-started" onClick={() => setModal('about')} title="A little guidance"><Compass size={18} /><span>A little guidance</span><ArrowUpRight size={14} /></button>
          <div className="workspace-identity"><span className="workspace-avatar"><Layers3 size={19} /></span><span><strong>Your workspace</strong><small><i className={storageAvailable ? '' : 'warning-dot'} />{storageAvailable ? 'Saved on this device' : 'Saved for this session'}</small></span></div>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar"><div className="breadcrumb"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu size={20} /></button><Layers3 size={15} className="breadcrumb-icon" /><span>Workspace</span><ChevronRight size={13} /><strong>{breadcrumb}</strong></div><div className="topbar-actions"><span className="living-atlas"><i />A living atlas of futures</span><button className="icon-button help-button" aria-label="About this atlas and how to use it" title="About this atlas" onClick={() => setModal('about')}><CircleHelp size={18} /></button><span className="topbar-divider" /><button className="button button-secondary export-button" onClick={() => { setExportFormat(isGraph ? 'svg' : 'json'); setModal('export'); }}><Download size={14} />Export<span className="export-long"> graph</span></button></div></header>

        <main className="main-content">
          <motion.section className="page-heading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}><div><h1>{heading}</h1><p>{description}</p></div><button className="button surprise-button" onClick={surprise}><Shuffle size={15} />Surprise me<ArrowUpRight size={14} /></button></motion.section>

          <div className="view-bar">
            {page === 'graph' ? <div className="view-tabs" role="group" aria-label="Atlas view"><button className={viewMode === 'graph' ? 'view-tab active' : 'view-tab'} aria-pressed={viewMode === 'graph'} onClick={() => setViewMode('graph')}><Network size={16} />Graph view</button><button className={viewMode === 'list' ? 'view-tab active' : 'view-tab'} aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')}><AlignLeft size={16} />List view</button></div> : <div className="directory-title">{page === 'authors' ? 'The thinkers' : page === 'concepts' ? 'The ideas' : page === 'reading' ? 'Saved for later' : 'Your discoveries'}<span>{baseNodes.length}</span></div>}
            <div className="graph-summary">{hasFilters && <button onClick={resetFilters}>Clear filters<X size={11} /></button>}<span>{visibleNodes.length} {isGraph ? 'nodes' : 'entries'}</span><i /><span>{viewSummary}</span></div>
          </div>

          {expanded && <div className="expanded-backdrop" />}
          <motion.div className={`workspace-shell ${expanded ? 'workspace-expanded' : ''} ${detailsOpen ? 'with-details' : ''}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="workspace-left">
              <div className="workspace-toolbar">
                <div className="search-area" data-search-root>
                  <div className={`search-field ${query ? 'has-value' : ''}`}><Search size={16} /><input ref={searchRef} value={query} type="text" role="combobox" aria-autocomplete="list" aria-label="Search authors and concepts" placeholder="Find an author or concept..." autoComplete="off" aria-expanded={suggestionsVisible} aria-controls={suggestionsVisible ? 'search-results' : undefined} aria-activedescendant={suggestionsVisible && searchResults.length ? `search-option-${searchResults[searchIndex]?.id}` : undefined}
                    onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); setSearchIndex(0); setFocusId(null); }} onFocus={() => setSearchOpen(true)}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') { event.stopPropagation(); setSearchOpen(false); setQuery(''); }
                      if (!suggestionsVisible) return;
                      if (event.key === 'ArrowDown') { event.preventDefault(); setSearchIndex((current) => Math.max(0, Math.min(current + 1, searchResults.length - 1))); }
                      if (event.key === 'ArrowUp') { event.preventDefault(); setSearchIndex((current) => Math.max(0, current - 1)); }
                      if (event.key === 'Enter' && searchResults[searchIndex]) { event.preventDefault(); jumpToNode(searchResults[searchIndex]); searchRef.current?.blur(); }
                    }} />{query ? <button className="search-clear" aria-label="Clear search" onClick={() => { setQuery(''); setSearchOpen(false); searchRef.current?.focus(); }}><X size={13} /></button> : <kbd>/</kbd>}</div>
                  <AnimatePresence>{suggestionsVisible && <motion.div className="search-results" id="search-results" role="listbox" aria-label="Matching authors and concepts" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}><div className="search-results-label">FOLLOW A THREAD</div>{searchResults.length ? searchResults.map((node, index) => <button key={node.id} id={`search-option-${node.id}`} role="option" aria-selected={index === searchIndex} className={index === searchIndex ? 'search-result highlighted' : 'search-result'} onMouseEnter={() => setSearchIndex(index)} onClick={() => jumpToNode(node)}><NodeMark node={node} size={31} /><span><strong>{node.name}</strong><small>{typeLabels[node.type]} / {schools[node.school]}</small></span><ArrowUpRight size={14} /></button>) : <p className="no-search-results">No matches yet. Try "scenarios", "systems", or an author's name.</p>}<div className="search-results-footer">Use the arrow keys to explore, Enter to select.</div></motion.div>}</AnimatePresence>
                </div>

                <div className="toolbar-filters">
                  {page !== 'authors' && <div className="dropdown-root" data-dropdown-root><button className={`filter-button ${typeFilter !== 'all' ? 'filter-active' : ''}`} aria-expanded={dropdown === 'type'} aria-haspopup="menu" onClick={() => setDropdown(dropdown === 'type' ? null : 'type')}>{typeFilter === 'all' ? 'All types' : `${typeLabels[typeFilter]}s`}<ChevronDown size={13} /></button><AnimatePresence>{dropdown === 'type' && <motion.div className="popover type-popover" role="menu" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><span className="popover-label">SHOW IN THE ATLAS</span>{(['all', 'author', 'concept', 'method'] as const).filter((type) => page !== 'concepts' || type !== 'author').map((type) => <button key={type} role="menuitemradio" aria-checked={typeFilter === type} className="popover-option" onClick={() => { setTypeFilter(type); setFocusId(null); setDropdown(null); }}><span className="option-label">{type === 'all' ? <Shapes size={14} /> : <i style={{ background: palette[type].fill, borderColor: palette[type].stroke }} />}{type === 'all' ? 'All types' : `${typeLabels[type]}s`}</span>{typeFilter === type ? <Check size={14} /> : <small>{baseNodes.filter((node) => type === 'all' || node.type === type).length}</small>}</button>)}</motion.div>}</AnimatePresence></div>}
                  <div className="dropdown-root school-filter" data-dropdown-root><button className={`filter-button ${schoolFilter !== 'all' ? 'filter-active' : ''}`} aria-expanded={dropdown === 'school'} aria-haspopup="menu" onClick={() => setDropdown(dropdown === 'school' ? null : 'school')}><span>{schoolFilter === 'all' ? 'All schools' : schools[schoolFilter]}</span><ChevronDown size={13} /></button><AnimatePresence>{dropdown === 'school' && <motion.div className="popover school-popover" role="menu" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><span className="popover-label">SCHOOL OF THOUGHT</span><button className="popover-option" role="menuitemradio" aria-checked={schoolFilter === 'all'} onClick={() => { setSchoolFilter('all'); setFocusId(null); setDropdown(null); }}>All schools{schoolFilter === 'all' && <Check size={14} />}</button>{Object.entries(schools).map(([id, label]) => <button key={id} className="popover-option" role="menuitemradio" aria-checked={schoolFilter === id} onClick={() => { setSchoolFilter(id as School); setFocusId(null); setDropdown(null); }}>{label}{schoolFilter === id && <Check size={14} />}</button>)}</motion.div>}</AnimatePresence></div>
                  <div className="toolbar-separator" />
                  {isGraph ? <div className="dropdown-root" data-dropdown-root><button className={`icon-button settings-button ${dropdown === 'settings' ? 'active' : ''}`} aria-label="Graph display settings" title="Display settings" aria-expanded={dropdown === 'settings'} onClick={() => setDropdown(dropdown === 'settings' ? null : 'settings')}><Settings2 size={17} /></button><AnimatePresence>{dropdown === 'settings' && <motion.div className="popover settings-popover" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><span className="popover-label">MAKE IT YOUR VIEW</span>{([{ key: 'labels', label: 'Show node labels' }, { key: 'connections', label: 'Show connections' }, { key: 'highlight', label: 'Highlight related nodes' }] as const).map((item) => <button className="setting-row" key={item.key} role="switch" aria-checked={settings[item.key]} onClick={() => setSettings((current) => ({ ...current, [item.key]: !current[item.key] }))}><span>{item.label}</span><span className={`switch ${settings[item.key] ? 'on' : ''}`}><i /></span></button>)}<p>Tip: drag a node to give an idea a little space.</p></motion.div>}</AnimatePresence></div> : <div className="dropdown-root" data-dropdown-root><button className="icon-button settings-button" title="Sort entries" aria-label="Sort entries" aria-expanded={dropdown === 'sort'} onClick={() => setDropdown(dropdown === 'sort' ? null : 'sort')}><ArrowDownAZ size={17} /></button>{dropdown === 'sort' && <div className="popover sort-popover" role="menu"><span className="popover-label">SORT YOUR VIEW</span>{(['alphabetical', 'connections'] as const).map((value) => <button key={value} className="popover-option" role="menuitemradio" aria-checked={sort === value} onClick={() => { setSort(value); setDropdown(null); }}>{value === 'alphabetical' ? 'Name, A to Z' : 'Most connected'}{sort === value && <Check size={14} />}</button>)}</div>}</div>}
                  {!detailsOpen && <button className="icon-button reopen-details" aria-label="Open selected node details" title="Open details" onClick={() => setDetailsOpen(true)}><PanelRightOpen size={16} /></button>}
                </div>
              </div>

              {isGraph ? <Graph nodes={visibleNodes} edges={visibleEdges} selectedId={selectedId} onSelect={selectNode} focusId={focusId} onClearFocus={() => setFocusId(null)} settings={settings} svgRef={svgRef} onReset={resetFilters} expanded={expanded} onExpand={() => setExpanded(!expanded)} /> : <div className="directory-scroll">
                {listNodes.length > 0 ? <div className="directory-list"><div className="directory-columns"><span>{page === 'authors' ? 'AUTHOR' : 'NAME'}</span><span className="directory-school">SCHOOL OF THOUGHT</span><span>LINKS</span><span /></div>{listNodes.map((node) => <div key={node.id} className={`directory-row ${node.id === selectedId && detailsOpen ? 'selected' : ''}`}><button className="directory-entity" onClick={() => selectNode(node)}><NodeMark node={node} size={38} /><span><strong>{node.name}</strong><small>{node.type === 'author' ? node.subtitle : typeLabels[node.type]}</small></span><ArrowUpRight size={14} className="directory-row-arrow" /></button><span className="directory-school">{schools[node.school]}</span><button className="connection-count" title={`Explore ${getConnections(node.id).length} connections to ${node.name}`} onClick={() => focusNode(node)}><Network size={13} />{getConnections(node.id).length}</button><button className={`icon-button row-bookmark ${savedIds.has(node.id) ? 'bookmarked' : ''}`} aria-label={savedIds.has(node.id) ? `Remove ${node.name} from ${page === 'collection' ? collection.name : 'saved collections'}` : `Save ${node.name}`} onClick={() => quickSave(node)}><Bookmark size={16} fill={savedIds.has(node.id) ? 'currentColor' : 'none'} /></button></div>)}</div> : <div className="directory-empty">{page === 'reading' || page === 'collection' ? <Bookmark size={36} strokeWidth={1.2} /> : <Search size={36} strokeWidth={1.2} />}<h2>{hasFilters ? 'Nothing on this path yet.' : 'Make room for a little curiosity.'}</h2><p>{hasFilters ? 'A broader search or a different school might open up something new.' : 'Save an author, concept, or method that sparks your interest. Your discoveries will find a home here.'}</p><button className="button button-primary" onClick={hasFilters ? resetFilters : () => navigate('graph')}>{hasFilters ? 'Clear your filters' : 'Explore the graph'}<ArrowRight size={15} /></button></div>}
              </div>}
              <div className="canvas-status"><span><i />{focusId ? 'One idea. A world of connections.' : isGraph ? 'Every connection is a new perspective.' : `${listNodes.length} ${listNodes.length === 1 ? 'discovery' : 'discoveries'} to explore`}</span><button onClick={() => setModal('about')}>{isGraph ? 'How to explore' : 'About these connections'}<CircleHelp size={12} /></button></div>
            </div>
            {detailsOpen && <><button className="detail-mobile-scrim" aria-label="Close node details" onClick={() => setDetailsOpen(false)} /><DetailPanel node={selectedNode} onSelect={selectNode} onClose={() => setDetailsOpen(false)} onFocus={focusNode} onSave={openSave} saved={savedIds.has(selectedId)} /></>}
          </motion.div>
          <div className="page-footnote"><span>A starting point, not the whole territory.</span><button onClick={() => setModal('about')}>Curated with curiosity<ArrowUpRight size={12} /></button></div>
        </main>
      </div>
    </div>

    <AnimatePresence>
      {modal === 'about' && <Modal key="about" title="A map for curious minds." description="The future is plural. Your perspective can be, too." onClose={() => setModal(null)} wide><div className="about-intro"><span className="about-brand-mark"><BrandMark /></span><p><strong>Welcome to the Foresight Atlas.</strong> A living map of authors, concepts, and methods that help us think more deeply about what comes next.</p></div><div className="guide-steps"><div><span>01</span><div><h3>Start with a little curiosity</h3><p>Click a node or search for an idea. Authors are lavender, concepts are sage, and methods are sand.</p></div></div><div><span>02</span><div><h3>Follow a thread</h3><p>Read the profile, explore a connected idea, or choose a focused view. Drag to pan, scroll to zoom, and drag individual nodes to rearrange them.</p></div></div><div><span>03</span><div><h3>Make it your own</h3><p>Save discoveries into collections or download the graph. Collections stay in this browser on this device, with no account required.</p></div></div></div><div className="editorial-note"><h3>A note on the map</h3><p>This is a curated starting point, not an exhaustive or neutral history of foresight. An author connection indicates a contribution, not sole invention. Links between ideas can be editorial thematic associations; they are not all historical claims. School groupings are navigational, not fixed identities.</p><p>Each profile links to source material. The JSON export includes references and distinguishes source-backed relationships from editorial associations.</p></div><div className="about-sources"><h3>A few of our starting points</h3><a href="https://www.metafuture.org/causal-layered-analysis-2/" target="_blank" rel="noreferrer">Inayatullah / Causal Layered Analysis<ArrowUpRight size={13} /></a><a href="https://jfsdigital.org/wp-content/uploads/2014/01/142-A01.pdf" target="_blank" rel="noreferrer">Dator / Alternative Futures at the Manoa School<ArrowUpRight size={13} /></a><a href="https://www.unesco.org/en/futures-literacy/resources" target="_blank" rel="noreferrer">UNESCO / Futures Literacy<ArrowUpRight size={13} /></a><a href="https://www.iffpraxis.com/3h-approach" target="_blank" rel="noreferrer">International Futures Forum / Three Horizons<ArrowUpRight size={13} /></a></div><div className="modal-footer"><span className="keyboard-tip">Press <kbd>/</kbd> to find your next thread.</span><button className="button button-primary" onClick={() => setModal(null)}>Let's explore<ArrowRight size={15} /></button></div></Modal>}
      {modal === 'create' && <Modal key="create" title="A new collection of possibilities." description="Give your discoveries a place to grow." onClose={() => setModal(null)}><form onSubmit={createCollection}><label className="form-label" htmlFor="collection-name">Collection name</label><input className="form-input" id="collection-name" placeholder="e.g. Rethinking tomorrow" maxLength={48} value={collectionName} onChange={(event) => { setCollectionName(event.target.value); setCollectionError(''); }} aria-invalid={!!collectionError} aria-describedby={collectionError ? 'collection-error' : undefined} />{collectionError && <p className="form-error" id="collection-error">{collectionError}</p>}<p className="form-hint">Private to you, saved in this browser. Add authors and ideas as you explore.</p><div className="modal-footer"><button type="button" className="button button-secondary" onClick={() => setModal(null)}>Cancel</button><button className="button button-primary" type="submit"><FolderPlus size={16} />Create collection</button></div></form></Modal>}
      {modal === 'save' && saveTarget && <Modal key="save" title="Keep this thread." description="Good ideas are worth coming back to." onClose={() => setModal(null)}><div className="save-preview"><NodeMark node={saveTarget} size={44} /><span><strong>{saveTarget.name}</strong><small>{typeLabels[saveTarget.type]} / {schools[saveTarget.school]}</small></span></div><span className="form-label">Save to your collections</span><div className="collection-choices">{collections.map((item) => <label className={`collection-choice ${pendingCollections.includes(item.id) ? 'chosen' : ''}`} key={item.id}><Folder size={19} /><span><strong>{item.name}</strong><small>{item.nodeIds.length} {item.nodeIds.length === 1 ? 'discovery' : 'discoveries'}</small></span><input type="checkbox" checked={pendingCollections.includes(item.id)} onChange={(event) => setPendingCollections((current) => event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id))} /></label>)}</div><p className="form-hint">Your collections are saved on this device. Uncheck a collection to remove this discovery from it.</p><div className="modal-footer"><button className="button button-secondary" onClick={() => setModal(null)}>Cancel</button><button className="button button-primary" onClick={saveCollections} disabled={!pendingCollections.length && !savedIds.has(saveTarget.id)}><Check size={16} />{pendingCollections.length ? 'Save discovery' : 'Remove from collections'}</button></div></Modal>}
      {modal === 'export' && <Modal key="export" title="Take a little perspective with you." description="Download this view of the Foresight Atlas." onClose={() => setModal(null)}>
        <div className="export-summary"><Network size={19} /><span><strong>{visibleNodes.length} nodes, {visibleEdges.length} connections</strong><small>{hasFilters || page !== 'graph' ? 'Your current filtered view' : 'The complete curated atlas'}</small></span></div>
        <fieldset className="export-formats">
          <legend>Choose a format</legend>
          <label className={`format-option ${exportFormat === 'svg' ? 'chosen' : ''} ${!isGraph ? 'disabled' : ''}`}>
            <Image size={23} /><span><strong>Vector image <small>.svg</small></strong><p>A crisp, scalable image for your notes or presentations.</p></span>
            <input type="radio" name="export-format" value="svg" checked={exportFormat === 'svg'} disabled={!isGraph} onChange={() => setExportFormat('svg')} />
          </label>
          <label className={`format-option ${exportFormat === 'json' ? 'chosen' : ''}`}>
            <FileJson size={23} /><span><strong>Connected data <small>.json</small></strong><p>Authors, ideas, relationships, and linked source references.</p></span>
            <input type="radio" name="export-format" value="json" checked={exportFormat === 'json'} onChange={() => setExportFormat('json')} />
          </label>
        </fieldset>
        {!isGraph && <p className="form-hint">Switch to Graph view to export a vector image.</p>}
        <div className="modal-footer"><button className="button button-secondary" onClick={() => setModal(null)}>Cancel</button><button className="button button-primary" onClick={exportGraph}><Download size={16} />Download export</button></div>
      </Modal>}
    </AnimatePresence>
    <AnimatePresence>{toast && <motion.div key={toast.id} className="toast" role="status" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CheckCircle2 size={18} /><span>{toast.message}</span><button className="icon-button" onClick={() => setToast(null)} aria-label="Dismiss notification"><X size={14} /></button></motion.div>}</AnimatePresence>
  </MotionConfig>;
}
