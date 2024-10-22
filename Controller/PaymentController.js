require('dotenv').config();
const Course = require('../Model/Course');
const User = require('../Model/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../Model/RequestandApprove')



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


const purchaseDetail = async (req, res) => {
  const { courseId } = req.params;  
  console.log(courseId);

  try {
    const course = await Course.findOne({ courseId }); 
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course details', error: error.message });
  }
};


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



module.exports = { createCourse, purchaseDetail,getPurchasedCourses,getPurchased };
