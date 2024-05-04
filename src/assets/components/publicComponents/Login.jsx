import { SignedIn } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const Login = () => {
  return (
    <>
      <SignedIn>
        <Navigate to="/dashboard" />
      </SignedIn>

    </>
  );
}

export default Login;
