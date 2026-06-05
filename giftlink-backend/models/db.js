// giftlink-backend/models/db.js
const { MongoClient } = require('mongodb');

// The MONGO_URL will be fetched from your .env file
const url = process.env.MONGO_URL;
let dbInstance = null;

async function connectToDatabase() {
    // If a connection already exists, return it
    if (dbInstance) {
        return dbInstance;
    }

    try {
        // Task 1: Connect to MongoDB
        const client = new MongoClient(url);
        await client.connect();

        // Task 2: Connect to database giftdb and store in variable dbInstance
        // FIXED: Explicitly targeting "giftdb" to align with your lab requirements
        dbInstance = client.db("giftdb"); 

        console.log("Successfully connected to database instance.");

        // Task 3: Return the database instance
        return dbInstance;
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        throw error;
    }
}

module.exports = connectToDatabase;