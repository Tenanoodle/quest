# Quest Todo

Quest Todo is a productivity companion inspired by sci-fi mission control aesthetics. It blends quests, milestones, and actionable tasks to make getting things done feel like an epic journey.

## Getting Started

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```

- Web UI: http://localhost:5173
- API: http://localhost:4000

## Scripts

- `npm run dev` – start both the frontend (Vite) and backend (Express) together.
- `npm run build` – build both projects.
- `npm run test` – execute Vitest (web) and Jest (server).
- `npm run lint` – run ESLint across the monorepo.

## Project Structure

```
.
├── server/   # Node.js + Express API with Prisma ORM
└── web/      # React + Vite frontend
```

## Environment

The application uses SQLite by default. Customize the database connection via the `DATABASE_URL` variable. See `.env.example` for reference.

## Deployment

The repository includes a GitHub Action (`.github/workflows/ci.yml`) that installs dependencies, builds the frontend and backend, and runs tests for pull requests.
