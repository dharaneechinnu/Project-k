const Question = require('../Model/Question');
const Response = require('../Model/responseSchema '); // Assuming your schema is named 'Response'

const submitResponses = async (req, res) => {
  const { courseId, studentId } = req.params; // Extract courseId and studentId from params
  const { responses } = req.body; // Get the responses from the request body

  try {
    // Log the incoming responses to check the structure
    console.log('Received responses:', responses);

    // Check if responses exist and are in the correct format
    if (!Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ message: 'No responses provided or invalid format.' });
    }

    // Find the existing response document for the given course and student
    let responseDoc = await Response.findOne({ courseId, studentId });

    if (!responseDoc) {
      // If no document exists, create a new one
      responseDoc = new Response({
        courseId,
        studentId,
        responses: [], // Initialize the responses as an empty array
      });
    }

    // Loop through the new responses and update/add to the existing response array
    responses.forEach((newResponse) => {
      // Check if all required fields are present in the new response
      if (!newResponse.question || !newResponse.answerType || typeof newResponse.answer === 'undefined') {
        throw new Error('Missing required fields in one or more responses.');
      }

      const existingResponseIndex = responseDoc.responses.findIndex(
        (r) => r.question === newResponse.question
      );

      if (existingResponseIndex > -1) {
        // If the question already exists, update the response
        responseDoc.responses[existingResponseIndex].answer = newResponse.answer;
        responseDoc.responses[existingResponseIndex].responseDate = new Date(); // Update the response date
      } else {
        // If the question does not exist, add the new response
        responseDoc.responses.push({
          question: newResponse.question,
          answerType: newResponse.answerType,
          answer: newResponse.answer,
          responseDate: new Date(),
        });
      }
    });

    // Update the overall submission date
    responseDoc.submissionDate = new Date();

    // Save the updated document
    await responseDoc.save();

    res.status(200).json({ message: 'Responses updated successfully!' });
  } catch (error) {
    console.error('Error updating responses:', error);
    res.status(500).json({ message: 'Error updating responses', error: error.message });
  }
};





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
