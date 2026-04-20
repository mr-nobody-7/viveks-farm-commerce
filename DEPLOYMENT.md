## Pre-Push Verification (Run Before Every Push)
- Install deps: pnpm install --frozen-lockfile
- Run deployment-safe verification: pnpm verify:deploy
- Or run step-by-step:
  - pnpm build
  - pnpm --filter backend build
  - pnpm --filter frontend build
- Optional fast split checks:
  - pnpm --filter backend build
  - pnpm --filter frontend build

## Backend (Railway)
- Connect GitHub repo on railway.app
- Root Directory: repository root
- Railway will use nixpacks.toml from repo root to:
  - force Node 20+
  - use pnpm 9 compatible with project engines
  - build backend only (pnpm --filter backend build)
  - start backend only (pnpm --filter backend start)
- railway.json also pins build/start commands in-repo for consistency
- Build/Start commands in Railway UI must be empty so nixpacks.toml is respected
- If Railway still shows `pnpm install --frozen-lockfile && pnpm build` in logs, clear custom Build Command and Start Command in service settings and redeploy
- If runtime logs show `Cannot find module '/app/dist/server.js'`, it means Railway is still using an old start command (`node dist/server.js`). Clear UI start command and redeploy.
- Compatibility fallback is included: build now mirrors `apps/backend/dist` into root `dist`, so even stale `node dist/server.js` start commands will still boot.
- Add all env variables from apps/backend/.env.example
- After deploy, note the Railway URL for use in Vercel

Why this matters:
- Next.js 16 requires Node >= 20.9.0.
- If Railway builds with Node 18, frontend build fails even if backend alone is fine.

## Frontend (Vercel)
- Connect GitHub repo on vercel.com
- Set Root Directory to: apps/frontend
- Add env variable: NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app

COD configuration:
- COD is controlled from Admin Dashboard settings after deploy (not from env)

## Database (MongoDB Atlas)
- Create free cluster at cloud.mongodb.com
- Add 0.0.0.0/0 under Network Access
- Copy connection string to MONGODB_URI in Railway variables

## After Deploy
- Run locally with Atlas MONGODB_URI in .env:
  pnpm seed:admin     (creates first admin user)
  pnpm seed:products  (adds sample products)
