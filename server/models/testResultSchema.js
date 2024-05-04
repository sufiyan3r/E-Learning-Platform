// testResultSchema.js

const mongoose = require("mongoose");

//schema for test results
const testResultSchema = new mongoose.Schema({
  userId: String,
  score: Number,
  topic: String,
  date: { type: Date, default: Date.now },
  questionData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuestionData",
  },
});

// Create a model using the schema
const TestResult = mongoose.model("TestResult", testResultSchema);

module.exports = TestResult;
