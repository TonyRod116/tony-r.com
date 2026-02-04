# Tony's AI Games Portfolio

A collection of AI-powered games implemented in JavaScript, converted from original Python implementations.

## 🎮 Games Included

### 1. Tic-Tac-Toe AI
- **Algorithm**: Minimax with Alpha-Beta Pruning
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
- **Database**: Real IMDB data (10K+ actors, 5K+ movies)
- **Features**:
  - Auto-correction for misspelled names
  - Real-time path finding
  - Actor statistics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
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
- **Deployment**: Hostinger

## 📊 Performance Metrics

- **Tic-Tac-Toe**: < 1ms move calculation
- **Minesweeper**: < 100ms AI solving
- **Six Degrees**: < 2s path finding (10K+ actors)

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