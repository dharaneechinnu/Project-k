require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;
const MONGODB_URL = process.env.MONGO_URL;
// Import routes
const paymentRoutes = require('./Router/Payment');
const authRoutes = require('./Router/Router');
const QuestionRoute = require('./Router/Question')
const  courseRoutes = require('./Router/Course');
const responseRoutes = require('./Router/Response')
// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect(MONGODB_URL)
  .then(() => console.log('Database is connected'))
  .catch(err => console.error('Error connecting to the database:', err.message));

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/Auth', authRoutes);
app.use('/payment', paymentRoutes);
app.use('/api', QuestionRoute);
app.use('/course',courseRoutes)
app.use('/response',responseRoutes)


//API Admin Routes

app.use('/Admin',require('./Router/AdminRoute'))




app.listen(3500, '0.0.0.0', () => {
  console.log('Server is running on port 3500');
});
