import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Element } from 'react-scroll';

const Homepage = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      const height = navbar.offsetHeight + 20;
      setNavbarHeight(height);
    }
  }, []);

  const scrollToRef = (ref) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="dark:bg-gray-900">
      <Navbar scrollToRef={scrollToRef} />
      <div
        className="container mx-auto px-4 w-full"
        style={{ paddingTop: navbarHeight, paddingBottom: "40px" }}
      >
        {/* Hero Section */}
        <section className="py-16 bg-white dark:bg-gray-800 ">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
              Welcome to E-Learning Platform
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Explore. Learn. Achieve.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition duration-300 ease-in-out">
              Get Started
            </button>
            <img src="src/assets/components/publicComponents/hero.png" alt="Hero Picture" className="mx-auto mt-12 max-w-full h-auto" />
          </div>
        </section>
        {/* Features Section */}
        <section className="py-16 bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Why Choose Us?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Our platform offers the best learning experience with amazing
                features.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Interactive Learning
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Engaging and interactive learning materials to keep you
                  motivated.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Amazing Analytics & User Interface
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Learn from industry experts with real-world experience.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Flexible Learning
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Study at your own pace with our flexible course schedules.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                What Our Students Say
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Read testimonials from our satisfied students.
              </p>
            </div>
            {/* Testimonial cards go here */}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 bg-blue-600 dark:bg-blue-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Start Your Learning Journey Today
            </h2>
            <p className="text-lg mb-8">
              Join thousands of learners and achieve your goals with E-Learning Platform.
            </p>
          </div>
        </section>

        <Element name="services">
          {/* Services Section */}
          <section id="services" className="py-16 bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                Our Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Browse
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Explore an extensive array of courses and modules spread across diverse categories like artificial intelligence, web development, app development, machine learning, and beyond. Each course is meticulously curated to meet the needs of both beginners and seasoned professionals.
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Dashboard
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Track your progress with live updates and detailed data visualisation that keep you informed and motivated. Watch your skills grow in real time as you navigate through your learning path with sleek, intuitive design elements that make learning not only productive but also visually appealing.
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Test & Practice
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Put your knowledge to the test on the 'Test & Practice' page is designed to challenge your understanding and sharpen your skills. Engage with a variety of quizzes and practice tests that reflect your watched content, helping you to consolidate your learning and perform at your best!
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Element>
        <Element name="pricing">
        {/* Pricing Section */}
        <section id="pricing" className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
              Pricing
            </h2>
            <p className="text-lg text-center text-gray-600 dark:text-gray-400">
              Our pricing plans will be available soon.
            </p>
          </div>
        </section>
        </Element>
        <Element name="contact">
        {/* Contact Section */}
        <section id="contact" className="py-16 bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
              Contact Us
            </h2>
            <p className="text-lg text-center text-gray-600 dark:text-gray-400">
              For any inquiries, please contact us at: contact@example.com
            </p>
          </div>
        </section>
        </Element>
        {/* Footer Section */}
        <footer className="py-8 bg-gray-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 E-Learning Platform. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Homepage;
