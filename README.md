# Are You Smarter than an LLM?

This project is a full‑stack TypeScript application where players battle an AI in a vocabulary quiz. The server generates questions using OpenAI, records results and serves a React front‑end.

## Project Structure

- **client/** – React application built with Vite and Tailwind. Contains pages (`home`, `battle`, `results`), context for game state, and many UI components.
- **server/** – Express server exposing API routes:
  - `POST /api/questions/generate` – create questions via OpenAI
  - `POST /api/ai/answer` – have the AI answer a question
  - `POST /api/battles` – save battle results
  - `GET  /api/battles` – list previous battles
  In development the server also runs Vite middleware; in production it serves the built client.
- **shared/** – Zod/Drizzle schemas and TypeScript types shared between client and server.
- **drizzle.config.ts** – configuration for Drizzle ORM (PostgreSQL) – currently an in‑memory storage implementation is provided.
- Configuration files: `vite.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `postcss.config.js`.

## Requirements

- Node.js 18+
- An `OPENAI_API_KEY` environment variable to enable question generation and AI answers.
- Optional `DATABASE_URL` if using Drizzle with a database.

## Development

```bash
npm install
npm run dev
```

This starts the Express server on port 5000 with Vite middleware for the client.

## Production

```bash
npm run build
npm start
```

The build step compiles the client and bundles the server. The app then serves the static files from `dist/public`.

## Gameplay

1. Visit `/` to configure your battle (difficulty, number of questions, timer).
2. Start the battle; questions are fetched from OpenAI.
3. After answering each question, you see whether you or the AI was correct.
4. At the end, view a summary table comparing your answers with the AI's.

