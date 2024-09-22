// models/Question.js
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  optionText: {
    type: String,
    required: true,
  },
});

const questionSchema = new mongoose.Schema({
  courseId: { type: String, required: true }, 
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [optionSchema], // Array of options without correctness check
    validate: {
      validator: (v) => v.length === 2, // Ensure exactly two options
      message: 'There should be exactly two options (Yes and No).',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  questionType: {
    type: String,
    enum: ['yes-no'], // Only allowing yes-no type
    required: true,
  },
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
