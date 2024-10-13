const express = require('express');
const router = express.Router();
const {

  getQuestionsByCourse,

  getQuestions,
  submitResponses
} = require('../Controller/QuestionController');
const verifyToken = require('../Middleware/AdminMiddleware'); // Adjust path as necessary


// Get questions by course ID
router.get('/questions/course/:courseId',verifyToken, getQuestionsByCourse); // Protect this route



// Fetch questions for a specific course
router.get('/courses/:courseId/questions', getQuestions);

// Submit daily responses for a specific course
router.post('/courses/:courseId/submit-daily-responses', submitResponses);


module.exports = router;
