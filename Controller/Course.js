const Course = require('../Model/Course'); // Correct the path to match the actual directory


// Controller to get all courses
const getCourse = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({
      success: true,
      message: 'Courses fetched successfully!',
      courses: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message,
    });
  }
};

// Export the controller functions
module.exports = {
  getCourse
};
