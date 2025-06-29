"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loginField, setLoginField] = useState(""); // can be email or phone
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- Add state
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Determine if input is email or phone
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginField);
      const payload = isEmail
        ? { email: loginField, password }
        : { phoneNumber: loginField, password };
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/posts");
      } else {
        const data = await res.json();
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-blue-900 to-blue-700 px-2">
      <div className="w-full max-w-md p-8 bg-black/80 rounded-2xl shadow-2xl shadow-blue-900/60 backdrop-blur-lg">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-white bg-clip-text tracking-tight drop-shadow-lg">
          Login
        </h1>
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-5 mb-2 bg-blue-900/90 p-6 rounded-2xl shadow-lg shadow-blue-900/30 backdrop-blur-md"
        >
          <input
            type="text"
            placeholder="Email or Phone Number"
            value={loginField}
            onChange={(e) => setLoginField(e.target.value)}
            className="border border-blue-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-lg bg-black/70 text-white placeholder-blue-300"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-blue-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-lg bg-black/70 text-white placeholder-blue-300 w-full pr-12"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-100 focus:outline-none"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // Eye open SVG
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                // Eye closed SVG
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.873 6.873A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.293 5.95M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3l18 18"
                  />
                </svg>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-xl shadow-lg shadow-blue-900/30 transition-all duration-300 text-lg tracking-wide active:scale-95"
          >
            Login
          </button>
        </form>
        {error && (
          <div className="text-red-400 mt-4 text-center font-semibold bg-blue-950/60 py-2 rounded-lg shadow">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
