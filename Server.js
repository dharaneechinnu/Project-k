require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Course = require('./Model/Course');
const PORT = process.env.PORT || 3500;
const MONGODB_URL = process.env.MONGO_URL;
const Response = require('./Model/responseSchema ');
// Import routes
const paymentRoutes = require('./Router/Payment');
const authRoutes = require('./Router/Router');
const QuestionRoute = require('./Router/Question')
// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect(MONGODB_URL)
  .then(() => console.log('Database is connected'))
  .catch(err => console.error('Error connecting to the database:', err.message));

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/Auth', authRoutes);
app.use('/payment', paymentRoutes);
app.use('/api', QuestionRoute);

app.post('/upload-course', async (req, res) => {
  const { courseId, courseName, courseDescription, subjectId, amount, imageUrl } = req.body;

  try {
    const newCourse = new Course({
      courseId,
      courseName,
      courseDescription,
      subjectId,
      amount,
      imageUrl
    });
    await newCourse.save();
    res.status(201).json({ message: 'Course uploaded successfully!', course: newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading course', error: error.message });
  }
});

// Get All Courses
app.get('/get-courses', async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

app.post('/submit-responses/:courseId/:studentId', async (req, res) => {
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
});


app.get('/responses/analytics/:courseId', async (req, res) => {
  const { courseId } = req.params;

  try {
    // Fetch all responses for the course
    const responses = await Response.find({ courseId }).populate('responses.questionId');

    const analytics = {
      questions: [], // Store question-level analysis
    };

    // Analyze the responses
    responses.forEach((response) => {
      response.responses.forEach((item) => {
        let questionIndex = analytics.questions.findIndex(
          (q) => q.questionId.toString() === item.questionId._id.toString()
        );

        // If question already exists in analytics, update counts
        if (questionIndex > -1) {
          const questionData = analytics.questions[questionIndex];
          if (item.answerType === 'yes-no') {
            if (item.answer === 'Yes') {
              questionData.yesCount++;
            } else if (item.answer === 'No') {
              questionData.noCount++;
            }
          } else if (item.answerType === 'multiple-choice') {
            item.answer.forEach((option) => {
              if (!questionData.options[option]) {
                questionData.options[option] = 1;
              } else {
                questionData.options[option]++;
              }
            });
          } else if (item.answerType === 'short-text') {
            questionData.responses.push(item.answer);
          }
        } else {
          // If it's a new question, create an entry
          let newQuestion = {
            questionId: item.questionId._id,
            questionText: item.questionId.questionText,
            answerType: item.answerType,
            yesCount: 0,
            noCount: 0,
            options: {},
            responses: [], // For storing short-text responses
          };

          if (item.answerType === 'yes-no') {
            if (item.answer === 'Yes') {
              newQuestion.yesCount = 1;
            } else if (item.answer === 'No') {
              newQuestion.noCount = 1;
            }
          } else if (item.answerType === 'multiple-choice') {
            item.answer.forEach((option) => {
              newQuestion.options[option] = 1;
            });
          } else if (item.answerType === 'short-text') {
            newQuestion.responses.push(item.answer);
          }

          analytics.questions.push(newQuestion);
        }
      });
    });

    // Send the processed data to the frontend
    res.json({ questions: analytics.questions });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
