/* eslint-disable react/no-unescaped-entities */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./sidebar";

const Pricing = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>
      <div className="flex-grow p-6">
        <h1 className="text-3xl font-semibold mb-6">Pricing</h1>
        <div className="flex items-center grid-cols-1 md:grid-cols-3 gap-6">
          {/* Standard Pricing */}
          <div className="bg-white rounded-lg shadow-md p-6 h-96"> {/* Adjusted height */}
            <h2 className="text-xl font-semibold mb-4">Standard</h2>
            <p className="text-gray-600 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">$10/month</p>
              <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                Get Started
              </button>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">What's Included:</h3>
              <ul>
                <li>
                  <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" /> Feature 1
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" /> Feature 2
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" /> Feature 3
                </li>
                <li>
                  <FontAwesomeIcon icon={faXmark} className="text-red-500 mr-2" /> Feature 4
                </li>
                <li>
                  <FontAwesomeIcon icon={faXmark} className="text-red-500 mr-2" /> Feature 5
                </li>
              </ul>
            </div>
          </div>
          {/* Premium Pricing */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 md:rounded-xl h-96">
            <h2 className="text-xl font-semibold mb-4">Premium</h2>
            <p className="text-gray-600 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">$15/month</p>
              <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                Get Started
              </button>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">What's Included:</h3>
              <ul>
                <li>
                  <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" /> Feature 1
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" /> Feature 2
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" /> Feature 3
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" /> Feature 4
                </li>
                <li>
                  <FontAwesomeIcon icon={faXmark} className="text-red-500 mr-2" /> Feature 5
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
