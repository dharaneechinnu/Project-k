const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming you use ObjectId for course references
    ref: 'Course',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming you use ObjectId for student references
    ref: 'User',
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
  submissionDate: {
    type: Date,
    default: Date.now, // Automatically store the date of submission
  },
});

responseSchema.index({ studentId: 1, courseId: 1, submissionDate: 1 }, { unique: true });

const Response = mongoose.model('Response', responseSchema);
module.exports = Response;
