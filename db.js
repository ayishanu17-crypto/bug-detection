const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/bug-detector', {
            // Mongoose 6+ connects natively without extra flags
        });
        console.log('MongoDB Connected Successfully.');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;