"use client";

import { useState } from "react";
import LoginPage from "./login/page";
import SignupPage from "./signup/page";

export default function Home() {
  const [isSignup, setIsSignup] = useState(false); // State to toggle between Login and Signup

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-60 font-[family-name:var(--font-geist-sans)]">
      {isSignup ? (
        <div>
          <SignupPage />
          <p className="text-center mt-4">
            Already have an account?{" "}
            <button
              onClick={() => setIsSignup(false)}
              className="text-blue-500 underline"
            >
              Back to Login
            </button>
          </p>
        </div>
      ) : (
        <div>
          <LoginPage />
          <p className="text-center mt-4">
            New user?{" "}
            <button
              onClick={() => setIsSignup(true)}
              className="text-blue-500 underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
