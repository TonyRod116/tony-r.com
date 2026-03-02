# Tech Context

## Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Interactions**: Framer Motion
- **Icons**: Lucide React
- **Translation**: Custom data-driven logic

## Backend
- **Production**: Vercel Serverless Functions
- **Local Development**: Node.js 18+, Express.js
- **Persistence (Local)**: JSON-based (`data/leads.json`)
- **API (External)**: OpenAI API (GPT models)

## Tools & Libraries
- **Playwright**: MCP for screenshots and testing
- **Context7**: MCP for documentation retrieval
- **Memory Bank**: MCP for project context persistence
- **Zod**: Validation (backend schema)

## Deployment
- **Frontend/API**: Vercel
- **Portfolio Domain**: Hostinger (tony-r.com)
- **CI/CD**: Git integration with Vercel

## Constraints
- **Vercel Statelessness**: `/api/leads` on Vercel lacks persistence.
- **Image Size Limits**: Base64 images for "Inspírate con IA" limited to 10 MB.
- **API Latency**: Pathfinding (Six Degrees) takes < 2s but depends on network speed.
- **Environment Variables**: `OPENAI_API_KEY` is required for AI demos.
