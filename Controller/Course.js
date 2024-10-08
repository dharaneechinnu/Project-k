const Course = require('../Model/Course'); // Correct the path to match the actual directory
const userModel = require('../Model/User');


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
  const { userId, courseId } = req.body;

  console.log(userId, courseId);  // Log to debug

  if (!userId || !courseId) {
    return res.status(400).json({ message: 'User ID and Course ID are required' });
  }

  try {
    // Find the user by studentId (since it's not _id)
    const user = await userModel.findOne({ studentId: userId });

    // Check if the user is found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure requestedCourses and approvedCourses are arrays before using includes()
    const requestedCourses = user.requestedCourses || [];
    const approvedCourses = user.approvedCourses || [];

    // Check if the course has already been requested or unlocked
    if (requestedCourses.includes(courseId) || approvedCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Course already requested or unlocked' });
    }

    // Add the courseId to the user's requestedCourses array
    user.requestedCourses.push(courseId);

    // Save the updated user document
    await user.save();

    return res.status(200).json({ message: 'Course request sent to admin', requestedCourses: user.requestedCourses });
  } catch (error) {
    console.error('Error in request-course endpoint:', error);
    return res.status(500).json({ message: 'Error requesting course', error });
  }
};

const fetchUnlockedCourses = async (req, res) => {
  const { userId } = req.params; // Assuming userId is actually studentId

  try {
    // Find the user by studentId instead of _id
    const user = await userModel.findOne({ studentId: userId }); // Updated to query by studentId
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the unlocked courses based on the user's approvedCourses
    const unlockedCourses = await Course.find({ courseId: { $in: user.approvedCourses } });

    return res.status(200).json(unlockedCourses); // Send the unlocked courses back
  } catch (error) {
    console.error('Error fetching unlocked courses:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Export the controller functions
module.exports = {
  getCourse,
  fetchUnlockedCourses,
  RequestCourse
};
