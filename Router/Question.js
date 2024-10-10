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



// Fetch questions for a specific course
router.get('/courses/:courseId/questions', getQuestions);

// Submit daily responses for a specific course
router.post('/courses/:courseId/submit-daily-responses', submitDailyResponses);

// Check if the student has submitted responses today
router.post('/courses/:courseId/has-submitted-today', hasSubmittedToday);


module.exports = router;
