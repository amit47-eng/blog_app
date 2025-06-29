"use client";

import { useState } from "react";
import LoginPage from "./login/page";
import SignupPage from "./signup/page";

export default function Home() {
  const [isSignup, setIsSignup] = useState(false); // State to toggle between Login and Signup

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-blue-900 to-blue-700 px-2">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-4 md:p-8 bg-black/70 rounded-2xl shadow-2xl shadow-blue-900/60 backdrop-blur-lg">
        {isSignup ? (
          <>
            <SignupPage />
            <p className="text-center mt-4 text-base md:text-lg">
              Already have an account?{" "}
              <button
                onClick={() => setIsSignup(false)}
                className="text-blue-400 underline hover:text-blue-600 transition"
              >
                Back to Login
              </button>
            </p>
          </>
        ) : (
          <>
            <LoginPage />
            <p className="text-center mt-4 text-base md:text-lg">
              New user?{" "}
              <button
                onClick={() => setIsSignup(true)}
                className="text-blue-400 underline hover:text-blue-600 transition"
              >
                Sign Up
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
