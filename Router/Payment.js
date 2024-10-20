const express = require('express');
const router = express.Router();
const PaymentController = require('../Controller/PaymentController');

router.route('/create-order').post(PaymentController.createCourse);
router.route('/get-course/:courseId').get(PaymentController.purchaseDetail); // Make sure the route is correct
router.route('/purchased-courses/:studentId').get(PaymentController.getPurchasedCourses);
router.route('/purchased/:studentId').get(PaymentController.getPurchased);

module.exports = router;
    