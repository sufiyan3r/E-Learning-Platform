import { useState, useEffect, useCallback, useMemo } from "react";
import openai from "openai";
import { useUser } from "@clerk/clerk-react"; // Import useUser hook
import Sidebar from "./sidebar";
import jsPDF from "jspdf"; // Import jsPDF library
import env from ".//env";
const TestPractice = () => {
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [customTopicText, setCustomTopicText] = useState("Custom...");

  const { user } = useUser(); // Extract user object from useUser hook

  // Save test results to the server
  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        if (!user) {
          console.error("User is undefined");
          return;
        }

        const response = await fetch(
          `http://localhost:3007/testResults/${user.id}`
        );
        const data = await response.json();

        if (response.ok) {
          console.log("Test results fetched successfully:", data.testResults);
          setTestResults(data.testResults);
        } else {
          console.error("Failed to fetch test results");
        }
      } catch (error) {
        console.error("Error fetching test results:", error);
      }
    };

    fetchTestResults();
  }, [user]);

  const API_KEY = env.API_KEY;

  const openaiClient = useMemo(() => {
    return new openai({
      apiKey: API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }, [API_KEY]);
  const generateQuestions = useCallback(async () => {
    setLoading(true);

    try {
      const response = await openaiClient.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [
          {
            role: "system",
            content: `Generate 5 questions with 4 options each based on the topic: ${selectedTopic}\n1.\n2.\n3.\n4.\n5. For each question Mark the correct option as (correct) like this D) PHP (correct) that is important make sure you mark the correct option for each question and make sure (correct) is in the same line as the option after the option text.`,
          },
        ],
        max_tokens: 300,
        n: 1,
      });

      console.log("OpenAI Response:", response);

      if (
        response &&
        response.choices &&
        response.choices.length > 0 &&
        response.choices[0].message &&
        response.choices[0].message.content
      ) {
        const formattedContent = response.choices[0].message.content;
        console.log("Formatted Content:", formattedContent);

        const questionBlocks = formattedContent.split("\n\n");
        console.log("Question Blocks:", questionBlocks);

        const parsedQuestions = [];

        for (const questionBlock of questionBlocks) {
          const lines = questionBlock.split("\n");
          if (lines.length < 5) {
            console.error("Invalid question format:", questionBlock);
            continue; // Skip incomplete question blocks
          }

          const question = lines[0].trim();
          console.log("Question:", question);

          const options = lines.slice(1, 5).map((optionLine) => {
            const match = optionLine.match(/^\s*([A-D])\)\s*(.+)/);
            if (!match) {
              console.error("Invalid option format:", optionLine);
              return null;
            }

            const optionText = match[2].trim();
            const isCorrect = optionText.endsWith("(correct)");

            return {
              text: isCorrect
                ? optionText.replace("(correct)", "").trim()
                : optionText,
              correct: isCorrect,
            };
          });

          // Ensure all options and a correct answer are present
          if (
            options.length === 4 &&
            options.some((option) => option.correct)
          ) {
            const correctAnswer = options.find((option) => option.correct).text;
            parsedQuestions.push({
              question,
              options: options.map((option) => option.text),
              correctAnswer,
            });
          } else {
            console.error(
              "Incomplete or invalid question block:",
              questionBlock
            );
          }
        }

        console.log("Parsed Questions:", parsedQuestions);

        if (parsedQuestions.length === 5) {
          setQuestions(parsedQuestions);
          setAnswers(new Array(5).fill(""));
          setLoading(false);
        } else {
          console.error(
            "Expected 5 valid questions but parsed:",
            parsedQuestions.length
          );
          setLoading(false);
        }
      } else {
        console.error("Empty or invalid response from the API.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      setLoading(false);
    }
  }, [selectedTopic, openaiClient]);

  const handleTopicSelect = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "Custom") {
      const customTopic = prompt("Enter your custom topic:");
      if (customTopic) {
        setSelectedTopic(customTopic);
        setCustomTopicText(customTopic); // Update custom topic text
      }
    } else {
      setSelectedTopic(selectedValue);
      setCustomTopicText("Custom..."); // Reset custom topic text
    }
  };

  const handleStartTest = () => {
    setStarted(true);
    generateQuestions();
  };

  const handleAnswerChange = (index, answer) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmitTest = async () => {
    const correctCount = questions.reduce((count, question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      return isCorrect ? count + 1 : count;
    }, 0);

    const percentage = (correctCount / questions.length) * 100;
    setScore(percentage);

    // Prepare data to be saved in the database
    const testResultData = {
      userId: user.id, // Include the user ID from your user object
      topic: selectedTopic,
      score: percentage,
      questions: questions.map((question, index) => ({
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        userAnswer: answers[index],
        isCorrect: answers[index] === question.correctAnswer,
      })),
    };

    try {
      // Send the test result data to your backend API to save in the database
      const response = await fetch("http://localhost:3007/saveTestResult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testResultData),
      });

      if (response.ok) {
        console.log("Test result saved successfully.");
      } else {
        console.error("Failed to save test result.");
      }
    } catch (error) {
      console.error("Error saving test result:", error);
    }
  };

  const generateTestReport = () => {
    const doc = new jsPDF(); // Create a new PDF document

    // Set PDF document properties
    doc.setFontSize(18);
    doc.text(`Test Report - ${selectedTopic}`, 15, 20);

    let yPos = 30; // Initial y-position for content

    // Iterate through questions and answers
    questions.forEach((question, index) => {
      // Display question
      const questionLines = doc.splitTextToSize(
        `Q${index + 1}: ${question.question}`,
        170
      ); // Split question into multiple lines if too long
      doc.setFont("helvetica", "normal"); // Set font family and style
      doc.setFontSize(12);
      doc.text(questionLines, 15, yPos);

      // Adjust yPos based on the height of the question content
      yPos += (questionLines.length + 1) * 6; // Move to the next line for options

      // Display options and user's answer
      question.options.forEach((option, optIndex) => {
        const optionXPos = 25; // X-position for options
        const formattedOption = `${String.fromCharCode(
          65 + optIndex
        )}. ${option}`;

        // Check if adding the next option exceeds the page height
        if (yPos + 10 > doc.internal.pageSize.height - 20) {
          // Add a new page if there's not enough space for the next option
          doc.addPage();
          yPos = 20; // Reset yPos for the new page

          // Re-render the question text at the top of the new page
          doc.setFont("helvetica", "normal");
          doc.setFontSize(12);
          doc.text(questionLines, 15, yPos);

          // Update yPos to continue rendering options on the new page
          yPos += (questionLines.length + 1) * 6;
        }

        // Render the option at the current yPos
        doc.setFont("helvetica", "normal"); // Reset font family and style
        doc.text(formattedOption, optionXPos, yPos);

        // Check if the option is the correct answer or user's answer
        const isCorrectAnswer = option === question.correctAnswer;
        const isUserAnswer = answers[index] === option;

        // Display appropriate symbol for correct and user's answer
        if (isCorrectAnswer) {
          // Green tick for correct answer
          doc.setDrawColor(0, 255, 0); // Set draw color to green
          doc.circle(optionXPos - 8, yPos - 3, 2, "FD"); // Draw a filled green circle
        } else if (isUserAnswer) {
          // Red cross for incorrect user's answer
          const crossSize = 2; // Size of the cross lines

          doc.setDrawColor(255, 0, 0); // Set draw color to red

          // Draw the first line of the red cross (top-left to bottom-right)
          doc.line(
            optionXPos - crossSize, // Adjusted leftward position
            yPos - crossSize,
            optionXPos + crossSize,
            yPos + crossSize
          );

          // Draw the second line of the red cross (top-right to bottom-left)
          doc.line(
            optionXPos - crossSize, // Adjusted leftward position
            yPos + crossSize,
            optionXPos + crossSize,
            yPos - crossSize
          );
        }

        // Move to the next line for the next option
        yPos += 10;
      });

      // Add space between questions
      yPos += 10;

      // Check if the current question will fit on the page
      if (yPos > doc.internal.pageSize.height - 20) {
        // Add a new page if there's not enough space for the next question
        doc.addPage();
        yPos = 20; // Reset yPos for the new page
      }
    });

    // Display overall score
    doc.setFont("helvetica", "normal"); // Reset font family and style
    doc.setFontSize(16);
    doc.setTextColor("black"); // Reset text color
    // displlay score and result score sould be percentage and out of 5
    doc.text(
      `Overall Score: ${score.toFixed(2)}% (${
        score >= 60 ? "Passed" : "Failed"
      })`,
      15,
      yPos + 10
    );

    // Save the PDF
    doc.save(`TestReport_${selectedTopic}.pdf`);
  };

  // Handler to generate and download test report
  const handleDownloadReport = () => {
    if (questions.length > 0 && answers.length > 0 && score !== null) {
      generateTestReport();
    } else {
      console.error("Cannot generate test report. Test data is incomplete.");
    }
  };

  const handleDownloadPDF = (result) => {
    const doc = new jsPDF();

    let yPos = 10;

    // Add test result details
    doc.text(`Score: ${result.score.toFixed(2)}%`, 10, yPos);
    yPos += 10;
    doc.text(
      `Date: ${new Date(result.date).toLocaleDateString("en-GB")}`,
      10,
      yPos
    );
    yPos += 10;
    doc.text(`Topic: ${result.topic}`, 10, yPos);
    yPos += 10;
    doc.text(`Result: ${result.score >= 60 ? "Passed" : "Failed"}`, 10, yPos);
    yPos += 20;

    // Add detailed question data
    result.questionData.questions.forEach((question, index) => {
      // Calculate height needed for current question content
      const questionTextHeight = doc.getTextDimensions(question.question, {
        maxWidth: 180,
      }).h;
      const optionsTextHeight = doc.getTextDimensions(
        `Options: ${question.options.join(", ")}`,
        { maxWidth: 180 }
      ).h;

      // Check if adding this question will exceed the remaining space
      if (yPos + questionTextHeight + optionsTextHeight + 80 > 280) {
        // Add new page if there's not enough space
        doc.addPage();
        yPos = 10; // Reset yPos for new page
      }

      // Add question number and text
      doc.text(`Question ${index + 1}:`, 10, yPos);
      yPos += 10; // Move down a bit for question text

      // Wrap question text
      doc.text(question.question, 15, yPos, { maxWidth: 180 });
      yPos += questionTextHeight + 5; // Increase yPos based on question text height

      // Wrap options text
      doc.text(`Options: ${question.options.join(", ")}`, 15, yPos, {
        maxWidth: 180,
      });
      yPos += optionsTextHeight + 15; // Increase yPos based on options text height

      // Render Correct Answer
      doc.text(`Correct Answer: ${question.correctAnswer}`, 15, yPos);
      yPos += 10;

      // Render User Answer
      doc.text(`User Answer: ${question.userAnswer}`, 15, yPos);
      yPos += 10;

      // Render Result
      doc.text(
        `Result: ${question.isCorrect ? "Correct" : "Incorrect"}`,
        15,
        yPos
      );
      yPos += 20; // Increase yPos after rendering Result
    });

    // Save the PDF with a unique filename based on the test result
    doc.save(`TestResult_${result._id}.pdf`);
  };

  useEffect(() => {
    // Fetch test results for the current user
    const fetchTestResults = async () => {
      try {
        const response = await fetch(
          `http://localhost:3007/testResults/${user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setTestResults(data.testResults);
          console.log("Test results:", data.testResults);
        } else {
          console.error("Failed to fetch test results");
        }
      } catch (error) {
        console.error("Error fetching test results:", error);
      }
    };

    if (user) {
      fetchTestResults();
    }
  }, [user]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-grow p-6 overflow-auto">
        <h1 className="text-3xl mb-4 text-center"> Test Practice</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl mb-4">Select a Topic and get started</h2>
          <div className="mb-4">
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-700"
            >
              Select Topic:
            </label>
            <select
              id="topic"
              name="topic"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={handleTopicSelect}
            >
              <option value="All Topics">All Topics</option>
              <option value="Programming Languages">
                Programming Languages
              </option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile App Development">
                Mobile App Development
              </option>
              {/* Add more topic options here */}
              <option value="Custom">{customTopicText}</option>{" "}
              {/* Custom topic option */}
            </select>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-2"
              onClick={handleStartTest}
            >
              Start Test
            </button>
          </div>
          {loading && <p>Loading...</p>}
          {started && questions.length > 0 && (
            <div>
              {questions.map((question, index) => (
                <div key={index} className="mb-4">
                  <p className="font-semibold">{question.question}</p>
                  {question.options.map((option, optIndex) => (
                    <label key={optIndex} className="block mt-2">
                      <input
                        type="radio"
                        value={option}
                        checked={answers[index] === option}
                        onChange={(e) =>
                          handleAnswerChange(index, e.target.value)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              ))}
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-2"
                onClick={handleSubmitTest}
              >
                Submit Test
              </button>
              {score !== null && (
                <p className="mt-4">
                  Your score: {score.toFixed(2)}% (
                  {score >= 60 ? "Passed" : "Failed"})
                </p>
              )}
              {score !== null && (
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-2"
                  onClick={handleDownloadReport}
                >
                  Download Test Report
                </button>
              )}
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
          <h2 className="text-xl mb-4 text-center">
            Your Previous Test Results
          </h2>
          {testResults.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Score</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Topic</th>
                  <th className="border px-4 py-2">Result</th>
                  <th className="border px-4 py-2">Download Report</th>
                </tr>
              </thead>

              <tbody>
                {testResults.map((result, index) => (
                  <tr key={index}>
                    {/* Existing columns */}
                    <td className="border px-4 py-2">
                      {result.score.toFixed(2)}%
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(result.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="border px-4 py-2">{result.topic}</td>
                    <td
                      className="border px-4 py-2"
                      style={{ color: result.score >= 60 ? "green" : "red" }}
                    >
                      {result.score >= 60 ? "Passed" : "Failed"}
                    </td>
                    <td className="border px-4 py-2 flex justify-center items-center">
                      <button
                        className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600"
                        onClick={() => handleDownloadPDF(result)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No test results available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPractice;
