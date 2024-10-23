require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;
const MONGODB_URL = process.env.MONGO_URL;

// Import routes
const paymentRoutes = require('./Router/Payment');
const authRoutes = require('./Router/Router');
const QuestionRoute = require('./Router/Question');
const courseRoutes = require('./Router/Course');
const responseRoutes = require('./Router/Response');

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Debug middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// API routes
app.use('/Auth', authRoutes);
app.use('/payment', paymentRoutes);
app.use('/api', QuestionRoute);
app.use('/course', courseRoutes);
app.use('/response', responseRoutes);
app.use('/Admin', require('./Router/AdminRoute'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Connect to MongoDB
mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log('Database is connected');
        // Start server only after DB connection
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1);
    });