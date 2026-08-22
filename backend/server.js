require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import language-specific analyzers
const { analyzeJavaScript } = require('./analyzers/jsAnalyzer');
const { analyzePython } = require('./analyzers/pyAnalyzer');
const { analyzeCCpp } = require('./analyzers/ccppAnalyzer');
const { analyzeJava } = require('./analyzers/javaAnalyzer');

const app = express();

// Render provides PORT automatically.
// Locally, it falls back to 5000.
const PORT = process.env.PORT || 5000;

// -------------------------------------------------------------------------
// Middleware
// -------------------------------------------------------------------------

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000'
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, server-to-server, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  }
}));

app.use(express.json());

// -------------------------------------------------------------------------
// MongoDB connection
// -------------------------------------------------------------------------

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set.');
  console.error('   Running WITHOUT database persistence.');
} else {
  const connectWithRetry = () => {
    const state = mongoose.connection.readyState;

    // 1 = connected, 2 = connecting
    if (state === 1 || state === 2) return;

    mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000
      })
      .then(() => {
        console.log('✅ Connected to MongoDB Atlas successfully!');
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        console.error('   Retrying in 15 seconds...');

        setTimeout(connectWithRetry, 15000);
      });
  };

  connectWithRetry();
}

// -------------------------------------------------------------------------
// MongoDB Schema & Model
// -------------------------------------------------------------------------

const scanSchema = new mongoose.Schema({
  codeSnippet: {
    type: String,
    required: true
  },

  language: {
    type: String,
    default: 'javascript'
  },

  totalIssues: {
    type: Number,
    required: true
  },

  issuesFound: {
    type: Array,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Scan = mongoose.model('Scan', scanSchema);

// -------------------------------------------------------------------------
// File-based history store (fallback used when MongoDB is unavailable)
// -------------------------------------------------------------------------

const LOCAL_HISTORY_FILE = path.join(__dirname, 'local-history.json');
const MAX_LOCAL_RECORDS = 50;

function readLocalHistory() {
  try {
    if (!fs.existsSync(LOCAL_HISTORY_FILE)) return [];
    const parsed = JSON.parse(fs.readFileSync(LOCAL_HISTORY_FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalHistory(entries) {
  try {
    fs.writeFileSync(
      LOCAL_HISTORY_FILE,
      JSON.stringify(entries.slice(0, MAX_LOCAL_RECORDS), null, 2)
    );
  } catch (error) {
    console.error('Failed to write local scan history:', error.message);
  }
}

function saveScanLocally(scanRecord) {
  const next = [scanRecord, ...readLocalHistory()];

  writeLocalHistory(next);
}

// -------------------------------------------------------------------------
// Health check
// -------------------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    db: mongoose.connection.readyState === 1
      ? 'connected'
      : 'disconnected',
    time: new Date().toISOString()
  });
});

// -------------------------------------------------------------------------
// Analyzer mapping
// -------------------------------------------------------------------------

const ANALYZERS = {
  javascript: analyzeJavaScript,
  python: analyzePython,
  cpp: analyzeCCpp,
  c: analyzeCCpp,
  ccpp: analyzeCCpp,
  java: analyzeJava
};

// -------------------------------------------------------------------------
// Analyze route
// -------------------------------------------------------------------------

app.post('/api/analyze', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !String(code).trim()) {
      return res.status(400).json({
        error: 'No code provided.'
      });
    }

    const lang = String(language || 'javascript').toLowerCase();

    const analyze = ANALYZERS[lang] || analyzeJavaScript;

    const analysisResult = analyze(code, lang);

    // Save to MongoDB when connected, otherwise fall back to the local file
    let persisted = false;

    if (mongoose.connection.readyState === 1) {
      try {
        const newScan = new Scan({
          codeSnippet: code,
          language: lang,
          totalIssues: analysisResult.totalIssues,
          issuesFound: analysisResult.issuesFound
        });

        await newScan.save();

        persisted = true;
      } catch (saveError) {
        console.error(
          'Failed to save scan to MongoDB:',
          saveError.message
        );
      }
    }

    if (!persisted) {
      saveScanLocally({
        _id: `local-${Date.now()}`,
        codeSnippet: code,
        language: lang,
        totalIssues: analysisResult.totalIssues,
        issuesFound: analysisResult.issuesFound,
        createdAt: new Date().toISOString()
      });
    }

    res.status(200).json({
      ...analysisResult,
      persisted
    });

  } catch (error) {
    console.error('Analysis error:', error);

    res.status(500).json({
      error: error.message || 'Server error during code analysis.'
    });
  }
});

// -------------------------------------------------------------------------
// History route
// -------------------------------------------------------------------------

app.get('/api/history', async (req, res) => {
  let mongoEntries = [];

  if (mongoose.connection.readyState === 1) {
    try {
      mongoEntries = await Scan
        .find()
        .sort({ createdAt: -1 })
        .limit(20);
    } catch (error) {
      console.error('History fetch error:', error);
    }
  }

  // Merge the database records with the file-backed fallback so history
  // survives even when MongoDB is down and scans were saved locally.
  const localEntries = readLocalHistory();

  const byKey = new Map();
  const keyOf = (e) => `${String(e.codeSnippet)}|${e.language || 'javascript'}|${e.totalIssues}`;

  for (const entry of mongoEntries) {
    if (!byKey.has(keyOf(entry))) byKey.set(keyOf(entry), entry);
  }
  for (const entry of localEntries) {
    if (!byKey.has(keyOf(entry))) byKey.set(keyOf(entry), entry);
  }

  const history = [...byKey.values()]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 50);

  res.status(200).json(history);
});

// -------------------------------------------------------------------------
// Serve built React frontend
// -------------------------------------------------------------------------

const clientDist = path.join(
  __dirname,
  '..',
  'client',
  'dist'
);

if (fs.existsSync(clientDist)) {

  app.use(express.static(clientDist));

  // React SPA fallback
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(
      path.join(clientDist, 'index.html')
    );
  });

  console.log('✅ Serving built frontend from client/dist');

} else {

  console.warn(
    '⚠️ client/dist not found. ' +
    'Run `npm run build --prefix client` to serve the frontend.'
  );
}

// -------------------------------------------------------------------------
// Start server
// -------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});