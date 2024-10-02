const Question = require('../Model/Question'); // Assuming you have a Question model
const Response = require('../Model/responseSchema ');


// Add new questions
const addQuestion = async (req, res) => {
  try {
    const { courseId, questions } = req.body;

    // Validate courseId and questions
    if (!courseId) {
      throw new Error("courseId is required.");
    }
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      throw new Error("Questions must be a non-empty array.");
    }

    // Iterate over each question and create a new Question document
    const newQuestions = await Promise.all(questions.map(async (question) => {
      const { questionText, answerType, options } = question;

      // Debugging statements to verify incoming data
      console.log('Received question:', question);

      // Ensure questionText and answerType are provided
      if (!questionText || !answerType) {
        throw new Error("Each question must have a questionText and answerType.");
      }

      // Handle different question types
      let formattedOptions = [];
      if (answerType === 'multiple-choice') {
        if (!Array.isArray(options) || options.length < 2) {
          throw new Error("Multiple-choice questions must have at least two options.");
        }
        formattedOptions = options.map((opt) => ({
          optionText: opt.optionText || 'Option', // Ensure each option has a text value
        }));
      } else if (answerType === 'yes-no') {
        formattedOptions = [{ optionText: 'Yes' }, { optionText: 'No' }];
      }

      // Create and save the new question
      const newQuestion = new Question({
        courseId,
        questionText,
        answerType, // Use the correct field name 'answerType'
        options: formattedOptions,
      });

      return await newQuestion.save();
    }));

    res.status(201).json(newQuestions);
  } catch (error) {
    console.error('Error adding questions:', error);
    res.status(500).json({ message: 'Failed to add questions', error: error.message });
  }
};

const getQuestionsByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId; // Use the courseId from request parameters
    const questions = await Question.find({ courseId }); // Query with the courseId

    if (!questions) {
      return res.status(404).json({ message: 'No questions found for this course' });
    }

    // Format the questions with required details
    const formattedQuestions = questions.map(question => ({
      _id: question._id,
      questionText: question.questionText,
      questionType: question.answerType,
      options: question.options.map(opt => opt.optionText), // Extract option text
    }));

    res.json(formattedQuestions); // Send formatted questions back to the client
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
};


// Edit a question
const editQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error editing question:', error);
    res.status(500).json({ message: 'Failed to edit question' });
  }
};

// Delete a question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Failed to delete question' });
  }
};

// Get questions for a specific course
const getQuestions = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log(courseId);
    const questions = await Question.find({ courseId });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
};

// Submit responses for a course
const submitResponses = async (req, res) => {
  try {
    const { responses, studentId } = req.body;
console.log("Response of the question : ",responses)
    // Debugging statement
    console.log('User ID from token:', req.user);
    console.log('Received studentId:', studentId);

    const newResponse = new Response({
      courseId: req.params.courseId,
      studentId,
      responses,
    });

    await newResponse.save();
    res.json({ message: 'Responses submitted successfully!' });
  } catch (error) {
    console.error('Error submitting responses:', error);
    res.status(500).send('Server error');
  }
};

// Check if a student has submitted responses
const hasSubmittedResponses = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    console.log('student id : ', studentId);

    const response = await Response.findOne({ courseId, studentId });

    if (response) {
      return res.status(200).json({ hasSubmitted: true });
    } else {
      return res.status(200).json({ hasSubmitted: false });
    }
  } catch (error) {
    console.error('Error checking submission:', error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  addQuestion,
  getQuestionsByCourse,
  editQuestion,
  deleteQuestion,
  getQuestions,
  submitResponses,
  hasSubmittedResponses,
};
