require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import language-specific analyzers
const { analyzeJavaScript } = require('./analyzers/jsAnalyzer'); // JavaScript (Acorn AST)
const { analyzePython } = require('./analyzers/pyAnalyzer');
const { analyzeCCpp } = require('./analyzers/ccppAnalyzer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*'
}));
app.use(express.json());

/* -------------------------------------------------------------------------
 * MongoDB connection (non-fatal)
 * The API keeps working even when the database is unreachable — analysis is
 * pure computation. History persistence is simply skipped while the DB is
 * down, and the connection retries automatically in the background.
 * ---------------------------------------------------------------------- */
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set (is backend/.env missing?).');
  console.error('   Running WITHOUT database persistence — scan history will not be saved.');
} else {
  const connectWithRetry = () => {
    const state = mongoose.connection.readyState;
    // 1 = connected, 2 = connecting — nothing to do
    if (state === 1 || state === 2) return;

    mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
      .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        console.error('   Retrying in 15 seconds…');
        setTimeout(connectWithRetry, 15000);
      });
  };
  connectWithRetry();
}

// MongoDB Schema & Model for Scan History
const scanSchema = new mongoose.Schema({
    codeSnippet: { type: String, required: true },
    language: { type: String, default: 'javascript' },
    totalIssues: { type: Number, required: true },
    issuesFound: { type: Array, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Scan = mongoose.model('Scan', scanSchema);

/* -------------------------------------------------------------------------
 * Health check — lets the frontend know the server is reachable.
 * ---------------------------------------------------------------------- */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    time: new Date().toISOString()
  });
});

// Map the language sent by the frontend to the right analyzer.
// (Java has no dedicated analyzer yet, so it falls back to the JS rules.)
const ANALYZERS = {
  javascript: analyzeJavaScript,
  python: analyzePython,
  cpp: analyzeCCpp,
  c: analyzeCCpp,
  ccpp: analyzeCCpp,
  java: analyzeJavaScript
};

/* -------------------------------------------------------------------------
 * Analyze route — routes to the analyzer matching the selected language.
 * ---------------------------------------------------------------------- */
app.post('/api/analyze', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !String(code).trim()) {
      return res.status(400).json({ error: 'No code provided.' });
    }

    const lang = String(language || 'javascript').toLowerCase();
    const analyze = ANALYZERS[lang] || analyzeJavaScript;
    const analysisResult = analyze(code, lang);

    // Save to MongoDB only when it is connected.
    // A failed save must never block the analysis result.
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
        console.error('Failed to save scan to MongoDB:', saveError.message);
      }
    }

    res.status(200).json({ ...analysisResult, persisted });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message || 'Server error during code analysis.' });
  }
});

/* -------------------------------------------------------------------------
 * History route — returns an empty list when the DB is unreachable.
 * ---------------------------------------------------------------------- */
app.get('/api/history', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(200).json([]);
  }
  try {
    const history = await Scan.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json(history);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(200).json([]);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});