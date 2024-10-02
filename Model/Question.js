const mongoose = require('mongoose');

// Schema for options
const optionSchema = new mongoose.Schema({
  optionText: {
    type: String,
    required: true,
  },
});

// Question Schema
const questionSchema = new mongoose.Schema({
  courseId: { 
    type: String, 
    required: true 
  },
  questionText: {
    type: String,
    required: true,
  },
  answerType: {
    type: String,
    enum: ['yes-no', 'short-text', 'multiple-choice'], // Allowing multiple question types
    required: true,
  },
  options: {
    type: [optionSchema], // Array of options, only used for multiple-choice
    validate: {
      validator: function (v) {
        // If answer type is 'yes-no', ensure exactly two options ('Yes' and 'No')
        if (this.answerType === 'yes-no') {
          return v.length === 2 && v[0].optionText === 'Yes' && v[1].optionText === 'No';
        }
        // For multiple-choice, there should be at least two options
        if (this.answerType === 'multiple-choice') {
          return v.length >= 2;
        }
        // For other types (e.g., 'short-text'), no options should be provided
        return v.length === 0;
      },
      message: 'Invalid options provided for the question type.',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
