require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Course = require('./Model/Course');
const PORT = process.env.PORT || 3500;
const MONGODB_URL = process.env.MONGO_URL;

// Import routes
const paymentRoutes = require('./Router/Payment');
const authRoutes = require('./Router/Router');

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

app.post('/upload-course', async (req, res) => {
  const { courseId, courseName, courseDescription, subjectId, amount, imageUrl } = req.body;

  try {
    const newCourse = new Course({
      courseId,
      courseName,
      courseDescription,
      subjectId,
      amount,
      imageUrl
    });
    await newCourse.save();
    res.status(201).json({ message: 'Course uploaded successfully!', course: newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading course', error: error.message });
  }
});

// Get All Courses
app.get('/get-courses', async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
