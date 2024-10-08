require('dotenv').config();
const express = require('express');
const router = express.Router();

const {addQuestion ,editQuestion,deleteQuestion,unlockCourse,approveCourseRequest,getAllCourseRequests} =require('../Controller/AdminController')

//login and register
router.route('/adminlogin').post(require('../Controller/AdminController').loginAdmin)
router.route('/adminregister').post(require('../Controller/AdminController').registerAdmin)


//user all Details Get
router.route('/alluser').get(require('../Controller/AdminController').getAllUsers);
router.route('/stats').get(require('../Controller/AdminController').getAdminStats);
router.route('/GetAllcourses').get(require('../Controller/AdminController').GetAllcourse);



router.route('/upload-course').post(require('../Controller/AdminController').addCourse);
router.route('/courses/:courseId').put(require('../Controller/AdminController').editCourse);
router.route('/courses/:courseId').delete(require('../Controller/AdminController').deleteCourse)

//admin to regsiter

router.route('/userRegsiter').post(require('../Controller/AdminController').registerUserByAdmin)




// Add a new question
router.post('/add-form', addQuestion); // Protect this route
// Edit a question
router.put('/edit-question/:id', editQuestion); // Protect this route

// Delete a question
router.delete('/delete-question/:id', deleteQuestion); // Protect this route

//Unlock Course
router.put('/unlock-course', unlockCourse);
router.get('/get-all-course-requests', getAllCourseRequests);
router.post('/approve-course-request', approveCourseRequest); // Add this line for approving course requests

module.exports = router;