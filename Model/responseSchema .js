const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResponseSchema = new Schema({
  courseId: { type: Number, required: true },
  studentId: { type: Number, required: true },
  responses: [
    {
      question: { type: String, }, // Store the full question text instead of ref
      answerType: { type: String, enum: ['yes-no', 'multiple-choice', 'short-text'], required: true },
      answer: Schema.Types.Mixed, // Store answer based on question type
      responseDate: { type: Date, default: Date.now } // Date for each individual response
    }
  ],
  submissionDate: { type: Date, default: null} // Overall submission date
});

module.exports = mongoose.model('Response', ResponseSchema);
