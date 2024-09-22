const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  responses: { type: Object, required: true }, // or whatever structure you need
});

module.exports = mongoose.model('Response', responseSchema);
