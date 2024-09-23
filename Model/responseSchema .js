const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  courseId: { type:Number, ref: 'Course', required: true },
  studentId: { type: Number, ref: 'User', required: true },
  responses: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
      answer: { type: String, required: true }, // or Array if you want to store multiple answers (e.g., for checkboxes)
      questionText: { type: String }, // Optional, if you want to store the question text
      options: { type: [String] }, // Optional, if you want to store the available options
    },
  ],
});

module.exports = mongoose.model('Response', responseSchema);
