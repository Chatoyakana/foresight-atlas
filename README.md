# Foresight Atlas

Un grafo de conocimiento interactivo que conecta autores, conceptos y métodos de los estudios de futuros. Permite seguir un hilo entre ideas, leer el perfil de cada nodo, guardar hallazgos en colecciones y exportar la vista actual.

## Qué incluye

- **36 nodos y 62 conexiones** curados a mano: 14 autores, 22 conceptos y métodos.
- **Grafo SVG interactivo** con zoom, paneo, arrastre de nodos, minimapa y vista enfocada sobre un nodo y sus vecinos.
- **Vista de lista** ordenable por nombre o por número de conexiones.
- **Filtros** por tipo (autor / concepto / método) y por escuela de pensamiento, más búsqueda con sugerencias (`/` o `Cmd+K`).
- **Colecciones** guardadas en `localStorage` del navegador, sin cuenta ni backend.
- **Exportación** a SVG (imagen vectorial) o JSON (nodos, relaciones y referencias, distinguiendo vínculos con fuente directa de asociaciones editoriales).
- Accesibilidad: navegación por teclado, roles ARIA, respeto por `prefers-reduced-motion`.

## Stack

React 19 · TypeScript · Vite 7 · Tailwind CSS 4 · Framer Motion · lucide-react

La compilación usa `vite-plugin-singlefile`, así que `dist/index.html` es un **único archivo autocontenido** (~446 KB, ~138 KB gzip) que funciona abriéndolo directamente o subiéndolo a cualquier hosting estático.

## Desarrollo

```bash
npm install
npm run dev        # servidor de desarrollo en http://localhost:5173
npm run typecheck  # verificación de tipos
npm run build      # genera dist/index.html
npm run preview    # sirve el build
```

## Estructura

```
src/
  App.tsx                 estado de la aplicación, navegación, filtros, modales
  components/
    Graph.tsx             grafo SVG: layout, zoom/paneo/pinch, minimapa
    DetailPanel.tsx       perfil del nodo seleccionado y sus conexiones
    Modal.tsx             diálogo accesible con foco atrapado
    NodeMark.tsx          marca visual por tipo de nodo
  data/atlas.ts           nodos, relaciones, escuelas y helpers del grafo
  index.css               sistema de estilos
```

Todo el contenido del atlas vive en [`src/data/atlas.ts`](src/data/atlas.ts). Para añadir un autor, concepto o método basta con agregar un objeto a `nodes` y sus relaciones a `edges`.

## Nota editorial

Este es un punto de partida curado, no una historia exhaustiva ni neutral de la prospectiva. Un vínculo con un autor indica una contribución, no la invención exclusiva de una idea. Algunas relaciones entre conceptos son asociaciones temáticas editoriales y no afirmaciones históricas. Las agrupaciones por escuela son de navegación, no identidades fijas. Cada perfil enlaza a material fuente, y la exportación JSON marca qué relaciones tienen referencia directa.

## Licencia

MIT — ver [LICENSE](LICENSE). El contenido editorial del atlas enlaza a fuentes de terceros que conservan sus propios derechos.
