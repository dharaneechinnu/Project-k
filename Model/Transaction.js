const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    studentId: { type: String, required: true }, // Student ID
  courseId: { type: String, required: true }, // Course ID
  courseName: { type: String, required: true }, // Course Name
  amount: { type: Number, required: true }, // Amount in paise
  paymentId: { type: String, required: true }, // Payment ID from Razorpay
  transactionDate: { type: Date, default: Date.now }, // Date of transaction
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
