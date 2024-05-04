const express = require("express");
const router = express.Router();
const EnrolledCourse = require("../models/enrolledCourseSchema");

// Route to enroll a user in a course
router.post("/enroll", async (req, res) => {
  console.log("enroll route hit");
  try {
    const { userId, courseId, courseName } = req.body;

    // Create a new enrolled course document
    const enrolledCourse = new EnrolledCourse({
      userId,
      courseId,
      courseName,
    });
    console.log("Enrolled Course Document:", enrolledCourse);
    // Save the enrolled course to the database
    await enrolledCourse.save();

    // Respond with a success message
    res.status(201).json({ message: "Enrolled successfully" });
  } catch (error) {
    // If there's an error, respond with an error message
    console.error("Error enrolling user in course:", error);
    res.status(500).json({ error: "Failed to enroll user in course" });
  }
});

// Route to get all enrolled courses of a user
router.get("/enrolledCourses/:userId", async (req, res) => {
  try {
    // Get the user ID from the request parameters
    const { userId } = req.params;
    console.log("User ID:", userId);

    // Find all enrolled courses with the specified user ID
    const enrolledCourses = await EnrolledCourse.find({ userId });
    console.log("Enrolled Courses:", enrolledCourses);

    // Respond with the enrolled courses
    res.status(200).json({ enrolledCourses });
  } catch (error) {
    // If there's an error, respond with an error message
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ error: "Failed to fetch enrolled courses" });
  }
});

module.exports = router;
