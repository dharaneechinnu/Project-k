const mongoose = require('mongoose');

const RequestandApproveSchema = new mongoose.Schema({
  studentId: { type: String, required: true }, // Student ID
  courseId: { type: String, required: true }, // Course ID
  Bacthno: { type: String, required: true }, // Batch number
  transactionDate: { type: Date, default: Date.now }, // Date when the request is made
  approve: { type: Boolean, default: false }, // Approval status, default is false
  approvedAt: { type: Date }, 
});

const RequestandApprove = mongoose.model('Enrolled', RequestandApproveSchema);

module.exports = RequestandApprove;
