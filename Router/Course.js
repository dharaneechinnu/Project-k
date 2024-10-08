const express = require('express');
const router = express.Router();
const { getCourse, RequestCourse,getUnlockedCourses } = require('../Controller/Course');

// Route to get all courses
router.get('/get-courses', getCourse);

// Route to request a course (should be POST)
router.post('/request-course', RequestCourse);


router.get('/unlocked-courses/:userId', getUnlockedCourses);

module.exports = router;
