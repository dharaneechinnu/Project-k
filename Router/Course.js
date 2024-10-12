const express = require('express');
const router = express.Router();
const { getCourse, RequestCourse,getUnlockedCourses,denyCourseRequest,getEnrolled,GetCompleted } = require('../Controller/Course');
const verifyToken = require('../Middleware/AdminMiddleware');

// Route to get all courses
router.get('/get-courses',verifyToken, getCourse);

// Route to request a course (should be POST)
router.post('/request-course', RequestCourse);

router.post('/deny-course-request',denyCourseRequest);

router.get('/unlocked-courses/:userId', getUnlockedCourses);

router.get('/enrolled/:StudentId', getEnrolled);
router.get('/completed/:StudentId', GetCompleted);

module.exports = router;
