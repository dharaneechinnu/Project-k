require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Course = require('./Model/Course');
const PORT = process.env.PORT || 3500;
const MONGODB_URL = process.env.MONGO_URL;
const Response = require('./Model/responseSchema ');
// Import routes
const paymentRoutes = require('./Router/Payment');
const authRoutes = require('./Router/Router');
const QuestionRoute = require('./Router/Question')
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

app.get('/responses/course/:courseId/:studentId', async (req, res) => {
  const { courseId, studentId } = req.params;

  try {
    // Fetch the responses from the database
    const responses = await Response.find({ courseId, studentId });

    // Process the data for analysis
    const analysis = {
      totalResponses: responses.length,
      yesCount: 0,
      noCount: 0,
      questions: [], // Store questions and their counts
    };

    // Analyze the responses
    responses.forEach(response => {
      response.responses.forEach(item => { // Iterate over each response's questions
        const questionIndex = analysis.questions.findIndex(q => q.questionText === item.questionText);

        // If question already exists in analysis, update counts
        if (questionIndex > -1) {
          if (item.answer === 'Yes') {
            analysis.questions[questionIndex].yesCount++;
          } else if (item.answer === 'No') {
            analysis.questions[questionIndex].noCount++;
          }
        } else {
          // If it's a new question, create an entry
          const newQuestion = {
            questionText: item.questionText,
            yesCount: item.answer === 'Yes' ? 1 : 0,
            noCount: item.answer === 'No' ? 1 : 0,
          };
          analysis.questions.push(newQuestion);
        }

        // Increment total yes and no counts
        if (item.answer === 'Yes') {
          analysis.yesCount++;
        } else if (item.answer === 'No') {
          analysis.noCount++;
        }
      });
    });

    // Send the processed data to the frontend
    res.json({ responses: analysis.questions }); // Send only the relevant questions data
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ message: 'Error fetching responses' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
