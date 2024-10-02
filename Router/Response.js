// routes/responseRoutes.js
const express = require('express');
const router = express.Router();
const { submitResponses, analytics} = require('../Controller/ResponseController');

// Define the route and attach the controller function
router.post('/submit-responses/:courseId/:studentId', submitResponses);
router.get('/analytics/:courseId/:studentId', analytics);

module.exports = router;
