const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Scan = require('./models/Scan');
const { analyzeSourceCode } = require('./analyzer');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

app.post('/api/analyze', async (req, res) => {
    const { code } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'No code provided for analysis.' });
    }

    const results = analyzeSourceCode(code);

    try {
        const newScan = new Scan({
            codeSnippet: code,
            totalIssues: results.totalIssues,
            issuesFound: results.issuesFound
        });
        await newScan.save();
    } catch (dbError) {
        console.error('Failed to save to MongoDB:', dbError);
    }

    res.json(results);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});