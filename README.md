# Tony Rodríguez — Portfolio, Projects and AI Demos

React/Vite portfolio with project stories, CV, contact and interactive AI demos. The main domain [tony-r.com](https://tony-r.com) is hosted on IONOS; the existing Vercel Git integration also remains active. Publication evidence and recovery: [2026-09-30 release](docs/ai/publication-20260930.md). Source lives in `src/`; Vercel functions in `api/`; local Express/persistence in `server/`. Several demos call BuildApp directly: see [current contracts](docs/ai/api-contracts.md). Local source inspection does not certify production availability.

## Completed showroom

Home and AI keep their approved identities; About, Projects, Resume, Contact and the three Solutions demos share the warm-paper system in `src/components/site/`. Copy is in `src/data/siteContent.js` (ES/EN/CA). The header keeps Projects/AI/About/Contact; CV and Solutions are in the footer. Documents use native dialogs and original PDF assets. All 24 Total Homes images are cached unchanged in `public/gallery/`, with original source hashes and visually inspected descriptions.

The three demos retain BuildApp request/response contracts. Budget supports both table and range replies; render comparison supports pointer/touch/keyboard; chat reset ignores obsolete replies. QA intercepts all remote generation/contact requests. Local verification and limits: `docs/ai/site-showroom-20260930.md` and its JSON companion. This implementation does not publish the site.

## Development and quality

Use Node.js 24 (the version validated by CI) and the checked-in lockfile. Existing dependencies are unchanged.

```bash
npm ci
npm run dev
npm run check
npm run build -- --outDir .artifacts/build
npm run test:e2e
npm run test:visual
npm run perf:report
```

Install Chromium for browser QA with `npx playwright install chromium` if the machine lacks it. Tests use local built output, simulated demo/contact responses and block external destinations. Visual baselines must use the same OS/browser; read [browser QA](docs/ai-skills/browser-qa.md). `npm run build` still produces deployable `dist/` with the demos compatibility copy; an explicit outDir preserves existing dist changes.

## AI work system

Start with `.agents/skills/my-page-agent/SKILL.md`. [Operation](docs/ai/operating-system.md), [complete adoption matrix](docs/ai/adoption.md), [design context](.agents/design-context.md) and [verification](docs/ai/verification.md) explain the local skills, memory, hooks, routing, checks and authority limits.

```bash
npm run ai:brief
npm run ai:context -- --query "objective and constraints"
npm run ai:health
npm run ai:route -- --query "objective"
```

The model selector is the existing personal installation in `~/litellm`; its absence is reported, not replaced. CI works without it. Skills live in `.agents/skills` and are mirrored to `.claude/skills` using `ai:sync`; instructions use the existing sync/check scripts. Neither tooling installation nor green CI publishes or enables external services.

The sections below describe the existing demos and algorithms. Treat older endpoint/deployment instructions as historical where the current contract page differs.

## 🎮 Games Included

### 1. Tic-Tac-Toe AI
- **Algorithm**: Minimax
- **Difficulty**: Impossible to beat (perfect play)
- **Features**: 
  - Hard/Easy mode toggle
  - Game statistics tracking
  - Responsive design

### 2. Minesweeper AI
- **Algorithm**: Logical Deduction with Knowledge Base
- **Features**:
  - AI solver mode
  - Manual play mode
  - Progressive difficulty
  - Statistics tracking

### 3. Six Degrees of Kevin Bacon
- **Algorithm**: Breadth-First Search (BFS)
- **Active dataset**: A small curated graph of 10 actors and four films, with cast references in `src/data/actorGraph.js`. Older larger assets are retained but are not the active demo.
- **Features**:
  - Suggested names, working examples and shortest-path search
  - Linked film/cast sources and explicit sample scope
  - Spanish, English and Catalan interface

### Shared AI Lab and repaired demos

The six `/ai/*` experiments share `src/components/ai/AiExperimentLayout.jsx` and scoped design tokens in `AiLab.css`. The hub and each experiment use the same navigation, interaction stage and method explanation. T-Tris keeps Magic T, manual/AI play, ghost placement, music and local records; pure rules and reachable-placement search live in `tetrisEngine.js`. Keyboard shortcuts operate on the focused board.

`/ai/neural-network` performs local inference with the attributed pretrained MNIST artifact in `public/models/mnist/`. Drawing supports mouse/touch and scaled canvases; actual activations drive a rotatable vector projection. Failed or invalid model loading provides retry instead of random predictions. The old `/neural-network.html` link redirects to the integrated route. Original Apache-2.0 license and notice accompany the weights. See `docs/ai/lab-redesign-20260930.md` for checks and limits.

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- npm or yarn

### Installation
   ```bash
   npm install
   npm run dev
   ```

### Building for Production
   ```bash
   npm run build
   ```

### Deploy en Vercel (demos con IA en vivo)

Las funciones propias usan las variables indicadas abajo. **Lead Qualifier actualmente llama al backend de BuildApp**, también en desarrollo; su flujo no depende automáticamente de `/api/chat`. Consulte `docs/ai/api-contracts.md` antes de configurar o probar una demo.

1. **Variable de entorno obligatoria**  
   En Vercel: **Project → Settings → Environment Variables** añade:
   - **Name:** `OPENAI_API_KEY`  
   - **Value:** tu clave de OpenAI (`sk-...`)  
   - **Environment:** Production (y Preview si quieres que funcione en PRs).

2. **Rutas API en Vercel**  
   El proyecto ya incluye funciones serverless en `api/`:
   - **`/api/chat`** → Lead Qualifier (proxy OpenAI).
   - **`/api/generate-quote`** → ReformasDemo (borrador de presupuesto con IA).
   - **`/api/leads`** → ReformasDemo (POST guarda id; GET devuelve lista vacía; sin persistencia entre requests).

3. **Build y deploy**  
   - `npm run build` genera `dist/`.  
   - En Vercel el output es `dist` y el build command `npm run build` (ya en `vercel.json`).  
   - Tras el deploy, comprueba en la URL de producción que el chat (Lead Qualifier) y “Generar borrador” (Reformas) responden.

4. **Nota sobre historial de leads**  
   En Vercel no hay persistencia para `/api/leads`: el listado de historial en ReformasDemo saldrá vacío. Si necesitas historial real, opciones: usar **Vercel KV** (u otro almacén) en las funciones, o desplegar el `server/` en otro host (p. ej. Render) y definir **`VITE_API_URL`** en Vercel (Build) con esa URL.

5. **Si /demos da 403**  
   El middleware en `middleware.js` reescribe `/demos` y `/demos/` a `index.html`. Para ver logs de debug: **Vercel Dashboard → tu proyecto → Deployments → [último deployment] → Runtime Logs** (o **Logs**). Ahí salen los `[middleware] pathname= ...` de cada petición.

---

## Demo: Presupuestos Reformas

Demo para empresas de reformas (Barcelona): captura de lead → borrador de presupuesto con IA en 2 minutos (checklist de visita, preguntas faltantes, partidas min/max, mensaje WhatsApp).

### Requisitos

- Node.js 18+
- Clave de API de OpenAI

### Pasos

1. **Frontend (Vite)** – en la raíz del proyecto:
   ```bash
   npm install
   npm run dev
   ```
   Abre `http://localhost:5173` y en el menú ve a **Demos** → **Presupuestos Reformas**.

2. **Backend (API)** – en otra terminal, desde la raíz:
   ```bash
   cd server
   npm install
   ```
   Crea el fichero de variables de entorno:
   ```bash
   # server/.env
   OPENAI_API_KEY=sk-...tu_clave_de_openai...
   ```
   Arranca el servidor:
   ```bash
   npm start
   ```
   O en modo desarrollo con recarga automática:
   ```bash
   npm run dev
   ```
   La API escucha en `http://localhost:3001`. El frontend en desarrollo usa el proxy de Vite (`/api` → `localhost:3001`).

3. **Probar la demo**  
   En la página **Demos → Presupuestos Reformas** rellena al menos el nombre, opcionalmente tipo de reforma, m², presupuesto objetivo y notas. Pulsa **Generar borrador**. Revisa las pestañas (Checklist, Preguntas, Presupuesto, WhatsApp) y usa **Copiar** para el mensaje de WhatsApp. El histórico guarda los últimos 10 en `server/data/leads.json`.

### Variables de entorno (servidor)

| Variable         | Descripción                    |
|------------------|--------------------------------|
| `OPENAI_API_KEY` | Clave de API de OpenAI (obligatoria para generar borradores) |
| `PORT`           | Puerto del servidor (por defecto `3001`) |

### Estructura del backend

```
server/
├── index.js    # Express, rutas /api/generate-quote, /api/leads
├── schema.js   # Validación Zod del borrador
├── package.json
├── .env        # OPENAI_API_KEY (no subir a git)
└── data/
    └── leads.json   # Persistencia (se crea al guardar)
```

### Inspírate con IA (render + presupuesto)

En la misma demo hay una sección **“Inspírate con IA”** que usa el backend público de BuildApp:

- **Endpoint:** `POST https://buildapp-v1-backend.onrender.com/api/v1/get-inspired/process`
- **Body:** `{ image: "data:image/...;base64,...", prompt: string, locale: "es-ES" }`
- **Respuesta:** `budget`, `originalImageUrl`, `editedImageUrl`, `editPrompt`

En frontend se validan: imagen ≤ 10 MB, formatos JPEG/PNG/WebP, dimensión máx. 8192 px.  
Para que funcione desde **https://tony-r.com**, hay que añadir ese origen a `CORS_ORIGINS` en el backend de BuildApp (variables de entorno en Render).

## 🧠 AI Algorithms

### Minimax Algorithm (Tic-Tac-Toe)
```javascript
// Perfect game strategy
function minimax(board, depth, isMaximizing) {
    // Evaluates all possible moves
    // Returns optimal move for AI player
}
```

### Logical Deduction (Minesweeper)
```javascript
// Knowledge-based AI
class MinesweeperAI {
    addKnowledge(cell, count) {
        // Builds logical sentences
        // Deduces safe moves and mines
    }
}
```

### Breadth-First Search (Six Degrees)
```javascript
// Graph traversal algorithm
function shortestPath(source, target) {
    // Uses BFS to find shortest path
    // Between any two actors
}
```

## 📁 Project Structure

```
src/
├── pages/
│   └── AiLab.jsx          # Main AI Lab page
├── components/            # React components
├── hooks/                 # Custom hooks
└── data/                  # Translation files

public/demos/
├── tictactoe.html         # Tic-Tac-Toe game
├── minesweeper.html       # Minesweeper game
├── six-degrees.html       # Six Degrees game
└── data/                  # Game data files
    ├── people.json        # Actor database
    ├── movies.json        # Movie database
    └── stars.json         # Actor-movie connections
```

## 🎯 Key Features

- **Responsive Design**: Works on desktop and mobile
- **Multi-language Support**: English, Spanish, Catalan
- **Real AI Algorithms**: Not just random moves
- **Performance Optimized**: Fast loading and smooth gameplay
- **Accessibility**: Screen reader friendly

## 🔧 Technical Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment configuration**: Vercel functions and SPA output; verify actual hosting/runtime before making availability claims.

## 📊 Performance Metrics

`npm run perf:report` measures local build artifacts. Browser journeys and pure model/game regression tests verify behavior; they do not establish production latency, model accuracy or business impact. Historical latency estimates are not current guarantees.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Tony Rodríguez** - Software Engineer with AI expertise
- GitHub: [@TonyRod116](https://github.com/TonyRod116)
- Portfolio: [tony-r.com](https://tony-r.com)
