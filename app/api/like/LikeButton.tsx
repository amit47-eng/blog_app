import { useState } from "react";

interface LikeButtonProps {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
}

export default function LikeButton({ postId, initialLiked, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    setLoading(true);
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));
    try {
      await fetch(`/api/like?postId=${postId}`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      // Optionally revert on error
      setLiked((prev) => !prev);
      setCount((prev) => (liked ? prev + 1 : prev - 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 font-semibold shadow hover:scale-105 transition"
      onClick={handleLike}
      disabled={loading}
      aria-pressed={liked}
    >
      <span className={`text-2xl transition ${liked ? 'text-red-500' : 'text-gray-400'}`}>❤️</span>
      <span className="ml-1 text-fuchsia-700 font-semibold">Like</span>
      <span className="ml-2 text-xs text-gray-500">{count}</span>
    </button>
  );
}
