const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/bug-detector');
        console.log('✅ SUCCESS: Connected to MongoDB database!'); // Make sure this line exists
    } catch (err) {
        console.error('❌ ERROR: MongoDB connection failed:', err.message);
    }
};

module.exports = connectDB;