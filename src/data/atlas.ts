export type EntityType = 'author' | 'concept' | 'method';
export type School = 'foundations' | 'strategic' | 'critical' | 'systems' | 'literacy' | 'experiential';

export interface Publication {
  title: string;
  year: string;
  kind: string;
  url: string;
}

export interface AtlasNode {
  id: string;
  name: string;
  lines?: string[];
  type: EntityType;
  school: School;
  x: number;
  y: number;
  radius: number;
  initials?: string;
  subtitle: string;
  description: string;
  question?: string;
  publication: Publication;
  source: string;
}

export interface AtlasEdge {
  source: string;
  target: string;
  relation: string;
  reference?: string;
}

export const schools: Record<School, string> = {
  foundations: 'Foundations of futures',
  strategic: 'Strategic foresight',
  critical: 'Critical & transformative',
  systems: 'Systems & change',
  literacy: 'Futures literacy',
  experiential: 'Experiential & design',
};

export const typeLabels: Record<EntityType, string> = {
  author: 'Author',
  concept: 'Concept',
  method: 'Method',
};

export const palette = {
  author: { fill: '#e5dcf4', stroke: '#cbb9e7', ink: '#786095', soft: '#f3eef9' },
  concept: { fill: '#d9e8dd', stroke: '#b7d0be', ink: '#517b60', soft: '#eef5ef' },
  method: { fill: '#f3e3cc', stroke: '#e3c9a5', ink: '#a3814d', soft: '#faf3e9' },
};

const claSource = 'https://www.metafuture.org/causal-layered-analysis-2/';
const triangleSource = 'https://www.adb.org/sites/default/files/publication/579491/futures-thinking-asia-pacific-policy-makers.pdf';
const datorSource = 'https://jfsdigital.org/wp-content/uploads/2014/01/142-A01.pdf';
const literacySource = 'https://www.unesco.org/en/futures-literacy/resources';
const horizonsSource = 'https://www.iffpraxis.com/3h-approach';
const meadowsSource = 'https://donellameadows.org/archives/leverage-points-places-to-intervene-in-a-system/';

export const nodes: AtlasNode[] = [
  {
    id: 'inayatullah', name: 'Sohail Inayatullah', type: 'author', school: 'critical',
    x: 451, y: 309, radius: 31, initials: 'SI', subtitle: 'Futurist & political scientist',
    description: 'A leading voice in futures studies, exploring how we can question the present and create more inclusive, transformative futures.',
    publication: { title: 'Causal Layered Analysis', year: '1998', kind: 'Foundational paper', url: claSource },
    source: 'https://www.metafutureschool.org/',
  },
  {
    id: 'dator', name: 'Jim Dator', type: 'author', school: 'foundations',
    x: 238, y: 276, radius: 25, initials: 'JD', subtitle: 'Futurist & educator',
    description: 'A foundational futures scholar associated with the Hawaii Research Center for Futures Studies. His four generic futures invite us to imagine growth, collapse, discipline, and transformation without treating any as a prediction.',
    publication: { title: 'Alternative Futures at the Manoa School', year: '2009', kind: 'Journal article', url: datorSource },
    source: datorSource,
  },
  {
    id: 'schwartz', name: 'Peter Schwartz', type: 'author', school: 'strategic',
    x: 126, y: 470, radius: 23, initials: 'PS', subtitle: 'Scenario planner & strategist',
    description: 'A scenario-planning practitioner and co-founder of Global Business Network. His work helps organizations challenge assumptions and prepare for a range of plausible futures rather than a single forecast.',
    publication: { title: 'The Art of the Long View', year: '1991', kind: 'Book', url: 'https://books.google.com/books/about/The_Art_of_the_Long_View.html?id=4vcOAQAAMAAJ' },
    source: 'https://en.wikipedia.org/wiki/Peter_Schwartz_(futurist)',
  },
  {
    id: 'wack', name: 'Pierre Wack', type: 'author', school: 'strategic',
    x: 77, y: 349, radius: 20, initials: 'PW', subtitle: 'Pioneer of scenario planning',
    description: 'A pioneer of scenario planning at Royal Dutch Shell. Wack emphasized that scenarios should change decision-makers\' perceptions, revealing the uncertainties and assumptions that shape strategic choices.',
    publication: { title: 'Scenarios: Uncharted Waters Ahead', year: '1985', kind: 'Harvard Business Review', url: 'https://hbr.org/1985/09/scenarios-uncharted-waters-ahead' },
    source: 'https://en.wikipedia.org/wiki/Pierre_Wack',
  },
  {
    id: 'kahn', name: 'Herman Kahn', type: 'author', school: 'strategic',
    x: 85, y: 178, radius: 20, initials: 'HK', subtitle: 'Strategist & futures researcher',
    description: 'A RAND strategist and co-founder of the Hudson Institute who helped develop scenario-based thinking. His work used detailed alternative situations to examine the consequences of high-stakes decisions.',
    publication: { title: 'The Year 2000', year: '1967', kind: 'Book, with Anthony J. Wiener', url: 'https://hudson.org/research/9019-hudson-institute-mourns-the-loss-of-founding-member-anthony-j-wiener' },
    source: 'https://en.wikipedia.org/wiki/Herman_Kahn',
  },
  {
    id: 'bell', name: 'Wendell Bell', type: 'author', school: 'foundations',
    x: 200, y: 68, radius: 21, initials: 'WB', subtitle: 'Sociologist & futures scholar',
    description: 'A sociologist who helped establish the intellectual and ethical foundations of futures studies. Bell examined possible, probable, and preferable futures, and the responsibilities involved in choosing among them.',
    publication: { title: 'Foundations of Futures Studies', year: '1997', kind: 'Two-volume book', url: 'https://en.wikipedia.org/wiki/Wendell_Bell' },
    source: 'https://en.wikipedia.org/wiki/Wendell_Bell',
  },
  {
    id: 'slaughter', name: 'Richard Slaughter', type: 'author', school: 'critical',
    x: 396, y: 111, radius: 22, initials: 'RS', subtitle: 'Critical & integral futurist',
    description: 'A futures scholar who advanced critical and integral approaches to foresight. His work asks how worldviews, values, and inner development shape our ability to respond to long-term challenges.',
    publication: { title: 'Futures Beyond Dystopia', year: '2004', kind: 'Book', url: 'https://en.wikipedia.org/wiki/Richard_Slaughter' },
    source: 'https://en.wikipedia.org/wiki/Richard_Slaughter',
  },
  {
    id: 'sardar', name: 'Ziauddin Sardar', type: 'author', school: 'critical',
    x: 655, y: 158, radius: 22, initials: 'ZS', subtitle: 'Writer & critical futures thinker',
    description: 'A writer and futures thinker who challenges the dominance of a single worldview. His work on postnormal times explores complexity, chaos, and contradictions, and makes space for plural and non-Western futures.',
    publication: { title: 'Welcome to Postnormal Times', year: '2010', kind: 'Journal article', url: 'https://doi.org/10.1016/j.futures.2009.11.028' },
    source: 'https://en.wikipedia.org/wiki/Ziauddin_Sardar',
  },
  {
    id: 'meadows', name: 'Donella Meadows', type: 'author', school: 'systems',
    x: 790, y: 72, radius: 25, initials: 'DM', subtitle: 'Systems thinker & environmental scientist',
    description: 'A pioneering systems thinker and lead author of The Limits to Growth. Meadows made the dynamics of complex systems accessible, showing how feedback, goals, and paradigms can shape very different futures.',
    publication: { title: 'Leverage Points', year: '1999', kind: 'Essay', url: meadowsSource },
    source: 'https://donellameadows.org/donella-the-person/',
  },
  {
    id: 'sharpe', name: 'Bill Sharpe', type: 'author', school: 'systems',
    x: 876, y: 279, radius: 21, initials: 'BS', subtitle: 'Futures practitioner & systems thinker',
    description: 'A futures practitioner associated with the International Futures Forum. His Three Horizons work explores how established systems, transitional innovations, and emerging possibilities coexist in the present.',
    publication: { title: 'Three Horizons: The Patterning of Hope', year: '2013', kind: 'Book', url: 'https://www.iffpraxis.com/3h-book' },
    source: 'https://www.iffpraxis.com/3h-book',
  },
  {
    id: 'miller', name: 'Riel Miller', type: 'author', school: 'literacy',
    x: 678, y: 443, radius: 25, initials: 'RM', subtitle: 'Futures literacy researcher',
    description: 'A leading researcher in futures literacy who developed the approach through work at the OECD and UNESCO. He explores how becoming aware of anticipation changes what we can perceive and do in the present.',
    publication: { title: 'Transforming the Future', year: '2018', kind: 'Edited collection', url: 'https://digitallibrary.un.org/record/1494609' },
    source: literacySource,
  },
  {
    id: 'candy', name: 'Stuart Candy', type: 'author', school: 'experiential',
    x: 818, y: 585, radius: 23, initials: 'SC', subtitle: 'Futurist & experiential designer',
    description: 'A futurist and designer who helps people experience alternative futures through artifacts, encounters, and games. His work bridges abstract scenarios and tangible experiences that invite broader participation.',
    publication: { title: 'The Futures of Everyday Life', year: '2010', kind: 'Doctoral dissertation', url: 'https://catalogue.nla.gov.au/catalog/5740121' },
    source: 'https://en.wikipedia.org/wiki/Stuart_Candy',
  },
  {
    id: 'dunne', name: 'Anthony Dunne', type: 'author', school: 'experiential',
    x: 460, y: 549, radius: 21, initials: 'AD', subtitle: 'Designer & educator',
    description: 'A designer who, with Fiona Raby, developed influential approaches to critical and speculative design. Their work uses designed possibilities to provoke debate about the kinds of futures we might want.',
    publication: { title: 'Speculative Everything', year: '2013', kind: 'Book, with Fiona Raby', url: 'https://mitpress.mit.edu/9780262019842/speculative-everything/' },
    source: 'https://en.wikipedia.org/wiki/Anthony_Dunne',
  },
  {
    id: 'masini', name: 'Eleonora Masini', type: 'author', school: 'foundations',
    x: 93, y: 582, radius: 21, initials: 'EM', subtitle: 'Sociologist & humanistic futurist',
    description: 'A sociologist and former president of the World Futures Studies Federation. Masini championed humanistic, participatory futures, highlighting the role of women, cultural diversity, and social vision in creating change.',
    publication: { title: 'Why Futures Studies?', year: '1993', kind: 'Book', url: 'https://en.wikipedia.org/wiki/Eleonora_Masini' },
    source: 'https://en.wikipedia.org/wiki/Eleonora_Masini',
  },
  {
    id: 'alternative-futures', name: 'Alternative Futures', type: 'concept', school: 'foundations',
    x: 245, y: 172, radius: 22, lines: ['Alternative', 'Futures'], subtitle: 'Many futures, not one prediction',
    description: 'The idea that multiple futures are possible. Exploring fundamentally different alternatives helps expose assumptions and develop responses that are not dependent on one expected outcome.',
    question: 'What changes when we stop asking what will happen, and ask what could happen?',
    publication: { title: 'Alternative Futures at the Manoa School', year: '2009', kind: 'Jim Dator', url: datorSource }, source: datorSource,
  },
  {
    id: 'critical-futures', name: 'Critical Futures', type: 'concept', school: 'critical',
    x: 375, y: 205, radius: 20, subtitle: 'Question the futures we take for granted',
    description: 'An approach that examines the power, assumptions, and worldviews embedded in images of the future. It asks whose futures are represented, whose are excluded, and how alternatives can be opened up.',
    question: 'Whose future is this, and who is missing from it?',
    publication: { title: 'Causal Layered Analysis', year: '1998', kind: 'Sohail Inayatullah', url: claSource }, source: claSource,
  },
  {
    id: 'integral-futures', name: 'Integral Futures', type: 'concept', school: 'critical',
    x: 505, y: 63, radius: 17, subtitle: 'Connect inner and outer perspectives',
    description: 'An approach to futures inquiry that brings together subjective experience, cultural meaning, behavior, and systems. Associated with Richard Slaughter, it seeks to make foresight more comprehensive and reflexive.',
    question: 'Which perspectives are absent from our understanding of change?',
    publication: { title: 'Futures Beyond Dystopia', year: '2004', kind: 'Richard Slaughter', url: 'https://en.wikipedia.org/wiki/Richard_Slaughter' }, source: 'https://en.wikipedia.org/wiki/Richard_Slaughter',
  },
  {
    id: 'postnormal-times', name: 'Postnormal Times', type: 'concept', school: 'critical',
    x: 641, y: 67, radius: 18, subtitle: 'Complexity, chaos, and contradictions',
    description: 'A framework associated with Ziauddin Sardar for understanding periods in which familiar ways of knowing and governing are inadequate. It emphasizes complexity, chaos, contradictions, uncertainty, and ignorance.',
    question: 'What if our familiar tools are part of the problem?',
    publication: { title: 'Welcome to Postnormal Times', year: '2010', kind: 'Ziauddin Sardar', url: 'https://doi.org/10.1016/j.futures.2009.11.028' }, source: 'https://doi.org/10.1016/j.futures.2009.11.028',
  },
  {
    id: 'systems-thinking', name: 'Systems Thinking', type: 'concept', school: 'systems',
    x: 773, y: 210, radius: 23, subtitle: 'See relationships, not just parts',
    description: 'A way of understanding how interconnections, feedback loops, delays, and structures produce behavior over time. In foresight, it helps explain why change can have surprising and unintended consequences.',
    question: 'What relationships are producing the pattern we keep seeing?',
    publication: { title: 'Thinking in Systems', year: '2008', kind: 'Donella Meadows; edited by Diana Wright', url: 'https://www.penguinrandomhouse.com/books/801035/thinking-in-systems-by-donella-meadows/' }, source: meadowsSource,
  },
  {
    id: 'leverage-points', name: 'Leverage Points', type: 'concept', school: 'systems',
    x: 892, y: 146, radius: 17, subtitle: 'Find meaningful places to intervene',
    description: 'Places within a complex system where a change can shift the behavior of the whole. Meadows distinguished shallow adjustments to parameters from deeper changes to rules, goals, and paradigms.',
    question: 'Are we changing a number, a rule, or the purpose of the system?',
    publication: { title: 'Leverage Points: Places to Intervene in a System', year: '1999', kind: 'Donella Meadows', url: meadowsSource }, source: meadowsSource,
  },
  {
    id: 'futures-literacy', name: 'Futures Literacy', type: 'concept', school: 'literacy',
    x: 729, y: 354, radius: 23, subtitle: 'Understand how we use the future',
    description: 'The capability to recognize why and how we imagine the future. Futures literacy makes our assumptions about anticipation visible and helps us use different kinds of futures to understand the present.',
    question: 'How is the future you imagine shaping what you can see today?',
    publication: { title: 'Transforming the Future', year: '2018', kind: 'Edited by Riel Miller', url: 'https://digitallibrary.un.org/record/1494609' }, source: literacySource,
  },
  {
    id: 'anticipation', name: 'Anticipation', type: 'concept', school: 'literacy',
    x: 610, y: 531, radius: 17, subtitle: 'The future acts in the present',
    description: 'The ways that imagined futures influence current perceptions, choices, and actions. Anticipation studies examines these processes, including the assumptions behind both deliberate planning and implicit expectations.',
    question: 'Which imagined future is already influencing this decision?',
    publication: { title: 'The Discipline of Anticipation', year: '2018', kind: 'Miller, Poli & Rossel; book chapter', url: 'https://digitallibrary.un.org/record/1494609' }, source: literacySource,
  },
  {
    id: 'preferred-futures', name: 'Preferred Futures', type: 'concept', school: 'foundations',
    x: 245, y: 549, radius: 19, subtitle: 'Make values part of the conversation',
    description: 'Futures that people judge to be desirable. Discussing preferences makes values and disagreements explicit, while helping communities connect long-term aspirations to choices in the present.',
    question: 'Desirable for whom, and according to which values?',
    publication: { title: 'Foundations of Futures Studies', year: '1997', kind: 'Wendell Bell', url: 'https://en.wikipedia.org/wiki/Wendell_Bell' }, source: 'https://en.wikipedia.org/wiki/Futures_studies',
  },
  {
    id: 'images-of-future', name: 'Images of the Future', type: 'concept', school: 'foundations',
    x: 316, y: 57, radius: 18, lines: ['Images of', 'the Future'], subtitle: 'Shared visions shape social change',
    description: 'Collective and individual representations of what the future might be. Building on Fred Polak and other scholars, futures studies explores how these images shape action, culture, and the possibilities people can perceive.',
    question: 'What images of the future does our culture keep repeating?',
    publication: { title: 'The Image of the Future', year: '1973', kind: 'Fred Polak; English edition', url: 'https://en.wikipedia.org/wiki/Fred_Polak' }, source: 'https://en.wikipedia.org/wiki/Fred_Polak',
  },
  {
    id: 'wild-cards', name: 'Wild Cards', type: 'concept', school: 'strategic',
    x: 97, y: 270, radius: 15, subtitle: 'Explore low-probability, high-impact change',
    description: 'Events judged to be unlikely but capable of having a major impact. Wild-card thinking challenges assumptions about continuity and is used to test whether strategies can withstand surprising disruptions.',
    question: 'What unlikely event would make our current strategy irrelevant?',
    publication: { title: 'Wild Card (Foresight)', year: 'Overview', kind: 'Background reading', url: 'https://en.wikipedia.org/wiki/Wild_card_(foresight)' }, source: 'https://en.wikipedia.org/wiki/Wild_card_(foresight)',
  },
  {
    id: 'participatory-futures', name: 'Participatory Futures', type: 'concept', school: 'foundations',
    x: 364, y: 620, radius: 18, lines: ['Participatory', 'Futures'], subtitle: 'Imagine the future together',
    description: 'Approaches that involve diverse people in exploring and shaping futures. Participation broadens whose knowledge and values count, and can build shared agency rather than leaving foresight only to experts.',
    question: 'Who needs to be part of imagining this future?',
    publication: { title: 'Why Futures Studies?', year: '1993', kind: 'Eleonora Masini', url: 'https://en.wikipedia.org/wiki/Eleonora_Masini' }, source: 'https://en.wikipedia.org/wiki/Eleonora_Masini',
  },
  {
    id: 'scenario-planning', name: 'Scenario Planning', type: 'method', school: 'strategic',
    x: 211, y: 399, radius: 25, lines: ['Scenario', 'Planning'], subtitle: 'Rehearse different plausible futures',
    description: 'A structured way to develop contrasting, plausible accounts of how a situation could evolve. Scenarios are not forecasts: they help challenge assumptions, surface uncertainties, and test strategic options.',
    question: 'Would this decision still make sense in a very different future?',
    publication: { title: 'The Art of the Long View', year: '1991', kind: 'Peter Schwartz', url: 'https://books.google.com/books/about/The_Art_of_the_Long_View.html?id=4vcOAQAAMAAJ' }, source: 'https://en.wikipedia.org/wiki/Scenario_planning',
  },
  {
    id: 'cla', name: 'Causal Layered Analysis', type: 'method', school: 'critical',
    x: 542, y: 222, radius: 25, lines: ['Causal Layered', 'Analysis'], subtitle: 'Go beneath the surface of an issue',
    description: 'Developed by Sohail Inayatullah, CLA explores four layers: litany, systemic causes, worldview, and myth or metaphor. Moving between them opens up different ways to frame an issue and imagine transformative futures.',
    question: 'What deep story makes this version of reality seem inevitable?',
    publication: { title: 'Causal Layered Analysis: Poststructuralism as Method', year: '1998', kind: 'Sohail Inayatullah', url: claSource }, source: claSource,
  },
  {
    id: 'futures-triangle', name: 'Futures Triangle', type: 'method', school: 'critical',
    x: 505, y: 420, radius: 20, subtitle: 'Map the tensions shaping a future',
    description: 'Sohail Inayatullah\'s mapping tool brings together the pull of images of the future, the push of present-day drivers, and the weight of history. Their interaction reveals tensions and possibilities for change.',
    question: 'What is pulling us forward, pushing us to change, or holding us back?',
    publication: { title: 'Futures Thinking in Asia and the Pacific', year: '2020', kind: 'Asian Development Bank', url: triangleSource }, source: triangleSource,
  },
  {
    id: 'six-pillars', name: 'Six Pillars', type: 'method', school: 'critical',
    x: 633, y: 318, radius: 18, subtitle: 'A framework for transformative foresight',
    description: 'Inayatullah\'s framework organizes futures work around six activities: mapping, anticipating, timing, deepening, creating alternatives, and transforming. It connects a range of tools into an integrated process.',
    question: 'Where does our foresight process need to go deeper?',
    publication: { title: 'Six Pillars: Futures Thinking for Transforming', year: '2008', kind: 'Sohail Inayatullah', url: 'https://doi.org/10.1108/14636680810855991' }, source: 'https://doi.org/10.1108/14636680810855991',
  },
  {
    id: 'three-horizons', name: 'Three Horizons', type: 'method', school: 'systems',
    x: 867, y: 388, radius: 21, subtitle: 'Connect today to emerging possibilities',
    description: 'A framework developed by a group of practitioners and widely articulated by Bill Sharpe. It maps the established system, transitional innovations, and emerging future patterns as interacting horizons present today.',
    question: 'Which innovations sustain the old system, and which nurture a new one?',
    publication: { title: 'Three Horizons: The Patterning of Hope', year: '2013', kind: 'Bill Sharpe', url: 'https://www.iffpraxis.com/3h-book' }, source: horizonsSource,
  },
  {
    id: 'experiential-futures', name: 'Experiential Futures', type: 'method', school: 'experiential',
    x: 795, y: 494, radius: 21, lines: ['Experiential', 'Futures'], subtitle: 'Make possible futures feel real',
    description: 'An approach that turns abstract futures into tangible encounters, artifacts, performances, or environments. Associated with Stuart Candy and other practitioners, it helps people engage emotionally as well as intellectually.',
    question: 'What would an ordinary moment in this future feel like?',
    publication: { title: 'The Futures of Everyday Life', year: '2010', kind: 'Stuart Candy', url: 'https://catalogue.nla.gov.au/catalog/5740121' }, source: 'https://en.wikipedia.org/wiki/Stuart_Candy',
  },
  {
    id: 'speculative-design', name: 'Speculative Design', type: 'method', school: 'experiential',
    x: 555, y: 612, radius: 20, lines: ['Speculative', 'Design'], subtitle: 'Use design to ask better questions',
    description: 'A practice that uses designed objects and situations to open debate about possible futures. Rather than solving a market problem, speculative work often asks which technological, social, or political directions we want.',
    question: 'What object could make this future open for discussion?',
    publication: { title: 'Speculative Everything', year: '2013', kind: 'Anthony Dunne & Fiona Raby', url: 'https://mitpress.mit.edu/9780262019842/speculative-everything/' }, source: 'https://mitpress.mit.edu/9780262019842/speculative-everything/',
  },
  {
    id: 'horizon-scanning', name: 'Horizon Scanning', type: 'method', school: 'strategic',
    x: 76, y: 87, radius: 17, lines: ['Horizon', 'Scanning'], subtitle: 'Notice what is emerging at the edges',
    description: 'A systematic practice of looking for emerging developments, weak signals, and potential sources of change. Scanning helps people notice what may challenge their assumptions before it becomes widely recognized.',
    question: 'What small signal could become important if it grows?',
    publication: { title: 'The Futures Toolkit', year: '2024', kind: 'UK Government Office for Science', url: 'https://www.gov.uk/government/publications/futures-toolkit-for-policy-makers-and-analysts' }, source: 'https://www.gov.uk/government/publications/futures-toolkit-for-policy-makers-and-analysts',
  },
  {
    id: 'backcasting', name: 'Backcasting', type: 'method', school: 'strategic',
    x: 347, y: 455, radius: 20, subtitle: 'Work backward from a desired future',
    description: 'A planning approach that starts with a desired future and works backward to identify actions, conditions, and milestones that could connect it to the present. It is particularly useful when extending current trends is insufficient.',
    question: 'If this future existed, what would have needed to happen first?',
    publication: { title: 'Energy Backcasting', year: '1982', kind: 'John B. Robinson', url: 'https://doi.org/10.1016/0301-4215(82)90048-9' }, source: 'https://en.wikipedia.org/wiki/Backcasting',
  },
  {
    id: 'futures-wheel', name: 'Futures Wheel', type: 'method', school: 'strategic',
    x: 317, y: 349, radius: 18, subtitle: 'Trace the consequences of change',
    description: 'A visual method developed by Jerome C. Glenn for exploring the consequences of a change or event. Starting with direct impacts, participants work outward to second- and third-order consequences.',
    question: 'And then what might happen as a result of that?',
    publication: { title: 'Futures Thinking in Asia and the Pacific', year: '2020', kind: 'Asian Development Bank', url: triangleSource }, source: triangleSource,
  },
];

// Author links describe contributions, not exclusive ownership. Concept links are editorial associations.
export const edges: AtlasEdge[] = [
  { source: 'inayatullah', target: 'cla', relation: 'developed', reference: claSource },
  { source: 'inayatullah', target: 'futures-triangle', relation: 'developed', reference: triangleSource },
  { source: 'inayatullah', target: 'six-pillars', relation: 'developed', reference: 'https://doi.org/10.1108/14636680810855991' },
  { source: 'inayatullah', target: 'critical-futures', relation: 'advances', reference: claSource },
  { source: 'inayatullah', target: 'alternative-futures', relation: 'explores', reference: claSource },
  { source: 'inayatullah', target: 'preferred-futures', relation: 'explores', reference: triangleSource },
  { source: 'inayatullah', target: 'participatory-futures', relation: 'practices', reference: triangleSource },
  { source: 'dator', target: 'alternative-futures', relation: 'advances', reference: datorSource },
  { source: 'dator', target: 'images-of-future', relation: 'explores', reference: datorSource },
  { source: 'dator', target: 'scenario-planning', relation: 'practices', reference: datorSource },
  { source: 'dator', target: 'preferred-futures', relation: 'explores', reference: datorSource },
  { source: 'schwartz', target: 'scenario-planning', relation: 'popularized' },
  { source: 'schwartz', target: 'alternative-futures', relation: 'explores' },
  { source: 'wack', target: 'scenario-planning', relation: 'pioneered' },
  { source: 'kahn', target: 'scenario-planning', relation: 'pioneered' },
  { source: 'kahn', target: 'alternative-futures', relation: 'explores' },
  { source: 'bell', target: 'alternative-futures', relation: 'theorized' },
  { source: 'bell', target: 'preferred-futures', relation: 'theorized' },
  { source: 'bell', target: 'images-of-future', relation: 'explores' },
  { source: 'slaughter', target: 'critical-futures', relation: 'advances' },
  { source: 'slaughter', target: 'integral-futures', relation: 'advances' },
  { source: 'sardar', target: 'postnormal-times', relation: 'developed' },
  { source: 'sardar', target: 'critical-futures', relation: 'advances' },
  { source: 'sardar', target: 'alternative-futures', relation: 'explores' },
  { source: 'meadows', target: 'systems-thinking', relation: 'advances', reference: meadowsSource },
  { source: 'meadows', target: 'leverage-points', relation: 'articulated', reference: meadowsSource },
  { source: 'sharpe', target: 'three-horizons', relation: 'co-developed', reference: horizonsSource },
  { source: 'sharpe', target: 'systems-thinking', relation: 'practices', reference: horizonsSource },
  { source: 'miller', target: 'futures-literacy', relation: 'advances', reference: literacySource },
  { source: 'miller', target: 'anticipation', relation: 'theorized', reference: literacySource },
  { source: 'candy', target: 'experiential-futures', relation: 'advances' },
  { source: 'candy', target: 'futures-literacy', relation: 'practices', reference: 'https://digitallibrary.un.org/record/1494609' },
  { source: 'candy', target: 'participatory-futures', relation: 'practices' },
  { source: 'dunne', target: 'speculative-design', relation: 'co-developed' },
  { source: 'dunne', target: 'alternative-futures', relation: 'explores' },
  { source: 'masini', target: 'participatory-futures', relation: 'advances' },
  { source: 'masini', target: 'preferred-futures', relation: 'explores' },
  { source: 'masini', target: 'images-of-future', relation: 'explores' },
  { source: 'cla', target: 'critical-futures', relation: 'puts into practice', reference: claSource },
  { source: 'cla', target: 'scenario-planning', relation: 'complements', reference: claSource },
  { source: 'cla', target: 'six-pillars', relation: 'is used in', reference: 'https://doi.org/10.1108/14636680810855991' },
  { source: 'futures-triangle', target: 'six-pillars', relation: 'is used in', reference: 'https://doi.org/10.1108/14636680810855991' },
  { source: 'futures-triangle', target: 'images-of-future', relation: 'draws on', reference: triangleSource },
  { source: 'critical-futures', target: 'integral-futures', relation: 'is related to' },
  { source: 'postnormal-times', target: 'systems-thinking', relation: 'is related to' },
  { source: 'systems-thinking', target: 'leverage-points', relation: 'informs', reference: meadowsSource },
  { source: 'systems-thinking', target: 'three-horizons', relation: 'informs', reference: horizonsSource },
  { source: 'futures-literacy', target: 'anticipation', relation: 'draws on', reference: literacySource },
  { source: 'futures-literacy', target: 'experiential-futures', relation: 'is related to' },
  { source: 'experiential-futures', target: 'speculative-design', relation: 'is related to' },
  { source: 'experiential-futures', target: 'participatory-futures', relation: 'supports' },
  { source: 'speculative-design', target: 'preferred-futures', relation: 'explores' },
  { source: 'scenario-planning', target: 'alternative-futures', relation: 'explores' },
  { source: 'horizon-scanning', target: 'scenario-planning', relation: 'informs' },
  { source: 'horizon-scanning', target: 'wild-cards', relation: 'explores' },
  { source: 'wild-cards', target: 'scenario-planning', relation: 'informs' },
  { source: 'backcasting', target: 'preferred-futures', relation: 'works toward' },
  { source: 'backcasting', target: 'three-horizons', relation: 'complements' },
  { source: 'futures-wheel', target: 'systems-thinking', relation: 'draws on' },
  { source: 'futures-wheel', target: 'scenario-planning', relation: 'informs' },
  { source: 'participatory-futures', target: 'preferred-futures', relation: 'explores' },
  { source: 'images-of-future', target: 'alternative-futures', relation: 'informs' },
];

export const nodeById = new Map(nodes.map((node) => [node.id, node]));

const inverseRelations: Record<string, string> = {
  developed: 'Developed by', 'co-developed': 'Co-developed by', advances: 'Advanced by',
  explores: 'Explored by', practices: 'Practiced by', popularized: 'Popularized by',
  pioneered: 'Pioneered by', theorized: 'Theorized by', articulated: 'Articulated by',
  'puts into practice': 'Put into practice by', complements: 'Complements',
  'is used in': 'Uses', 'draws on': 'Informs', 'is related to': 'Related to',
  informs: 'Informed by', supports: 'Supported by', 'works toward': 'Explored through',
};

export function getConnections(id: string) {
  return edges.filter((edge) => edge.source === id || edge.target === id).map((edge) => ({
    node: nodeById.get(edge.source === id ? edge.target : edge.source)!,
    relation: edge.source === id
      ? edge.relation.charAt(0).toUpperCase() + edge.relation.slice(1)
      : inverseRelations[edge.relation] || edge.relation,
    edge,
  }));
}

export function matchesSearch(node: AtlasNode, query: string) {
  const search = query.trim().toLowerCase();
  return !search || `${node.name} ${node.subtitle} ${node.description} ${schools[node.school]} ${node.id === 'cla' ? 'CLA' : ''}`.toLowerCase().includes(search);
}