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

const submitDailyResponses = async (req, res) => {
  try {
    const { responses, studentId } = req.body;
    const { courseId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize the time to midnight to compare only by date

    // Check if the student has already submitted responses for the current day
    const existingResponse = await Response.findOne({
      studentId,
      courseId,
      submissionDate: { $gte: today }, // Find submissions made on or after today (same day)
    });

    if (existingResponse) {
      return res.status(400).json({ message: 'You have already submitted responses for today.' });
    }

    // Create and save the new response for today
    const newResponse = new Response({
      studentId,
      courseId,
      responses,
      submissionDate: new Date(), // Store the exact submission time
    });

    await newResponse.save();
    res.status(200).json({ message: 'Responses submitted successfully for today!' });
  } catch (error) {
    console.error('Error submitting daily responses:', error);
    res.status(500).send('Server error');
  }
};

const hasSubmittedToday = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize the time to check by date only

    const existingResponse = await Response.findOne({
      studentId,
      courseId,
      submissionDate: { $gte: today },
    });

    if (existingResponse) {
      return res.status(200).json({ hasSubmittedToday: true });
    } else {
      return res.status(200).json({ hasSubmittedToday: false });
    }
  } catch (error) {
    console.error('Error checking submission:', error);
    res.status(500).send('Server error');
  }
};


module.exports = {

  getQuestionsByCourse,

  getQuestions,
  submitDailyResponses,
  hasSubmittedToday,
};
