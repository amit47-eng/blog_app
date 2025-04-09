"use client";

import { useState, useEffect } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", description: "", tags: "lifestyle" });
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/artical/get_post", {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await res.json();
        setPosts(data.response || []);
      } catch (err) {
        setError(err.message || "Failed to fetch posts");
      }
    }
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/artical/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create post");
      }
      const data = await res.json();
      setPosts([...posts, data.article]);
      setNewPost({ title: "", description: "", tags: "lifestyle" });
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <form onSubmit={handleCreatePost} className="flex flex-col gap-4 mb-8">
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          className="border p-2"
          required
        />
        <textarea
          placeholder="Description"
          value={newPost.description}
          onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
          className="border p-2"
          required
        />
        <select
          value={newPost.tags}
          onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
          className="border p-2"
        >
          <option value="lifestyle">Lifestyle</option>
          <option value="tech">Tech</option>
          <option value="food">Food</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Create Post
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul>
        {posts.map((post: any) => (
          <li key={post._id} className="border p-4 mb-4">
            <h2 className="text-xl font-bold">{post.article_title}</h2>
            <p>{post.article_description}</p>
            <p className="text-sm text-gray-500">Tags: {post.tags}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
