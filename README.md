# QRWorld Firebase Deploy-Ready

This archive is based on your project and cleaned up for deployment.

## Included
- Next.js 15 App Router
- Firebase Auth support (email/password + Google)
- QR generator with production-safe `NEXT_PUBLIC_APP_URL`
- QR scanner page
- Public QR routes
- Profile + request + chat local demo logic
- Local data store for demo flows

## Important
- Auth uses Firebase when env vars are configured.
- If Firebase env vars are missing, auth falls back to a local demo user flow so the UI still runs.
- App data like QR services, profile, requests, and chat still uses localStorage for MVP/demo behavior.

## Local run
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Vercel deploy
1. Push project to GitHub.
2. Import repo in Vercel.
3. Add the same environment variables in Vercel Project Settings.
4. Set `NEXT_PUBLIC_APP_URL` to your real production URL.
5. Deploy.
6. Re-generate QR codes after deploy so they point to the production domain.

## Notes
- Camera scanning requires HTTPS in production.
- Old QR codes generated on localhost should be replaced after deployment.
