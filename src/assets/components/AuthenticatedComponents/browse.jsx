import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-react"; // Import useUser hook
import Sidebar from "./sidebar";
import env from './env';


const Browse = () => {
  const categories = [
    "Programming Languages",
    "Web Development",
    "Mobile App Development",
    "Database Management",
    "DevOps",
    "Software Engineering Principles",
    "Cloud Computing",
    "Machine Learning and Data Science",
    "Cybersecurity",
    "Game Development"
  ];

  const YT_KEY = env.YT_KEY;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const { user } = useUser(); // Extract user object from useUser hook

  const fetchCourses = useCallback(async (category) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${category}&maxResults=5&type=video&key=${YT_KEY}`
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Fetched data:", data); // Add this console log
      const extractedCourses = data.items.map(item => ({
        name: item.snippet.title,
        instructor: item.snippet.channelTitle,
        rating: Math.floor(Math.random() * 5) + 1,
        videoId: item.id.videoId,
        thumbnail: item.snippet.thumbnails.medium.url,
        locked: true,
        price: "Free"
      }));
  
      console.log("Extracted courses:", extractedCourses); // Add this console log
      setCourses(extractedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, [YT_KEY]);
  

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    await fetchCourses(category);
  };

  const enrollCourse = async (index) => {
    try {
      const courseToEnroll = courses[index];
      // First, update the course's locked status in the state
      const updatedCourses = [...courses];
      updatedCourses[index].locked = false;
      setCourses(updatedCourses);
  
      // Then, send the fetch request to enroll in the course
      const response = await fetch("http://localhost:3007/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id,
          courseId: courseToEnroll.videoId,
          courseName: courseToEnroll.name
        })
      });
      console.log(courseToEnroll.name)
      if (!response.ok) {
        console.error("Failed to enroll in course:", response.statusText);
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };
  

  useEffect(() => {
    if (selectedCategory) {
      fetchCourses(selectedCategory);
    }
  }, [selectedCategory, fetchCourses]); // Include fetchCourses in the dependency array

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-grow p-6">
        <h1 className="text-3xl font-semibold mb-6">Browse</h1>

        <div className="mb-6">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`mr-4 mb-4 px-4 py-2 rounded-md border ${
                selectedCategory === category ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {courses.map((course, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md mb-4">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
                <p className="text-gray-600 mb-2">Instructor: {course.instructor}</p>
                <p className="text-gray-600 mb-2">Rating: {course.rating}</p>
                <p className="text-gray-600 mb-2">Price: {course.price}</p>
                <div className="videoWrapper">
                  {course.locked ? (
                    <img src={course.thumbnail} alt={course.name} className="w-full h-auto mb-2" />
                  ) : (
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${course.videoId}`}
                      title={course.name}
                      frameBorder="0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                  {course.locked && (
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2" onClick={() => enrollCourse(index)}>Enroll</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Browse;