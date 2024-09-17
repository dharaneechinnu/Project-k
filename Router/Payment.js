const express = require('express');
const router = express.Router();
const PaymentController = require('../Controller/PaymentController');

router.route('/create-order').post(PaymentController.createCourse);
router.route('/verify-payment').post(PaymentController.verifyPayment);
router.route('/get-course/:courseId').get(PaymentController.purchaseDetail); // Make sure the route is correct
router.route('/purchased-courses/:studentId').get(PaymentController.getPurchasedCourses);

module.exports = router;
