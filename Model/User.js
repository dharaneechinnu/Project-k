// userModel.js
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
  // Added purchasedCourses field
  purchasedCourses: {
    type: [Number],  // Array to store course IDs
    default: [],     // Default to an empty array if no courses have been purchased
  },
});

const userModel = mongoose.model('UsersLogins', userSchema);
module.exports = userModel;
