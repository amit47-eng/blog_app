"use client";
import { useState, useEffect } from "react";

type Post = {
  id: string;
  article_title: string;
  article_description: string;
  tags: string[]; // <-- should be an array for multi-tag support
  summary?: string;
  content?: string;
  article_image_url?: string;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<{
    title: string;
    description: string;
    tags: string[];
    content: string;
    summary: string;
    article_image_url: string;
  }>({
    title: "",
    description: "",
    tags: [], // allow multiple tags
    content: "",
    summary: "",
    article_image_url: ""
  });
  const [error, setError] = useState<string>("");
  const [showCreate, setShowCreate] = useState(false);

  // Fetch posts on mount
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/artical/get_post");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        // Transform `_id` to `id` if necessary
        const articles: Post[] = data.articles.map((a: any) => ({
          id: a.id || a._id,
          article_title: a.article_title,
          article_description: a.article_description,
          tags: Array.isArray(a.tags) ? a.tags : (typeof a.tags === 'string' ? a.tags.split(',').map((t: string) => t.trim()) : []),
          summary: a.summary,
          content: a.content,
          article_image_url: a.article_image_url,
        }));
        setPosts(articles);
      } catch (e: any) {
        setError(e.message);
      }
    }
    fetchPosts();
  }, []);

  // Create new post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/artical/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: newPost.title,
          description: newPost.description,
          tags: newPost.tags,
          content: newPost.content,
          summary: newPost.summary,
          article_image_url: newPost.article_image_url
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { article } = await res.json();
      const created: Post = {
        id: article.id || article._id,
        article_title: article.article_title,
        article_description: article.article_description,
        tags: Array.isArray(article.tags) ? article.tags : (typeof article.tags === 'string' ? article.tags.split(',').map((t: string) => t.trim()) : []),
        summary: article.summary,
        content: article.content,
        article_image_url: article.article_image_url,
      };
      setPosts(prev => [...prev, created]);
      setNewPost({ title: "", description: "", tags: [], content: "", summary: "", article_image_url: "" });
      setShowCreate(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Delete a post
  const handleDeletePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/artical/delete?postId=${postId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center py-8 px-2">
      <div className="max-w-3xl w-full mx-auto p-6 md:p-8 bg-white/60 rounded-2xl shadow-2xl shadow-black/40 mt-12 backdrop-blur-lg">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 tracking-tight drop-shadow-lg">
          Blog Posts
        </h1>
        <div className="flex justify-end mb-6 gap-4">
          <button
            onClick={() => setShowCreate((prev) => !prev)}
            className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 text-white font-bold px-6 py-2 rounded-xl shadow-lg shadow-black/30 hover:scale-105 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 text-lg tracking-wide active:scale-95"
          >
            {showCreate ? 'Cancel' : 'Create Post'}
          </button>
          {/* Settings/Options button (placeholder) */}
          <button
            className="bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 text-black font-bold px-6 py-2 rounded-xl shadow-lg shadow-black/30 hover:scale-105 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 text-lg tracking-wide active:scale-95"
            title="Settings (coming soon)"
            disabled
          >
            ⚙️ Settings
          </button>
        </div>
        {showCreate && (
          <form onSubmit={handleCreatePost} className="flex flex-col gap-4 mb-12 bg-white/80 p-8 rounded-2xl shadow-lg shadow-black/30 backdrop-blur-md">
            <input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={e => setNewPost({ ...newPost, title: e.target.value })}
              required
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition text-lg bg-white/60 shadow-inner"
            />
            <textarea
              placeholder="Description"
              value={newPost.description}
              onChange={e => setNewPost({ ...newPost, description: e.target.value })}
              required
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition min-h-[80px] text-base bg-white/60 shadow-inner"
            />
            <input
              type="text"
              placeholder="Tags (comma separated, e.g. tech,life,food)"
              value={Array.isArray(newPost.tags) ? newPost.tags.join(", ") : newPost.tags}
              onChange={e => setNewPost({ ...newPost, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition text-base bg-white/60 shadow-inner"
            />
            <textarea
              placeholder="Content (optional)"
              value={newPost.content}
              onChange={e => setNewPost({ ...newPost, content: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition min-h-[100px] text-base bg-white/60 shadow-inner"
            />
            <input
              type="text"
              placeholder="Summary (optional)"
              value={newPost.summary}
              onChange={e => setNewPost({ ...newPost, summary: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition text-base bg-white/60 shadow-inner"
            />
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={newPost.article_image_url}
              onChange={e => setNewPost({ ...newPost, article_image_url: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition text-base bg-white/60 shadow-inner"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 text-white font-bold p-3 rounded-xl shadow-lg shadow-black/30 hover:scale-105 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 text-lg tracking-wide active:scale-95"
            >
              <span className="inline-block align-middle mr-2">✍️</span> Create Post
            </button>
          </form>
        )}
        {/* Error Display */}
        {error && (
          <div className="text-red-600 mb-8 text-center font-semibold bg-red-50 py-2 rounded-lg shadow">
            {error}
          </div>
        )}
        {/* Posts List */}
        <ul className="grid gap-8">
          {posts.length === 0 && (
            <li className="text-center text-gray-400 italic">
              No posts yet. Be the first to create one!
            </li>
          )}
          {posts.map((post, idx) => (
            <li
              key={post.id}
              className="border border-gray-200 p-8 rounded-2xl shadow-xl shadow-black/30 bg-gradient-to-br from-white/80 via-purple-50 to-blue-50 hover:shadow-2xl hover:scale-[1.025] hover:shadow-black/50 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 drop-shadow">
                {post.article_title}
              </h2>
              <p className="mb-4 text-gray-700 text-base">{post.article_description}</p>
              {/* Show tags as badges */}
              <div className="flex flex-wrap gap-2 mb-2">
                {Array.isArray(post.tags)
                  ? post.tags.map((tag: string, i: number) => (
                      <span key={i} className="inline-block bg-gradient-to-r from-fuchsia-100 via-purple-100 to-blue-100 text-fuchsia-700 px-4 py-1 rounded-full text-xs font-semibold shadow">
                        {tag}
                      </span>
                    ))
                  : null}
              </div>
              {/* Show summary if available */}
              {post.summary && (
                <p className="mb-2 text-gray-500 text-sm italic">{post.summary}</p>
              )}
              {/* Show content if available */}
              {post.content && (
                <div className="mb-2 text-gray-800 whitespace-pre-line text-base">{post.content}</div>
              )}
              {/* Show image if available */}
              {post.article_image_url && (
                <img src={post.article_image_url} alt="Post image" className="w-full max-h-64 object-cover rounded-xl mb-2" />
              )}
              {/* Comment and settings placeholder */}
              <div className="flex justify-between items-center mt-4">
                <button
                  className="bg-gradient-to-r from-blue-400 via-purple-400 to-fuchsia-500 text-white px-4 py-1 rounded-full shadow font-semibold text-xs hover:scale-105 transition"
                  title="Comment (coming soon)"
                  disabled
                >
                  💬 Comment
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="bg-gradient-to-r from-red-400 via-pink-500 to-fuchsia-600 hover:from-red-500 hover:to-fuchsia-700 text-white px-5 py-2 rounded-full shadow-lg shadow-black/30 font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/50 active:scale-95 border-2 border-transparent hover:border-fuchsia-200"
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* Add this to your global CSS (e.g., globals.css):
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
*/
