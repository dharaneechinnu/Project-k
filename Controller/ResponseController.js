const Response = require('../Model/responseSchema '); // Assuming your schema is named 'Response'

const analytics = async (req, res) => {
  const { courseId, studentId } = req.params;

  try {
    // Create the aggregation pipeline
    const aggregatePipeline = [
      {
        $match: {
          courseId: parseInt(courseId), // Match documents by courseId
          studentId: parseInt(studentId), // Match documents by studentId
        },
      },
      { $unwind: "$responses" }, // Unwind the responses array to process each response individually
      {
        $group: {
          _id: "$responses.questionText", // Group by questionText
          questionText: { $first: "$responses.questionText" },
          answerType: { $first: "$responses.answerType" },
          yesCount: {
            $sum: {
              $cond: [{ $eq: ["$responses.answer", "Yes"] }, 1, 0], // Count 'Yes' answers for yes-no questions
            },
          },
          noCount: {
            $sum: {
              $cond: [{ $eq: ["$responses.answer", "No"] }, 1, 0], // Count 'No' answers for yes-no questions
            },
          },
          multipleChoiceCounts: {
            $push: {
              $cond: [
                { $eq: ["$responses.answerType", "multiple-choice"] },
                "$responses.answer",
                null,
              ],
            },
          },
          shortTextResponses: {
            $push: {
              $cond: [
                { $eq: ["$responses.answerType", "short-text"] },
                "$responses.answer",
                null,
              ],
            },
          },
          allAnswers: { $push: "$responses.answer" }, // Collect all answers
          responseDates: { $push: "$responses.responseDate" }, // Collect response dates
        },
      },
      {
        $project: {
          _id: 0, // Do not return _id field
          questionText: 1,
          answerType: 1,
          yesCount: 1,
          noCount: 1,
          allAnswers: 1, // Include all answers
          responseDates: 1, // Include response dates
          multipleChoiceCounts: {
            $filter: {
              input: "$multipleChoiceCounts",
              as: "answer",
              cond: { $ne: ["$$answer", null] },
            },
          },
          shortTextResponses: {
            $filter: {
              input: "$shortTextResponses",
              as: "response",
              cond: { $ne: ["$$response", null] },
            },
          },
        },
      },
    ];

    // Execute the aggregation
    const analyticsResults = await Response.aggregate(aggregatePipeline).exec();

    // Prepare additional metadata or statistics if needed
    const responseMetadata = {
      totalQuestions: analyticsResults.length,
      totalYesResponses: analyticsResults.reduce((sum, question) => sum + question.yesCount, 0),
      totalNoResponses: analyticsResults.reduce((sum, question) => sum + question.noCount, 0),
      totalMultipleChoiceResponses: analyticsResults.reduce((sum, question) => sum + question.multipleChoiceCounts.length, 0),
      totalShortTextResponses: analyticsResults.reduce((sum, question) => sum + question.shortTextResponses.length, 0),
    };

    // Send the processed data and metadata to the frontend
    res.json({ analytics: analyticsResults, metadata: responseMetadata });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};

module.exports = {
  analytics,
};
