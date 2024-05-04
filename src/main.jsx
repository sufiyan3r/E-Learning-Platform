import React from "react";
import ReactDOM from "react-dom/client";
// import Homepage from "./assets/components/publicComponents/homepage";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
// import Login from "./assets/components/publicComponents/Login";
import AppRouter from "./appRouter";
// check for the presence of the Clerk Publishable Key if not throw an error message
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AppRouter />
    </ClerkProvider>
  </React.StrictMode>
);
