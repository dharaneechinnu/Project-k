require('dotenv').config();
const express = require('express');
const router = express.Router();



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

module.exports = router;