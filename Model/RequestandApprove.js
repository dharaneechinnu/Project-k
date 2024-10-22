const mongoose = require('mongoose');

const RequestandApproveSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  mobileno: { type: Number, required: true },
  studentId: { type: String, required: true }, 
  courseId: { type: String, required: true }, 
  courseName: { type: String, required: true },
  Bacthno: { type: String, required: true },
  transactionDate: { type: Date, default: Date.now },
  approve: { type: Boolean, default: false }, 
  COurseComplete: { type: Boolean, default: false },
  approvedAt: { type: Date }, 
  completedAt: { type: Date }, 
});

const RequestandApprove = mongoose.model('Enrolled', RequestandApproveSchema);

module.exports = RequestandApprove;
