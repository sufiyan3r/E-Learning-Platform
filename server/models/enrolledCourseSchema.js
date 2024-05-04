// enrolledCourseSchema model is used to store the enrolled courses of the user

const mongoose = require("mongoose");

// schema for enrolled courses
const enrolledCourseSchema = new mongoose.Schema({
  userId: String,
  courseId: String,
  courseName: String,
  date: { type: Date, default: Date.now },
});

// Create a model using the schema
const EnrolledCourse = mongoose.model("EnrolledCourse", enrolledCourseSchema);

module.exports = EnrolledCourse;
