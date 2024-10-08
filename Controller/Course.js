const Course = require('../Model/Course'); // Correct the path to match the actual directory
const userModel = require('../Model/User');
const RequestandApprove = require('../Model/RequestandApprove'); // Import the RequestandApprove schema

// Controller to get all courses
const getCourse = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({
      success: true,
      message: 'Courses fetched successfully!',
      courses: courses,
    });
    console.log("data send");
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message,
    });
  }
};

const RequestCourse = async (req, res) => {
  const { userId, courseId, Bacthno } = req.body; // Assume Bacthno is passed from frontend

  console.log(userId, courseId, Bacthno);  // Log for debugging

  if (!userId || !courseId || !Bacthno) {
    return res.status(400).json({ message: 'User ID, Course ID, and Batch number are required' });
  }

  try {
    // Find the user by studentId (not _id)
    const user = await userModel.findOne({ studentId: userId });

    // Check if the user is found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the same course has already been requested by this user
    const existingRequest = await RequestandApprove.findOne({ studentId: userId, courseId });

    if (existingRequest) {
      return res.status(400).json({ message: 'You have already requested this course.' });
    }

    // Store the course request in the RequestandApprove schema
    const newRequest = new RequestandApprove({
      studentId: userId,
      courseId,
      batchno: Bacthno,
      approve: false, // Course is not approved initially
      transactionDate: Date.now() // Current date/time for the request
    });

    // Save the new request to the database
    await newRequest.save();

    return res.status(200).json({ message: 'Course request sent to admin' });
  } catch (error) {
    console.error('Error in request-course endpoint:', error);
    return res.status(500).json({ message: 'Error requesting course', error });
  }
};


// Assuming you are using Express.js for the API
const getUnlockedCourses = async (req, res) => {
  const { userId } = req.params; // userId passed in the request params

  try {
    // Find all approved requests for this user
    const approvedCourses = await RequestandApprove.find({ studentId: userId, approve: true });

    // Extract the approved course IDs
    const unlockedCourseIds = approvedCourses.map(request => request.courseId);

    res.status(200).json(unlockedCourseIds); // Return an array of unlocked course IDs
  } catch (error) {
    console.error('Error fetching unlocked courses', error);
    res.status(500).json({ message: 'Error fetching unlocked courses' });
  }
};


// Export the controller functions
module.exports = {
  getCourse,
  getUnlockedCourses,
  RequestCourse
};
