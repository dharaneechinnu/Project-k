const Admin = require('../Model/Admin');
const User = require('../Model/User'); 
const Course = require('../Model/Course');
const Transaction = require('../Model/RequestandApprove');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PASS = process.env.PASS;
const nodemailer = require('nodemailer');
const Question = require('../Model/Question')
const RequestandApprove = require('../Model/RequestandApprove')
const Response = require('../Model/responseSchema ')
// Admin Login Controller
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Not an admin.' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const adminToken = jwt.sign(
      { role: admin.role },
      process.env.ADMIN_TOKEN,
      { expiresIn: '1h' }
    );

    // Convert admin to plain object and remove sensitive fields
    const adminData = admin.toObject();
    delete adminData.password;
    delete adminData._id;  // Remove the MongoDB ID

    res.status(200).json({
      message: 'Login successful',
      adminToken,
      admin: adminData
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ message: 'Internal server error', status: error });
  }
};



// Admin Register Controller
const registerAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error during admin registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get Admin Stats
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const enrolledCourse = await Transaction.countDocuments();

    res.status(200).json({
      totalUsers,
      totalCourses,
      enrolledCourse,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Error fetching admin stats' });
  }
};

// Get All Courses
const GetAllcourse = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// Add a Course
const addCourse = async (req, res) => {
  const { courseId, courseName, courseDescription, subjectId, amount } = req.body;

  try {
    const newCourse = new Course({
      courseId,
      courseName,
      courseDescription,
      subjectId,
      amount,
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course added successfully!' });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Error adding course' });
  }
};

// Edit a Course
const editCourse = async (req, res) => {
  const { courseId } = req.params;
  const { courseName, courseDescription, subjectId, amount } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.courseName = courseName || course.courseName;
    course.courseDescription = courseDescription || course.courseDescription;
    course.subjectId = subjectId || course.subjectId;
    course.amount = amount || course.amount;

    await course.save();
    res.status(200).json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error('Error editing course:', error);
    res.status(500).json({ message: 'Error editing course' });
  }
};

// Delete a Course
const deleteCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error deleting course' });
  }
};


const registerUserByAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      pincode,
      whatsappno, // Corrected the field name
      mobileno,
      batchno,
    } = req.body;

    // Check if email, WhatsApp number, or mobile number already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { whatsappno }, { mobileno }], // Corrected the field name
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate a studentId based on pincode
    const studentIdBase = pincode.toString();
    let uniqueCounter = 1;
    let studentId = `${studentIdBase}${uniqueCounter}`;

    // Ensure studentId is unique in the database
    while (await User.findOne({ studentId })) {
      uniqueCounter++;
      studentId = `${studentIdBase}${uniqueCounter}`;
    }

    // Hash the password
    const hashpwd = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      studentId,
      name,
      password: hashpwd,
      email,
      age,
      pincode,
      gender,
      mobileno,
      whatsappno, // Corrected the field name
      batchno,
    });

    // Setup nodemailer to send email to the user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dharaneedharanchinnusamy@gmail.com', // Your Gmail address
        pass: process.env.PASS, // Use environment variable for password
      },
    });

    const mailOptions = {
      from: 'dharaneedharanchinnusamy@gmail.com',
      to: newUser.email,
      subject: 'Welcome to Our Service!',
      text: `Hello ${newUser.name},\n\nThank you for registering. Here are your credentials:\n\nEmail: ${newUser.email}\nPassword: ${password}\n\nYou have been allocated to this batch No: ${batchno}. We recommend that you change your password after logging in for the first time.\n\nBest regards,\nYour App Team`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending registration email:', error);
        return res.status(500).json({
          message: 'User registered but failed to send email',
        });
      }

      console.log('Registration email sent:', info.response);
      res
        .status(200)
        .json({ message: 'User registered successfully and email sent' });
    });
  } catch (error) {
    console.error('Error registering user by admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



  // Edit a question
const editQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error editing question:', error);
    res.status(500).json({ message: 'Failed to edit question' });
  }
};

// Delete a question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Failed to delete question' });
  }
};


const addQuestion = async (req, res) => {
  try {
    const { courseId, questions } = req.body;

    const savedQuestions = await Promise.all(questions.map(async (question) => {
      const newQuestion = new Question({
        courseId,
        questionText: question.questionText,
        answerType: question.answerType,
        options: question.options.map(option => ({ optionText: option.optionText }))
      });

      return await newQuestion.save();
    }));

    res.status(201).json({ message: 'Questions added successfully!', savedQuestions });
  } catch (error) {
    console.error('Error adding questions:', error);
    res.status(500).json({ message: 'Failed to add questions', error: error.message });
  }
};

//unlock the course 
const unlockCourse = async (req, res) => {
  const { studentId, courseId } = req.body;

  if (!studentId || !courseId) {
    return res.status(400).json({ message: 'Student ID and Course ID are required.' });
  }

  try {
    // Find the user by studentId
    const user = await User.findOne({ studentId: studentId });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the course is already unlocked
    if (user.approvedCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Course is already unlocked for this user.' });
    }

    // Add the courseId to the user's approvedCourses array
    user.approvedCourses.push(courseId);

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      message: 'Course successfully unlocked for the user.',
      approvedCourses: user.approvedCourses,
    });
  } catch (error) {
    console.error('Error unlocking course:', error);
    return res.status(500).json({ message: 'An error occurred while unlocking the course.', error });
  }
};


const getAllCourseRequests = async (req, res) => {
  try {
    // Fetch all course requests from the RequestandApprove schema
    const courseRequests = await RequestandApprove.find({ approve: false }) // Only fetching requests that are not yet approved
      .populate('studentId', 'name email studentId') // Populate user details from User schema
      .populate('courseId', 'courseName') // Populate course details from Course schema
      .lean(); // Using .lean() for better performance since we're not modifying the results

    // Prepare response structure
    const formattedRequests = courseRequests.map(request => ({
      _id: request._id,
      userId: request.studentId,
      userName: request.name,
      userEmail: request.email,
      studentId: request.studentId.studentId,
      courseId: request.courseId,
      courseName: request.courseName,
      batchNumber: request.Bacthno || 'N/A', // Add batch number if available
      transactionDate: request.transactionDate,
    }));

    // Send the response with all course requests
    res.status(200).json(formattedRequests);
  } catch (error) {
    console.error('Error fetching all course requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const approveCourseRequest = async (req, res) => {
  const { userId, courseId } = req.body; // Expect the userId and courseId to be passed in the request body

  if (!userId || !courseId) {
    return res.status(400).json({ message: 'User ID and Course ID are required' });
  }

  try {
    // Find the course request in the RequestandApprove collection
    const request = await RequestandApprove.findOne({ studentId: userId, courseId });

    if (!request) {
      return res.status(404).json({ message: 'Course request not found' });
    }

    // Check if the course has already been approved
    if (request.approve) {
      return res.status(400).json({ message: 'Course already approved' });
    }

    // Only approve after all checks and operations are successful
    request.approve = true;
    request.approvedAt = Date.now(); // Store the current time as the approvedAt timestamp

    // Save the updated request
    await request.save();

    return res.status(200).json({ message: 'Course approved successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      // Handle the case where an invalid ObjectId is provided
      return res.status(400).json({ message: 'Invalid User ID or Course ID format' });
    }
    console.error('Error approving course request:', error);
    return res.status(500).json({ message: 'Error approving course request', error });
  }
};

// Controller to get responses for a specific studentId
const getUserResponses = async (req, res) => {
  const { studentId } = req.params;
  try {
    const responses = await Response.findOne({ studentId: parseInt(studentId) });
    
    if (!responses) {
      return res.status(404).json({ message: 'No responses found for this student' });
    }

    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ message: 'Error fetching responses' });
  }
};

module.exports = {
  loginAdmin,
  registerAdmin,
  getAllUsers,
  getAdminStats,
  GetAllcourse,
  addCourse,
  editCourse,
  deleteCourse,
  registerUserByAdmin,
  deleteQuestion,
  editQuestion,
  addQuestion,
  unlockCourse,
  getAllCourseRequests,
  approveCourseRequest,
  getUserResponses
};
