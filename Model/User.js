const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  studentId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  whatappno: {
    type: Number,
    required: true,
  },
  mobileno: {
    type: Number,
    required: true,
  },
  batchno: {
    type: String,
    required: true,
  },
  paymentstatus: {
    type: String,
    required: true,
  },
  otpToken: {
    type: String,
  },
  otpExpire: {
    type: Date,
  },
  resetPwdToken: {
    type: String,
    default: null,
  },
  resetPwdExpire: {
    type: Date,
    default: null,
  },
  requestedCourses: {
    type: [Number],  // Array to store course IDs the user has requested
    default: [],
  },
  approvedCourses: {
    type: [Number],  // Array to store course IDs approved by the admin
    default: [],
  },
  batches: [
    {
      batchNumber: {
        type: String, // Changed from Number to String
        required: true,
      },
    },
  ],
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
});

const userModel = mongoose.model('UsersLogins', userSchema);
module.exports = userModel;
