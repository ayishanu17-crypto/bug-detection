# Deployment Guide — Debugique (bug-detector)

This app has **two parts** that must both be deployed:

| Part | What it is | Where it runs |
|---|---|---|
| Frontend | React app in `client/` | **Vercel** (static hosting) — already deployed |
| Backend | Express API in `backend/` | **Render** (long-running Node process) — needs deploying |

The deployed site shows the amber *"Backend server is not running"* banner because
**only the frontend has been deployed**. Vercel only serves static files, so every
`/api/*` request returns `404` (its HTML error page — which is also why you see
`Unexpected token 'T', "The page c"... is not valid JSON` in the console).

> Why not deploy the backend to Vercel too? The backend spawns real subprocesses
> (`python`, `gcc`, `javac`) and writes `backend/local-history.json`. Vercel's
> serverless sandbox has a read-only filesystem, short execution limits, and no
> Python/compiler runtimes — so only a persistent-process host (Render, Railway,
> Fly.io, Heroku, …) will work. This project is already wired for Render
> (`server.js` reads `process.env.PORT`).

---

## Part 1 — Deploy the backend to Render (one-time, ~5 minutes)

### Option A: Blueprint (easiest — config already in this repo)

1. Push this repo to GitHub (the `render.yaml` at the repo root does the rest).
2. Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**.
3. Select this repo. Render reads `render.yaml` and creates the `bug-detector-api` service.
4. Render will prompt you for **`MONGODB_URI`** — paste your MongoDB Atlas connection
   string (e.g. `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/bug-detector`).
   If you don't have one yet, create a free cluster at [mongodb.com](https://www.mongodb.com), then click *Connect → Drivers* to copy the URI.
5. Click **Apply** → **Deploy**. Wait for the build to finish (1–2 minutes).
6. Copy the service URL, e.g. `https://bug-detector-api.onrender.com`.
7. Verify: open `https://bug-detector-api.onrender.com/api/health` → you should see
   `{"status":"ok","db":"connected","time":"…"}`.

### Option B: Manual web service

1. Push the repo to GitHub.
2. Render → **New** → **Web Service** → select the repo.
3. Settings: **Root Directory** = `backend`, **Build Command** = `npm install`,
   **Start Command** = `npm start`.
4. Environment variables: `MONGODB_URI` (see step 4 above),
   `CLIENT_URL = https://bug-detection-liart.vercel.app`.
5. Deploy and verify `/api/health` as in Option A step 7.

> Note: The repo includes `backend/Procfile` (`web: npm start`), so the same
> setup also works on Heroku/Railway-style platforms if you prefer.

---

## Part 2 — Point the Vercel frontend at the backend (one-time)

1. Go to your Vercel project (**bug-detection-liart**) →
   **Settings** → **Environment Variables**.
2. Add a new variable:
   - Key: **`VITE_API_URL`**
   - Value: your backend URL from Part 1, e.g. **`https://bug-detector-api.onrender.com`**
   - (Leave the environment as *Production* so the deployed site gets it.)
3. **Redeploy** the project (Deployments → ⋯ → Redeploy) so the variable is baked into the build.
4. Open the site: the amber banner is gone, and **Run Scan / History** work.

`client/src/App.jsx` reads `VITE_API_URL` first; without it, production builds fall
back to same-origin (`""`) — which is exactly what caused the 404 storm on Vercel.

---

## Part 3 — Verify everything

1. `https://bug-detection-liart.vercel.app` — no offline banner.
2. Paste a snippet with a bug (e.g. `const x = ;`) and click **Run Scan** → issues appear.
3. Open **History** → scanned code is listed (from MongoDB, fallback otherwise).
4. Browser console: no `404` / `is not valid JSON` errors.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `404` on `.../api/health` | Backend not deployed, or wrong URL | Part 1; check the exact backend URL |
| Banner stays after deploy | `VITE_API_URL` missing/typo, or backend still starting | Part 2; first boot can take ~30 s (sleeps between requests are fine) |
| `Unexpected token 'T' … is not valid JSON` | A static 404 HTML page was JSON-parsed | Deploy the backend; the client now also guards `res.ok` |
| `Not allowed by CORS` (network tab) | `CLIENT_URL` env missing on backend | Set `CLIENT_URL` to your Vercel URL and redeploy backend |
| `db: "disconnected"` in health JSON | `MONGODB_URI` missing/wrong | Re-enter it in Render → Environment → Save & Redeploy |
| Analyze returns `Python is not available…` | Host lacks `python`/`gcc` buildpack | Optional: enable the Python/compiler buildpacks in Render (basic static checks still work without them) |

## Preventing recurrence

- The backend URL is defined in exactly **one place**: Vercel → `VITE_API_URL`.
- If the banner ever returns, open your browser console — the app now logs the
  exact API base URL it resolved (`[debugique] API_BASE_URL: …`) and only logs the
  first health-check failure, so it's quick to spot whether the config is missing.