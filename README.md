# Azadeh Portfolio

React, Vite, JavaScript, and Tailwind CSS portfolio with Vercel serverless API routes.

## Deploy to Vercel

1. Import `azadehahmadi080/PORTFOLIO_AZADEH` from GitHub in Vercel.
2. Keep the project root as `.`. `vercel.json` sets Vite, `npm run build`, and `dist`.
3. Add a Neon Postgres database through Vercel Marketplace. Set `DATABASE_URL` for Production and Preview.
4. Create a Resend API key and verify the sender domain. Set `RESEND_API_KEY` and `MAIL_FROM` in Vercel Environment Variables. Use the verified sender address for `MAIL_FROM`.
5. Redeploy after adding the environment variables.

The `/api/projects` route serves the portfolio project list. The `/api/messages` route emails contact messages to `azadehahmadi080@gmail.com` and stores them in Neon. The messages table is created automatically on the first submission.

## Local development

Run `npm install` and `npm run dev`. The Vite server proxies `/api` to the local Express server. Local messages are stored in SQLite; the deployed API uses Neon. Copy `.env.example` to `.env` and fill in the email credentials to test contact email delivery locally.
