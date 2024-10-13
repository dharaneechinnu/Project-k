// routes/responseRoutes.js
const express = require('express');
const router = express.Router();
const { submitResponses, analytics} = require('../Controller/ResponseController');


router.get('/analytics/:courseId/:studentId', analytics);

module.exports = router;
