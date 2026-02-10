# Vivek's Farm Commerce - AI Agent Instructions

## Project Overview
Vivek's Farm Commerce is a full-stack e-commerce platform for selling farm products (ghee, pickles, sweets, honey). Built as a **pnpm monorepo** with a Next.js frontend and Express backend.

## Architecture

### Monorepo Structure
- **Root**: Shared scripts, Biome config, pnpm workspace config
- **apps/frontend**: Next.js 16 (App Router), Shadcn UI, Tailwind CSS 4
- **apps/backend**: Express.js, MongoDB (mongoose), TypeScript
- **packages/**: Currently empty (future shared packages)

### Key Stack Details
- **Package Manager**: pnpm (v10.28.1) - always use `pnpm` commands
- **Linter/Formatter**: Biome (NOT ESLint/Prettier) - enforces tabs, double quotes
- **Frontend**: Next.js App Router with TypeScript, Radix UI primitives via Shadcn
- **Backend**: Express 5, Mongoose for MongoDB, tsx for dev hot-reload
- **Styling**: Tailwind CSS 4 with `cn()` utility from `clsx` + `tailwind-merge`

## Development Workflows

### Running the Project
```bash
# From root - runs both frontend and backend concurrently
pnpm dev

# Individual apps
cd apps/frontend && pnpm dev  # → http://localhost:3000
cd apps/backend && pnpm dev   # → http://localhost:4000
```

### Code Quality
```bash
pnpm check    # Run Biome check + autofix (lint + format)
pnpm lint     # Check only (no autofix)
pnpm format   # Format only
```

**Always run `pnpm check` before committing** - it handles both linting and formatting via Biome.

## Project-Specific Conventions

### Component Patterns
- **Shadcn components**: Stored in [apps/frontend/components/ui/](apps/frontend/components/ui/)
- **Layout components**: Header/Footer used in [root layout](apps/frontend/app/layout.tsx) for all pages
- **Path aliases**: Use `@/` for imports (maps to app root via tsconfig paths)
- **Styling helper**: Always use `cn()` from [lib/utils.ts](apps/frontend/lib/utils.ts) for conditional classes

Example component structure:
```tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ICON_SIZE } from "@/lib/constants";
```

### Backend Patterns
- **Entry point**: [server.ts](apps/backend/src/server.ts) initializes DB then starts Express
- **App config**: [app.ts](apps/backend/src/app.ts) defines routes/middleware (separation for testing)
- **DB connection**: [db/connect.ts](apps/backend/src/db/connect.ts) - requires `MONGODB_URI` in `.env`
- **Health check**: `/health` endpoint returns DB connection status

### Code Style (Biome-enforced)
- **Indentation**: Tabs (not spaces)
- **Quotes**: Double quotes for JS/TS strings
- **Imports**: Organize imports enabled (Biome auto-sorts)
- **File endings**: Use `.tsx` for React components, `.ts` for utilities/backend

## Critical File Locations

### Frontend
- [components/Header.tsx](apps/frontend/components/Header.tsx): Site navigation + branding
- [components/Footer.tsx](apps/frontend/components/Footer.tsx): Footer with links and WhatsApp contact
- [lib/constants.ts](apps/frontend/lib/constants.ts): Shared constants (e.g., `ICON_SIZE`)
- [app/layout.tsx](apps/frontend/app/layout.tsx): Root layout with Header/Footer wrapper

### Backend
- [src/app.ts](apps/backend/src/app.ts): Express app configuration
- [src/server.ts](apps/backend/src/server.ts): Server startup + DB connection
- [src/db/connect.ts](apps/backend/src/db/connect.ts): MongoDB connection logic

### Configuration
- [biome.json](biome.json): Central code quality config (tabs, double quotes, organize imports)
- [pnpm-workspace.yaml](pnpm-workspace.yaml): Monorepo workspace definition

## Common Tasks

### Adding a New Route
- **Frontend**: Create folder in `apps/frontend/app/` following Next.js App Router conventions
- **Backend**: Add route handlers in `apps/backend/src/app.ts`

### Adding UI Components
Use Shadcn CLI from frontend directory:
```bash
cd apps/frontend
npx shadcn@latest add [component-name]
```

### Environment Variables
- Backend requires `MONGODB_URI` in `.env` (see [db/connect.ts](apps/backend/src/db/connect.ts))
- Frontend: Use `NEXT_PUBLIC_` prefix for client-side env vars

## Important Notes
- **No ESLint/Prettier**: Project uses Biome exclusively - don't suggest ESLint/Prettier configs
- **Tabs not spaces**: Biome enforces tabs - respect this in all edits
- **pnpm only**: Never suggest npm/yarn commands - workspace requires pnpm
- **Next.js 16 specifics**: Uses App Router, not Pages Router - all routes in `app/` directory
