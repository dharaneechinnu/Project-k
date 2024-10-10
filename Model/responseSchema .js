const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResponseSchema = new Schema({
  courseId: { type: Number, required: true },
  studentId: { type: Number, required: true },
  responses: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
      answerType: { type: String, enum: ['yes-no', 'multiple-choice', 'short-text'], required: true },
      answer: Schema.Types.Mixed // Can store different types depending on the question type
    }
  ],
  submissionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', ResponseSchema);
