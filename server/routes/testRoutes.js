const express = require("express");
const router = express.Router();
const TestResult = require("../models/testResultSchema");
const QuestionData = require("../models/questionDataSchema");
// Route to insert test results into the database
router.post("/testResults", async (req, res) => {
  console.log("test route hit");
  try {
    // Log the request body to check the received data
    console.log("Request Body:", req.body);

    // Extract the user ID and score from the request body
    const { userId, score, topic } = req.body;
    console.log("User ID:", userId);
    console.log("Score:", score);

    // Create a new test result document
    const testResult = new TestResult({
      userId,
      score,
      topic,
    });
    console.log("Test Result Document:", testResult);

    // Save the test result to the database
    await testResult.save();

    // Respond with a success message
    res.status(201).json({ message: "Test result saved successfully" });
  } catch (error) {
    // If there's an error, respond with an error message
    console.error("Error saving test result:", error);
    res.status(500).json({ error: "Failed to save test result" });
  }
});
// This is the saveTestResult route -> server/routes/testRoutes.js 
router.post("/saveTestResult", async (req, res) => {
  console.log("saveTestResult route hit");
  try {
    const { userId, topic, score, questions } = req.body;

    // Validate user ID
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Create an array to store detailed question data
    const questionDataArray = [];

    // Iterate over each question in the request
    for (const q of questions) {
      const { question, options, correctAnswer, userAnswer, isCorrect } = q;

      // Collect each question's data
      questionDataArray.push({
        question,
        options,
        correctAnswer,
        userAnswer,
        isCorrect,
      });
    }

    // Create a new question data document
    const questionData = new QuestionData({
      userId,
      topic,
      score,
      questions: questionDataArray, // Store all questions in one array within the document
    });

    // Save the question data to the database
    await questionData.save();

    // Create a new test result document with a reference to the question data
    const testResult = new TestResult({
      userId,
      topic,
      score,
      questionData: questionData._id, // Reference to the saved QuestionData document
    });

    // Save the test result to the database
    await testResult.save();

    // Respond with a success message and the detailed question data
    res.status(201).json({ message: "Test result saved successfully", testResult });
  } catch (error) {
    console.error("Error saving test result:", error);
    res.status(500).json({ error: "Failed to save test result" });
  }
});

// Route to get all test results from the database based on the user ID
router.get("/testResults/:userId", async (req, res) => {
  try {
    // Get the user ID from the request parameters
    const { userId } = req.params;
    console.log("User ID:", userId);

    // Find all test results with the specified user ID and populate the questionData field
    const testResults = await TestResult.find({ userId }).populate("questionData");
    console.log("Test Results:", testResults);

    // Respond with the test results
    res.status(200).json({ testResults });
  } catch (error) {
    // If there's an error, respond with an error message
    console.error("Error fetching test results:", error);
    res.status(500).json({ error: "Failed to fetch test results" });
  }
});


module.exports = router;
