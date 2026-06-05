// giftlink-backend/routes/giftRoutes.js
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// GET all gifts
router.get('/', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB and store connection to db constant
        const db = await connectToDatabase();

        // Task 2: Use the collection() method to retrieve the gift collection
        const collection = db.collection("gifts");

        // Task 3: Fetch all gifts using the collection.find method. 
        // Chain with toArray method to convert to JSON array
        const gifts = await collection.find({}).toArray();

        // Task 4: Return the gifts using the res.json method
        res.json(gifts);
    } catch (e) {
        console.error("Error fetching gifts:", e);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;

// GET a specific gift by ID
router.get('/:id', async (req, res) => {
    try {
        // Retrieve the ID parameter from the request URL
        const id = req.params.id;

        // Task 1: Connect to MongoDB and store connection to db constant
        const db = await connectToDatabase();

        // Task 2: Use the collection() method to retrieve the gift collection
        const collection = db.collection("gifts");

        // Task 3: Find a specific gift by ID using the collection.findOne method 
        // and store in a constant called gift
        const gift = await collection.findOne({ id: id });

        // Check if the gift exists, if not return a 404 status
        if (!gift) {
            return res.status(404).send("Gift not found");
        }

        // Return the single gift document
        res.json(gift);
    } catch (e) {
        console.error("Error fetching gift by ID:", e);
        res.status(500).send("Internal Server Error");
    }
});