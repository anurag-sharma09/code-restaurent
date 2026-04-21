const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;

        // If no URI provided, use in-memory database
        if (!uri || uri.includes('localhost')) {
            console.log('No valid MONGODB_URI found. Starting In-Memory MongoDB...');
            const mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            console.log('In-Memory MongoDB started successfully.');
        }

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;

