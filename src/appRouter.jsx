import Login from "./assets/components/publicComponents/Login";
import Logout from "./assets/components/publicComponents/Logout";
import Homepage from "./assets/components/publicComponents/homepage";
import Dashboard from "./assets/components/AuthenticatedComponents/dashboard";
import Browse from "./assets/components/AuthenticatedComponents/browse";
import TestPractice from "./assets/components/AuthenticatedComponents/testPractice";
import Pricing from "./assets/components/AuthenticatedComponents/pricing";
import Settings from "./assets/components/AuthenticatedComponents/settings";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        {/* Auth Components -> When user logged in */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/test-practice" element={<TestPractice />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
