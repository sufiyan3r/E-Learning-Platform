import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useClerk } from "@clerk/clerk-react";
import {
  faHome,
  faChartLine,
  faPencilAlt,
  faDollarSign,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const { signOut } = useClerk();
  const navigateTo = useNavigate();

  const handleHover = (icon) => {
    setHoveredIcon(icon);
  };

  const handleMouseOut = () => {
    setHoveredIcon(null);
  };

  const handleSignOut = () => {
    signOut().then(() => {
      localStorage.removeItem("clerk-db-jwt");
      navigateTo("/");
    });
  };


  return (
    <div className="flex flex-col min-w-64 h-screen bg-gray-200 dark:bg-gray-900">
      <div className="flex items-center space-x-4 h-16 ml-3">
        <a href="#" className="flex items-center space-x-1">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            E-Learning <span className="text-blue-800 font-bold dark:text-blue-600">Platform</span>
          </span>
        </a>
      </div>
      <nav className="flex-grow">
        <ul>
          <li className="border-b dark:border-gray-800 transition-colors">
            <Link
              to="/dashboard"
              className="block p-4 text-gray-800 dark:text-white items-center hover:bg-gray-300 dark:hover:bg-gray-800"
              onMouseOver={() => handleHover(faChartLine)}
              onMouseOut={handleMouseOut}
            >
              <FontAwesomeIcon
                icon={faChartLine}
                className={`mr-2 ${
                  hoveredIcon === faChartLine && "text-blue-500"
                }`}
              />
              Dashboard
            </Link>
          </li>
          <li className="border-b dark:border-gray-800 transition-colors">
            <Link
              to="/browse"
              className="block p-4 text-gray-800 dark:text-white items-center hover:bg-gray-300 dark:hover:bg-gray-800"
              onMouseOver={() => handleHover(faHome)}
              onMouseOut={handleMouseOut}
            >
              <FontAwesomeIcon
                icon={faHome}
                className={`mr-2 ${hoveredIcon === faHome && "text-blue-500"}`}
              />
              Browse
            </Link>
          </li>

          <li className="border-b dark:border-gray-800 transition-colors">
            <Link
              to="/test-practice"
              className="block p-4 text-gray-800 dark:text-white items-center hover:bg-gray-300 dark:hover:bg-gray-800"
              onMouseOver={() => handleHover(faPencilAlt)}
              onMouseOut={handleMouseOut}
            >
              <FontAwesomeIcon
                icon={faPencilAlt}
                className={`mr-2 ${
                  hoveredIcon === faPencilAlt && "text-blue-500"
                }`}
              />
              Test & Practice
            </Link>
          </li>
          <li className="border-b dark:border-gray-800 transition-colors">
            <Link
              to="/pricing"
              className="block p-4 text-gray-800 dark:text-white items-center hover:bg-gray-300 dark:hover:bg-gray-800"
              onMouseOver={() => handleHover(faDollarSign)}
              onMouseOut={handleMouseOut}
            >
              <FontAwesomeIcon
                icon={faDollarSign}
                className={`mr-2 ${
                  hoveredIcon === faDollarSign && "text-blue-500"
                }`}
              />
              Pricing
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-auto">
        <ul>
          <li className="border-b dark:border-gray-800 transition-colors">
            <Link
              to="/settings"
              className="block p-4 text-gray-800 dark:text-white items-center hover:bg-gray-300 dark:hover:bg-gray-800"
              onMouseOver={() => handleHover(faCog)}
              onMouseOut={handleMouseOut}
            >
              <FontAwesomeIcon
                icon={faCog}
                className={`mr-2 ${hoveredIcon === faCog && "text-blue-500"}`}
              />
              Settings
            </Link>
          </li>
          <li className="border-b dark:border-gray-800 transition-colors">
            {/* sign out clerk button */}
            <button
              onClick={handleSignOut}
              className="block p-4 text-gray-800 dark:text-white items-center hover:bg-gray-300 dark:hover:bg-gray-800 w-full"
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="mr-2 text-red-500 float-left mt-1"
              />

              <span className="float-left">Sign Out</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
