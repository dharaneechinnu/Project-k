const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResponseSchema = new Schema({
  courseId: { type: Number, required: true },
  studentId: { type: Number, required: true },
  responses: [
    {
      questionText: { type: String, required: true }, // Store the full question text
      answerType: { type: String, enum: ['yes-no', 'multiple-choice', 'short-text'], required: true },
      answer: Schema.Types.Mixed, // Store answer based on question type
      responseDate: { type: Date, default: Date.now } // Date for each individual response
    }
  ],
  submissionDate: { type: Date, default: null } // Overall submission date
});

module.exports = mongoose.model('Response', ResponseSchema);
