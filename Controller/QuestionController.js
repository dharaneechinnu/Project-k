const Question = require('../Model/Question'); // Assuming you have a Question model
const Response = require('../Model/responseSchema ');



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

// Get questions for a specific course (same questions every day)
const getQuestions = async (req, res) => {
  try {
    const { courseId } = req.params;
    const questions = await Question.find({ courseId }); // Always fetch the same questions for the course

    if (!questions.length) {
      return res.status(404).json({ message: 'No questions found for this course.' });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
};

// Submit daily responses
const submitDailyResponses = async (req, res) => {
  try {
    const { responses, studentId } = req.body;
    const { courseId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    // Check if the student has already submitted responses today
    const existingResponse = await Response.findOne({
      studentId,
      courseId,
      submissionDate: { $gte: today }
    });

    if (existingResponse) {
      return res.status(400).json({ message: 'You have already submitted responses for today.' });
    }

    // Create a new response
    const newResponse = new Response({
      studentId,
      courseId,
      responses,
      submissionDate: new Date()
    });

    await newResponse.save();
    res.status(200).json({ message: 'Responses submitted successfully!' });
  } catch (error) {
    console.error('Error submitting responses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if the student has submitted today
const hasSubmittedToday = async (req, res) => {
  try {
    const  { studentId, courseId } = req.body;
    console.log("studentId : ",studentId,"courseid : ",courseId);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    const existingResponse = await Response.findOne({
      studentId,
      courseId,
      submissionDate: { $gte: today }
    });

    if (existingResponse) {
      return res.status(200).json({ hasSubmittedToday: true });
    } else {
      return res.status(200).json({ hasSubmittedToday: false });
    }
  } catch (error) {
    console.error('Error checking submission:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {

  getQuestionsByCourse,

  getQuestions,
  submitDailyResponses,
  hasSubmittedToday,
};
