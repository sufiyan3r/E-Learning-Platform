const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_CONNECTION_STRING =
  process.env.DB_CONNECTION_STRING || "mongodb://localhost:27017/myapp";

// Routes
const testRoutes = require("./routes/testRoutes");
const enrolledCourseRoutes = require("./routes/enrolledCourseRoutes");
// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(DB_CONNECTION_STRING)
  .then(() => {
    console.log("Connected to MongoDB");
    // Use routes
    app.use("/", testRoutes);
    app.use("/", enrolledCourseRoutes);
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
