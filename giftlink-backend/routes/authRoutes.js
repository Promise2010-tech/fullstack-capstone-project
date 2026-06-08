// Step 1 - Task 2: Import necessary packages
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');  // Import Pino logger

// Step 1 - Task 3: Create a Pino logger instance
const logger = pino();  // Create a Pino logger instance

dotenv.config();

// Step 1 - Task 4: Create JWT secret with a reliable fallback value
const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secure_secret_key_12345";

// Step 2: Implement the /register endpoint
router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB through `connectToDatabase`
        const db = await connectToDatabase();

        // Task 2: Access MongoDB collection
        const collection = db.collection("users");

        // Task 3: Check for existing email
        const existingEmail = await collection.findOne({ email: req.body.email });
        if (existingEmail) {
            logger.warn(`Registration rejected: Email ${req.body.email} already exists.`);
            return res.status(400).json({ error: 'Email is already registered.' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email = req.body.email;

        // Task 4: Save user details in database
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });

        // Task 5: Create JWT authentication with user._id as payload
        const payload = {
            user: {
                id: newUser.insertedId
            }
        };

        // Uses our guaranteed fallback if process.env failed
        const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        logger.info('User registered successfully');
        res.json({ authtoken, email });
        
    } catch (e) {
         logger.error(`Internal server error inside registration module: ${e.message}`);
         return res.status(500).send('Internal server error');
    }
});

module.exports = router;