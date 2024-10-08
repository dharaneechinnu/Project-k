const express = require('express');
const router = express.Router();
const {
  addQuestion,
  getQuestionsByCourse,
  editQuestion,
  deleteQuestion,
  getQuestions,
  submitDailyResponses,
  hasSubmittedToday
} = require('../Controller/QuestionController');
const verifyToken = require('../Middleware/authMiddleware'); // Adjust path as necessary


// Get questions by course ID
router.get('/questions/course/:courseId', getQuestionsByCourse); // Protect this route


// Route to fetch questions for a specific course
router.get('/courses/:courseId/questions', getQuestions); // Protect this route

// Submit daily responses for a course
router.post('/courses/:courseId/submit-daily-responses', submitDailyResponses);

// Check if a student has submitted responses for a course today
router.post('/courses/:courseId/has-submitted-today', hasSubmittedToday);

module.exports = router;
