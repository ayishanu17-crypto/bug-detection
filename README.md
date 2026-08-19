# Debugique (bug-detector)

A code-analysis app with a **React frontend** (`client`) and an **Express + MongoDB backend** (`backend`).

## 🚀 Quick start (Windows)

Double-click **`start.bat`** at the project root. It will:

1. Install any missing dependencies (first run only)
2. Open two windows:
   - **Backend** → `http://localhost:5000`
   - **Frontend** → `http://localhost:5173`

Then open `http://localhost:5173` in your browser. If the offline banner ever shows, it clears itself automatically once the backend is up — or press **Retry**.

## ⚙️ Manual start (two terminals)

```bash
# terminal 1 — backend on :5000
cd backend
npm install
npm start

# terminal 2 — frontend on :5173
cd client
npm install
npm run dev
```

Or, from the project root with one command:

```bash
npm install        # installs `concurrently` once
npm run dev        # starts backend + frontend together
```

## 🗄️ Database

The backend reads `MONGODB_URI` from `backend/.env` (gitignored). If the file is missing, the backend **still starts** — scans just aren't saved to the database, and the server logs a note about it. Analysis never requires the database to be up.