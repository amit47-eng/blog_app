"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loginField, setLoginField] = useState(""); // can be email or phone
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 px-2">
      <div className="w-full max-w-md p-8 bg-white/60 rounded-2xl shadow-2xl shadow-black/40 backdrop-blur-lg">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 tracking-tight drop-shadow-lg">
          Login
        </h1>
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-5 mb-2 bg-white/80 p-6 rounded-2xl shadow-lg shadow-black/30 backdrop-blur-md"
        >
          <input
            type="text"
            placeholder="Email or Phone Number"
            value={loginField}
            onChange={(e) => setLoginField(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition text-lg bg-white/60 shadow-inner"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition text-lg bg-white/60 shadow-inner"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 text-white font-bold p-3 rounded-xl shadow-lg shadow-black/30 hover:scale-105 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 text-lg tracking-wide active:scale-95"
          >
            Login
          </button>
        </form>
        {error && (
          <div className="text-red-600 mt-4 text-center font-semibold bg-red-50 py-2 rounded-lg shadow">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
