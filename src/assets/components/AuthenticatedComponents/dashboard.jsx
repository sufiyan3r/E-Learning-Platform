import { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/clerk-react"; // Import useUser hook
import Sidebar from "./sidebar";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import Chart.js DataLabels plugin

const Dashboard = () => {
  const { user } = useUser();
  const userName = user ? `${user.firstName} ${user.lastName}` : "";
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        if (!user) return; // Ensure user object exists before making the request
        const response = await fetch(
          `http://localhost:3007/testResults/${user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setTestResults(data.testResults);
          console.log("Test Results Fetched Successfully:", data.testResults);
        } else {
          console.error("Failed to Fetch Test Results");
        }
      } catch (error) {
        console.error("Error Fetching Test Results:", error);
      }
    };

    fetchTestResults();
  }, [user]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        if (!user) return; // Ensure user object exists before making the request
        const response = await fetch(
          `http://localhost:3007/enrolledCourses/${user.id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEnrolledCourses(data.enrolledCourses);
      } catch (error) {
        console.error("Error Fetching Enrolled Courses:", error);
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  useEffect(() => {
    if (testResults.length > 0) {
      const ctxBar = document.getElementById("testResultsChart");

      // Register the ChartDataLabels plugin
      Chart.register(ChartDataLabels);

      // Destroy existing chart if it exists
      const existingChartBar = Chart.getChart(ctxBar);
      if (existingChartBar) {
        existingChartBar.destroy();
      }

      // Create a new bar chart
      const myChartBar = new Chart(ctxBar, {
        type: "bar",
        data: {
          labels: testResults.map((result) => result.topic), // Only display the topic
          datasets: [
            {
              label: "Score",
              data: testResults.map((result) => result.score),
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Score %",
                font: {
                  size: 16,
                  weight: "bold",
                },
              },
              ticks: {
                padding: 10, // Adjust the spacing at the bottom
              },
            },
            x: {
              title: {
                display: true,
                text: "Topic",
                font: {
                  size: 16,
                  weight: "bold",
                },
              },
            },
          },
          plugins: {
            datalabels: {
              anchor: "end",
              align: "top",
              offset: -6,
              formatter: (value) => {
                return `${value}%`;
              },
            },
          },
        },
      });

      // Cleanup function to destroy the chart on unmount
      return () => {
        myChartBar.destroy();
      };
    }
  }, [testResults]);
      
  
    
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-grow p-6 overflow-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold mb-4">
            Welcome {userName}!
          </h1>
          <div className="flex items-center space-x-4">
            {user && (
              <UserButton
                userProfileMode="popup"
                showName={true}
                afterSignOutUrl="/"
              />
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 flex">
          <div className="max-w-xl mr-4">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <canvas id="testResultsChart" width={600} height={400}></canvas>
          </div>
          <div className="max-w-xl">
            <h2 className="text-xl font-semibold mb-4">Status</h2>
            <div>
              {testResults.map((result) => (
                <div key={result.topic} className="mb-2">
                  <p className="text-lg">
                    <strong>{result.topic}:</strong>{" "}
                    <span className="text-gray-600">
                      {new Date(result.date).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>{" "}
                    -{" "}
                    <span
                      className={
                        result.score >= 60 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {result.score >= 60 ? "Passed" : "Failed"}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Courses</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Enrolled Courses</h3>
              <p className="mb-2">{enrolledCourses.length} Enrolled Courses</p>
              <ul>
                {enrolledCourses.map((course) => (
                  <li
                    key={`${course.courseName}-${course._id}`}
                    className="mb-2"
                  >
                    <span className="bg-blue-200 px-2 py-1 rounded-md mr-2">
                      {course.courseName}
                    </span>
                    {/* get course.date */}
                    <span className="text-gray-600 text-sm">
                      {new Date(course.date).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
