"use client";
import { useEffect, useState } from "react";

type User = {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  about: string;
  avatar?: string;
  isSubscribed?: boolean;
  role?: string;
  dob?: string;
  phoneNumber?: string;
  article?: string[];
};

export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get userId from localStorage (set after login)
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }
    fetch(`/api/user/getuser_by_id?id=${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data.response || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-blue-900 to-blue-700">
        <div className="text-blue-200 text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-blue-900 to-blue-700">
        <div className="text-red-400 text-xl">User not found or not logged in.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-blue-900 to-blue-700 px-2">
      <div className="w-full max-w-md p-8 bg-black/80 rounded-2xl shadow-2xl shadow-blue-900/60 backdrop-blur-lg flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-blue-900 flex items-center justify-center mb-4 overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl text-blue-300 font-bold">
              {user.firstname?.[0]}
              {user.lastname?.[0]}
            </span>
          )}
        </div>
        <h2 className="text-2xl font-bold text-blue-100 mb-1">
          {user.firstname} {user.lastname}
        </h2>
        <div className="text-blue-400 text-lg mb-2">@{user.username}</div>
        <div className="text-blue-200 text-center mb-4">{user.about}</div>
        <div className="flex flex-col gap-2 w-full text-blue-300 text-sm mb-4">
          <div>
            <span className="font-semibold">Email:</span> {user.email}
          </div>
          {user.phoneNumber && (
            <div>
              <span className="font-semibold">Phone:</span> {user.phoneNumber}
            </div>
          )}
          {user.dob && (
            <div>
              <span className="font-semibold">DOB:</span> {new Date(user.dob).toLocaleDateString()}
            </div>
          )}
          <div>
            <span className="font-semibold">Role:</span> {user.role}
          </div>
          <div>
            <span className="font-semibold">Subscribed:</span>{" "}
            {user.isSubscribed ? (
              <span className="text-green-400">Yes</span>
            ) : (
              <span className="text-red-400">No</span>
            )}
          </div>
        </div>
        <div className="flex gap-8 mt-4">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-blue-200">{user.article?.length || 0}</span>
            <span className="text-xs text-blue-400">Posts</span>
          </div>
          {/* Add more stats if needed */}
        </div>
      </div>
    </div>
  );
}
