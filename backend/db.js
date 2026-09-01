require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bug-detector';
        await mongoose.connect(uri);
        console.log('✅ SUCCESS: Connected to MongoDB database!');
    } catch (err) {
        console.error('❌ ERROR: MongoDB connection failed:', err.message);
    }
};

module.exports = connectDB;