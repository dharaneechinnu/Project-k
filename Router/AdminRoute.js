require('dotenv').config();
const express = require('express');
const router = express.Router();
const verifyToken = require('../Middleware/AdminMiddleware'); // Import the middleware
const { 
  getAllUsers, 
  loginAdmin, 
  registerAdmin, 
  getAdminStats, 
  GetAllcourse, 
  addCourse, 
  editCourse, 
  deleteCourse, 
  registerUserByAdmin, 
  addQuestion, 
  editQuestion, 
  deleteQuestion, 
  unlockCourse, 
  approveCourseRequest, 
  getAllCourseRequests,getUserResponses
} = require('../Controller/AdminController'); // Import controller functions

router.get('/responses/:studentId', getUserResponses);


// Login and Register routes (don't need token verification)
router.route('/adminlogin').post(loginAdmin);
router.route('/adminregister').post(registerAdmin);

// Protect routes with verifyToken middleware
router.route('/alluser').get(verifyToken, getAllUsers); // Get all users (protected)
router.route('/stats').get(verifyToken, getAdminStats); // Admin stats (protected)
router.route('/GetAllcourses').get(verifyToken, GetAllcourse); // Get all courses (protected)

// Admin course management routes (protected)
router.route('/upload-course').post(verifyToken, addCourse); 
router.route('/courses/:courseId').put(verifyToken, editCourse); 
router.route('/courses/:courseId').delete(verifyToken, deleteCourse);

// Admin register user (protected)
router.route('/userRegsiter').post(verifyToken, registerUserByAdmin);

// Question management routes (protected)
router.post('/add-form', verifyToken, addQuestion); 
router.put('/edit-question/:id', verifyToken, editQuestion); 
router.delete('/delete-question/:id', verifyToken, deleteQuestion); 

// Unlock course and approve course requests (protected)
router.put('/unlock-course', verifyToken, unlockCourse);
router.get('/get-all-course-requests', verifyToken, getAllCourseRequests);
router.post('/approve-course-request', verifyToken, approveCourseRequest);

module.exports = router;
