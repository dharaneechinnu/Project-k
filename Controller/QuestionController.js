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

  getQuestionsByCourse,

  getQuestions,
  submitResponses,
  hasSubmittedResponses,
};
