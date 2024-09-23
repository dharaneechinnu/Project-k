const Question = require('../Model/Question'); // Assuming you have a Question model
const Response = require('../Model/responseSchema ')
// Add a new question
const addQuestion = async (req, res) => {
  try {
    const { courseId, questionText, questionType, options } = req.body;
    const newQuestion = new Question({
      courseId,
      questionText,
      questionType,
      options
    });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ message: 'Failed to add question' });
  }
};

// Get questions by course ID
const getQuestionsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const questions = await Question.find({ courseId });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Failed to fetch questions' });
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


// Controller to fetch questions for a specific course
const getQuestions = async (req, res) => {
  try {
    const courseId = req.params.courseId; // Use the string directly
    console.log(courseId)
    const questions = await Question.find({ courseId }); // Query with the string
    res.json(questions);
   
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
};


const submitResponses = async (req, res) => {
  try {
    const { responses, studentId } = req.body; // Extract studentId from request body

    // Debugging statement
    console.log('User ID from token:', req.user);
    console.log('Received studentId:', studentId); // Log the received studentId

    const newResponse = new Response({
      courseId: req.params.courseId,
      studentId, // Use the studentId from the request body
      responses,
    });

    await newResponse.save();
    res.json({ message: 'Responses submitted successfully!' });
  } catch (error) {
    console.error('Error submitting responses:', error);
    res.status(500).send('Server error');
  }
};

const hasSubmittedResponses = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id; // Get student ID from the token

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
  hasSubmittedResponses
};
