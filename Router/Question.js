const express = require('express');
const router = express.Router();
const { 
  addQuestion, 
  getQuestionsByCourse, 
  editQuestion, 
  deleteQuestion,
  getQuestions,
  submitResponses 
} = require('../Controller/QuestionController');

// Add a new question
router.post('/add-question', addQuestion);

// Get questions by course ID
router.get('/questions/course/:courseId', getQuestionsByCourse);

// Edit a question
router.put('/edit-question/:id', editQuestion);

// Delete a question
router.delete('/delete-question/:id', deleteQuestion);

// Route to fetch questions for a specific course
router.get('/courses/:courseId/questions',getQuestions);

// Route to submit responses
router.post('/courses/:courseId/submit-responses', submitResponses);

module.exports = router;
