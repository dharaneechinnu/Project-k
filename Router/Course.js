const express = require('express');
const router = express.Router();
const { getCourse, RequestCourse,getUnlockedCourses,denyCourseRequest,getEnrolled,getCompletedCourses } = require('../Controller/Course');
const verifyToken = require('../Middleware/AdminMiddleware');

// Route to get all courses
router.get('/get-courses', getCourse);

// Route to request a course (should be POST)
router.post('/request-course', RequestCourse);

router.post('/deny-course-request',denyCourseRequest);

router.get('/unlocked-courses/:userId', getUnlockedCourses);

router.get('/enrolled/:studentId', getEnrolled);
router.get('/completed/:studentId', getCompletedCourses);

module.exports = router;
