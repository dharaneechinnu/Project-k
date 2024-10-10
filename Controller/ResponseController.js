const Question = require('../Model/Question');
const Response = require('../Model/responseSchema '); // Assuming your schema is named 'Response'

// Controller function to handle responses submission
const submitResponses = async (req, res) => {
  const { courseId, studentId } = req.params;
  const { responses } = req.body;

  try {
    // Validate that all questions being responded to exist
    const questionIds = responses.map(r => r.questionId);
    const questions = await Question.find({ _id: { $in: questionIds }, courseId });

    if (questions.length !== responses.length) {
      return res.status(400).json({ message: 'Invalid question IDs or mismatched questions.' });
    }

    // Prepare the responses for saving
    const formattedResponses = responses.map(response => {
      const question = questions.find(q => q._id.toString() === response.questionId);

      if (!question) {
        throw new Error(`Question with ID ${response.questionId} does not exist.`);
      }

      // Validation based on question type
      if (question.answerType === 'yes-no') {
        if (response.answer !== 'Yes' && response.answer !== 'No') {
          throw new Error(`Invalid response for yes-no question. Expected 'Yes' or 'No'.`);
        }
      }

      if (question.answerType === 'multiple-choice') {
        if (!Array.isArray(response.answer) || response.answer.length === 0) {
          throw new Error(`Invalid response for multiple-choice question. Expected a non-empty array.`);
        }
      }

      return {
        questionId: response.questionId,
        answerType: question.answerType,
        answer: response.answer,
      };
    });

    // Create a new Response document
    const newResponse = new Response({
      courseId,
      studentId,
      responses: formattedResponses,
    });

    await newResponse.save();
    res.status(201).json({ message: 'Responses submitted successfully!' });
  } catch (error) {
    console.error('Error submitting responses:', error);
    res.status(500).json({ message: 'Error submitting responses', error: error.message });
  }
};

// Controller function to provide analytics
const analytics = async (req, res) => {
  const { courseId, studentId } = req.params;

  try {
    // Fetch all responses for the course and studentId
    const responses = await Response.find({ courseId, studentId }).populate('responses.questionId');

    // Create a map to aggregate the analytics for each question
    const questionAnalytics = new Map();

    // Process each response
    responses.forEach((response) => {
      response.responses.forEach((item) => {
        const questionIdStr = item.questionId._id.toString();

        // Initialize the map for each question
        if (!questionAnalytics.has(questionIdStr)) {
          questionAnalytics.set(questionIdStr, {
            questionId: item.questionId._id,
            questionText: item.questionId.questionText,
            answerType: item.answerType,
            yesCount: 0,
            noCount: 0,
            options: {},
            shortTextResponses: [] // For storing short-text responses
          });
        }

        // Retrieve the current analytics for the question
        const questionData = questionAnalytics.get(questionIdStr);

        // Update counts based on the answer type
        if (item.answerType === 'yes-no') {
          if (item.answer === 'Yes') {
            questionData.yesCount++;
          } else if (item.answer === 'No') {
            questionData.noCount++;
          }
        } else if (item.answerType === 'multiple-choice') {
          const answers = Array.isArray(item.answer) ? item.answer : [item.answer];
          answers.forEach((answer) => {
            if (!questionData.options[answer]) {
              questionData.options[answer] = 1;
            } else {
              questionData.options[answer]++;
            }
          });
        } else if (item.answerType === 'short-text') {
          questionData.shortTextResponses.push(item.answer);
        }

        // Update the map with the modified data
        questionAnalytics.set(questionIdStr, questionData);
      });
    });

    // Convert the map to an array for sending to the frontend
    const analyticsArray = Array.from(questionAnalytics.values());

    // Send the processed data to the frontend
    res.json({ questions: analyticsArray });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};

module.exports = {
  submitResponses,
  analytics
};
