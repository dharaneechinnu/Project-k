const express = require('express');
const router = express.Router();
const {
  addQuestion,
  getQuestionsByCourse,
  editQuestion,
  deleteQuestion,
  getQuestions,
  submitResponses,
  hasSubmittedResponses
} = require('../Controller/QuestionController');
const verifyToken = require('../Middleware/authMiddleware'); // Adjust path as necessary


// Get questions by course ID
router.get('/questions/course/:courseId', getQuestionsByCourse); // Protect this route


// Route to fetch questions for a specific course
router.get('/courses/:courseId/questions', getQuestions); // Protect this route

// Submit responses (protected)
router.post('/courses/:courseId/submit-responses', verifyToken, submitResponses);
router.post('/courses/:courseId/has-submitted', hasSubmittedResponses);

module.exports = router;
