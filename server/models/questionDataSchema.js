const mongoose = require("mongoose");

const questionDataSchema = new mongoose.Schema({
  userId: String,
  topic: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: [String],
      correctAnswer: {
        type: String,
        required: true,
      },
      userAnswer: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

const QuestionData = mongoose.model("QuestionData", questionDataSchema);

module.exports = QuestionData;
