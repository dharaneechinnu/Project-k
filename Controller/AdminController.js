const Admin = require('../Model/Admin');
const User = require('../Model/User'); 
const Course = require('../Model/Course');
const Transaction = require('../Model/Transaction');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PASS = process.env.PASS;
const nodemailer = require('nodemailer');

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
      { id: admin._id, role: admin.role },
      process.env.ADMIN_TOKEN,
      { expiresIn: '1h' }
    );

    const adminData = admin.toObject();
    delete adminData.password;

    res.status(200).json({ message: 'Login successful', adminToken, admin: adminData });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ message: 'Internal server error' });
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


// Admin register user
const registerUserByAdmin = async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        age,
        gender,
        pincode,
        whatappno,
        mobileno,
      } = req.body;
  
      // Check if email, WhatsApp number, or mobile number already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { whatappno }, { mobileno }],
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
        whatappno,
      });
  
      // Setup nodemailer to send email to the user
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "dharaneedharanchinnusamy@gmail.com", // Your Gmail address
          pass: PASS // Password/App password from environment variable
        }
      });
  
      const mailOptions = {
        from: "dharaneedharanchinnusamy@gmail.com",
        to: newUser.email,
        subject: "Welcome to Our Service!",
        text: `Hello ${newUser.name},\n\nThank you for registering. Here are your credentials:\n\nEmail: ${newUser.email}\nPassword: ${password}\n\nWe recommend that you change your password after logging in for the first time.\n\nBest regards,\nYour App Team`
      };
  
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending registration email:", error);
          return res.status(500).json({ message: "User registered but failed to send email" });
        }
  
        console.log("Registration email sent:", info.response);
        res.status(200).json({ message: 'User registered successfully and email sent' });
      });
      
    } catch (error) {
      console.error('Error registering user by admin:', error);
      res.status(500).json({ message: 'Internal server error' });
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
  registerUserByAdmin
};
