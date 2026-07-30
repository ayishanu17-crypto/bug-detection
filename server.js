const express = require('express');
const cors = require('cors');
const { analyzeSourceCode } = require('./analyzer');

const app = express();
app.use(express.json());
app.use(cors());

// API endpoint to analyze code
app.post('/api/analyze', (req, res) => {
    const { code } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'No code provided for analysis.' });
    }

    const results = analyzeSourceCode(code);
    res.json(results);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Bug detector backend running on port ${PORT}`);
});