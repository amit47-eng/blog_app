"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    about: "",
    email: "",
    password: "",
    username: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Client-side validation: at least email or phone number
    if (!formData.email && !formData.phoneNumber) {
      setError("You must provide at least an email or a phone number.");
      return;
    }
    // Client-side validation: about field minimum length
    if (formData.about.trim().length < 10) {
      setError("About must be at least 10 characters.");
      return;
    }
    try {
      const res = await fetch("/api/user/createuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-blue-900 to-blue-700 px-2">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-4 md:p-8 bg-black/80 rounded-2xl shadow-2xl shadow-blue-900/60 backdrop-blur-lg">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6 md:mb-8 text-center text-white bg-clip-text tracking-tight drop-shadow-lg">
          Signup
        </h1>
        <form onSubmit={handleSignup} className="flex flex-col gap-4 md:gap-5 mb-2 bg-blue-900/90 p-4 md:p-6 rounded-2xl shadow-lg shadow-blue-900/30 backdrop-blur-md">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleChange}
              className="flex-1 min-w-0 border border-blue-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base md:text-lg bg-black/70 text-white placeholder-blue-300"
              required
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleChange}
              className="flex-1 min-w-0 border border-blue-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base md:text-lg bg-black/70 text-white placeholder-blue-300"
              required
            />
          </div>
          <input
            type="text"
            name="about"
            placeholder="About"
            value={formData.about}
            onChange={handleChange}
            minLength={10}
            className="border border-blue-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base md:text-lg bg-black/70 text-white placeholder-blue-300"
            required
          />
          <div className="flex flex-col md:flex-row gap-3 w-full">
            <input
              type="email"
              name="email"
              placeholder="Email (optional)"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 min-w-0 border border-blue-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base md:text-lg bg-black/70 text-white placeholder-blue-300"
            />
            <span className="hidden md:inline self-center text-blue-300 font-semibold">or</span>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number (optional)"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="flex-1 min-w-0 border border-blue-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base md:text-lg bg-black/70 text-white placeholder-blue-300"
            />
          </div>
          <p className="text-xs text-blue-300 -mt-2 mb-1 text-center md:text-left">You must provide at least an email or a phone number.</p>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border border-blue-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base md:text-lg bg-black/70 text-white placeholder-blue-300"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="border border-blue-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base md:text-lg bg-black/70 text-white placeholder-blue-300"
            required
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-xl shadow-lg shadow-blue-900/30 transition-all duration-300 text-base md:text-lg tracking-wide active:scale-95">
            Signup
          </button>
        </form>
        {error && <div className="text-red-400 mt-4 text-center font-semibold bg-blue-950/60 py-2 rounded-lg shadow">{error}</div>}
      </div>
    </div>
  );
}
