// models/responseSchema.js
const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  responses: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
      },
      answerType: {
        type: String,
        enum: ['yes-no', 'short-text', 'multiple-choice'],
        required: true,
      },
      answer: {
        type: mongoose.Schema.Types.Mixed, // Can hold a string or an array depending on the question type
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Response = mongoose.model('Response', responseSchema);
module.exports = Response;
