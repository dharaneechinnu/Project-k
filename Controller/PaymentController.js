require('dotenv').config();
const Course = require('../Model/Course');
const User = require('../Model/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../Model/Transaction')
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_SECRET,
});

const createCourse = async (req, res) => {
  const { courseId, userId } = req.body;

  try {
    const course = await Course.findOne({ courseId });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const order = await razorpay.orders.create({
      amount: course.amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${courseId}_${userId}`,
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Ensure this function exists in your PaymentController
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, studentId, amount, courseName } = req.body;
  
  try {
    // Construct the string for verification
    const shasum = crypto.createHmac('sha256', RAZORPAY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');
    
    if (digest === razorpay_signature) {
      // Signature is valid
      // Update user document and save purchase details here
      const user = await User.findOne({ studentId: studentId });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!user.purchasedCourses.includes(courseId)) {
        user.purchasedCourses.push(courseId);
        await user.save();
      }

      // Save transaction details
      const transaction = new Transaction({
        studentId: studentId,
        courseId,
        amount,
        courseName,
        paymentId: razorpay_payment_id,
        status: 'Completed'
      });
      await transaction.save();

      res.send({ message: 'Payment verified and course purchased successfully!' });
    } else {
      // Signature is invalid
      res.status(400).send({ message: 'Invalid payment signature.' });
    }
  } catch (error) {
    console.error('Error verifying payment', error);
    res.status(500).send({ message: 'Payment verification failed. Please try again.' });
  }
};


// Ensure you have this function in PaymentController
const purchaseDetail = async (req, res) => {
  const { courseId } = req.params;  // Use courseId instead of studentId
  console.log(courseId);

  try {
    const course = await Course.findOne({ courseId }); // Assuming courseId is a unique identifier
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course details', error: error.message });
  }
};

// PaymentController.js
const getPurchasedCourses = async (req, res) => {
  const { studentId } = req.params;

  try {
    const transactions = await Transaction.find({ studentId });
    const courseIds = transactions.map(transaction => transaction.courseId);
    res.status(200).json(courseIds);
  } catch (error) {
    console.error('Error fetching purchased courses', error);
    res.status(500).send({ message: 'Failed to fetch purchased courses.' });
  }
};
const getPurchased = async (req, res) => {
  const { studentId } = req.params;

  try {
    const transactions = await Transaction.find({ studentId });
  
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching purchased courses', error);
    res.status(500).send({ message: 'Failed to fetch purchased courses.' });
  }
};



module.exports = { createCourse, verifyPayment, purchaseDetail,getPurchasedCourses,getPurchased };
