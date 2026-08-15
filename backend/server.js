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
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas successfully!'))
  .catch((error) => console.error('MongoDB connection error:', error));

// 2. Define MongoDB Schema & Model for Scan History
const scanSchema = new mongoose.Schema({
    codeSnippet: { type: String, required: true },
    language: { type: String, default: 'javascript' },
    totalIssues: { type: Number, required: true },
    issuesFound: { type: Array, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Scan = mongoose.model('Scan', scanSchema);

// 3. Analyze Route (Routes based on selected language)
app.post('/api/analyze', async (req, res) => {
    try {
        const { code, language } = req.body;
        
        if (!code) {
            return res.status(400).json({ error: 'No code provided.' });
        }

        const analysisResult = analyzeJavaScript(code);

        // Save scan result to MongoDB Atlas
        const newScan = new Scan({
            codeSnippet: code,
            language: 'javascript',
            totalIssues: analysisResult.totalIssues,
            issuesFound: analysisResult.issuesFound
        });
        await newScan.save();

        res.status(200).json(analysisResult);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: error.message || 'Server error during code analysis.' });
    }
});

// 4. History Route
app.get('/api/history', async (req, res) => {
    try {
        const history = await Scan.find().sort({ createdAt: -1 }).limit(20);
        res.status(200).json(history);
    } catch (error) {
        console.error('History fetch error:', error);
        res.status(500).json({ error: 'Server error fetching history.' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});