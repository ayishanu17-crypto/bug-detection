const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
    codeSnippet: { type: String, required: true },
    totalIssues: { type: Number, required: true },
    issuesFound: { type: Array, required: true },
    correctedCode: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scan', scanSchema);