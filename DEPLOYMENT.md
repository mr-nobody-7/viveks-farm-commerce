## Backend (Railway)
- Connect GitHub repo on railway.app
- Set Root Directory to: apps/backend
- Build Command: pnpm install --frozen-lockfile && pnpm build
- Start Command: node dist/server.js
- Watch Paths: /apps/backend/**
- Add all env variables from apps/backend/.env.example
- After deploy, note the Railway URL for use in Vercel

## Frontend (Vercel)
- Connect GitHub repo on vercel.com
- Set Root Directory to: apps/frontend
- Add env variable: NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app
- Add env variable: NEXT_PUBLIC_ENABLE_COD=true

## Database (MongoDB Atlas)
- Create free cluster at cloud.mongodb.com
- Add 0.0.0.0/0 under Network Access
- Copy connection string to MONGODB_URI in Railway variables

## After Deploy
- Run locally with Atlas MONGODB_URI in .env:
  pnpm seed:admin     (creates first admin user)
  pnpm seed:products  (adds sample products)
