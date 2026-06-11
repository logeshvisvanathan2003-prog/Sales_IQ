# SalesIQ — Deployment Guide

## Stack
- **Frontend** → Vercel
- **Backend** → Render
- **Database** → Neon (PostgreSQL)

---

## Step 1 — Neon Database

1. Go to https://neon.tech → Sign up free
2. Click **New Project** → name it `salesiq`
3. Copy the **Connection String** (looks like `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`)
4. Open the **SQL Editor** in Neon and paste + run the contents of `backend/src/db/schema.sql`
5. Then run `backend/src/db/seed.js` locally to seed data:
   ```bash
   cd backend
   DATABASE_URL="your-neon-connection-string" node src/db/seed.js
   ```

---

## Step 2 — Backend on Render

1. Push this project to GitHub
2. Go to https://render.com → New → **Web Service**
3. Connect your GitHub repo
4. Set these:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
   - **Environment**: Node
5. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | *(your Neon connection string)* |
   | `FRONTEND_URL` | *(set after Vercel deploy, e.g. `https://salesiq.vercel.app`)* |
6. Click **Deploy** — Render gives you a URL like `https://salesiq-backend.onrender.com`

---

## Step 3 — Frontend on Vercel

1. Go to https://vercel.com → New Project → import your GitHub repo
2. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App
3. Add **Environment Variable**:
   | Key | Value |
   |-----|-------|
   | `REACT_APP_API_URL` | `https://salesiq-backend.onrender.com/api` |
4. Click **Deploy** — Vercel gives you a URL like `https://salesiq.vercel.app`

---

## Step 4 — Update CORS on Render

Go back to Render → your backend service → Environment Variables:
- Update `FRONTEND_URL` to your Vercel URL (e.g. `https://salesiq.vercel.app`)
- Click **Save** → Render auto-redeploys

---

## Local Development

```bash
# Backend
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev            # runs on :5000

# Frontend (new terminal)
cd frontend
cp .env.example .env.local
# set REACT_APP_API_URL=http://localhost:5000/api
npm install
npm start              # runs on :3000
```
