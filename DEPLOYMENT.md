## Pre-Push Verification
- Install dependencies: `pnpm install --frozen-lockfile`
- Run checks: `pnpm check`
- Build backend: `pnpm --filter backend build`
- Build frontend: `pnpm --filter frontend build`

## Backend Deployment (Railway)
- Connect repository on Railway.
- Keep root at repository root.
- Ensure Railway uses root `railway.json` and `nixpacks.toml`.
- Do not override build/start commands in Railway UI.

### Railway Environment Variables
Set these in Railway service variables:

- `NODE_ENV=production`
- `PORT=4000`
- `MONGODB_URI=<your-mongodb-uri>`
- `CORS_ORIGIN=<your-vercel-domain>`
- `JWT_SECRET=<strong-random-secret>`
- `ADMIN_JWT_SECRET=<different-strong-random-secret>`
- `RAZORPAY_KEY_ID=<razorpay-key-id>`
- `RAZORPAY_KEY_SECRET=<razorpay-key-secret>`
- `CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>`
- `CLOUDINARY_API_KEY=<cloudinary-api-key>`
- `CLOUDINARY_API_SECRET=<cloudinary-api-secret>`
- `BREVO_API_KEY=<brevo-api-key>`
- `ADMIN_EMAIL=<admin-email-for-alerts>`
- `BREVO_SENDER_EMAIL=<from-email>`
- `BREVO_SENDER_NAME=Vivek's Farm`

## Frontend Deployment (Vercel)
- Connect repository on Vercel.
- Set Root Directory to `apps/frontend`.
- Ensure `apps/frontend/vercel.json` is used.

### Vercel Environment Variables
Set these in Vercel project variables:

- `NEXT_PUBLIC_API_URL=<your-railway-backend-url>`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID=<razorpay-public-key-id>`

## Cookie/CORS Requirements (Cross-Domain)
Frontend and backend are on different domains in production, so cookies must be cross-site compatible.

- Backend cookies must use:
  - `secure: true` in production
  - `sameSite: "none"` in production
  - `httpOnly: true`
- `CORS_ORIGIN` must exactly match your frontend domain(s).

## Database (MongoDB Atlas)
- Create cluster on MongoDB Atlas.
- Allow network access from deployment environment.
- Put connection string in Railway `MONGODB_URI`.

## After Deploy
- Verify backend health endpoint: `/health`
- Verify OTP login from frontend
- Verify checkout payment flow with Razorpay test mode
- Verify admin login and dashboard access
