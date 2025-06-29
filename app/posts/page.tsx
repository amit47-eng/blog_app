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
  user?: string; // <-- add user field for ownership
  username?: string; // <-- add username
};

// Add types for likes and comments
interface Like {
  user: string;
  postId: string;
}
interface Comment {
  _id: string;
  user: string;
  content: string;
  createdAt: string;
}

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
  const [showSettings, setShowSettings] = useState(false);

  // Assume you have a way to get the current user's id, e.g. from a context or cookie
  // For demo, let's use a placeholder (replace with your real user id logic)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  useEffect(() => {
    // TODO: Replace with real user id fetch (e.g. from JWT, context, or API)
    // setCurrentUserId(getCurrentUserId());
    // For now, try to get from localStorage (if you store it there after login)
    setCurrentUserId(localStorage.getItem("userId"));
  }, []);

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
          user: a.user ? (typeof a.user === 'object' ? a.user._id : a.user) : undefined,
          username: a.user && typeof a.user === 'object' ? a.user.username : a.username, // <-- get username from populated user or direct field
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
        user: article.user ? (typeof article.user === 'object' ? article.user._id : article.user) : undefined,
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
        credentials: "include", // <-- this is required!
      });
      if (!res.ok) throw new Error(await res.text());
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const [likedPosts, setLikedPosts] = useState<string[]>([]); // store liked post ids
  const [likes, setLikes] = useState<Record<string, Like[]>>({}); // postId -> likes
  const [comments, setComments] = useState<Record<string, Comment[]>>({}); // postId -> comments
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({}); // postId -> input
  const [showCommentInput, setShowCommentInput] = useState<Record<string, boolean>>({}); // postId -> show/hide
  const [shareMsg, setShareMsg] = useState<Record<string, string>>({});

  // Fetch likes and comments for all posts
  useEffect(() => {
    async function fetchLikesAndComments() {
      const likeData: Record<string, Like[]> = {};
      const commentData: Record<string, Comment[]> = {};
      for (const post of posts) {
        // Fetch likes
        const likeRes = await fetch(`/api/like?postId=${post.id}`);
        likeData[post.id] = likeRes.ok ? await likeRes.json() : [];
        // Fetch comments
        const commentRes = await fetch(`/api/comment?postId=${post.id}`);
        commentData[post.id] = commentRes.ok ? await commentRes.json() : [];
      }
      setLikes(likeData);
      setComments(commentData);
    }
    if (posts.length > 0) fetchLikesAndComments();
  }, [posts]);

  // Like post handler (no optimistic update)
  const handleLikePost = async (postId: string) => {
    const alreadyLiked = likes[postId]?.some(like => like.user === currentUserId);
    try {
      const res = await fetch(`/api/like?postId=${postId}`, {
        method: alreadyLiked ? "DELETE" : "POST",
        credentials: "include",
      });
      // Always refetch likes from backend to ensure consistency
      const likeRes = await fetch(`/api/like?postId=${postId}`);
      const likeJson = likeRes.ok ? await likeRes.json() : [];
      setLikes(l => ({ ...l, [postId]: likeJson }));
    } catch {
      // On error, refetch likes to revert UI
      const likeRes = await fetch(`/api/like?postId=${postId}`);
      const likeJson = likeRes.ok ? await likeRes.json() : [];
      setLikes(l => ({ ...l, [postId]: likeJson }));
    }
  };

  // Add comment handler (no optimistic update)
  const handleAddComment = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    setCommentInputs(inputs => ({ ...inputs, [postId]: "" }));
    try {
      await fetch(`/api/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ article: postId, comment: content }),
      });
    } finally {
      // Always refetch comments for this post to sync with backend
      const commentRes = await fetch(`/api/comment?postId=${postId}`);
      const commentJson = commentRes.ok ? await commentRes.json() : [];
      setComments(c => ({ ...c, [postId]: commentJson }));
    }
  };

  // Share handler
  const handleShare = (postId: string) => {
    const url = `${window.location.origin}/posts?postId=${postId}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareMsg((prev) => ({ ...prev, [postId]: "Link copied!" }));
      setTimeout(() => setShareMsg((prev) => ({ ...prev, [postId]: "" })), 2000);
    });
  };

  // Show all comments if comment input is open, otherwise show only the first comment
  const renderComments = (postId: string) => {
    const postComments = comments[postId] || [];
    const showAll = showCommentInput[postId];
    const commentsToShow = showAll ? postComments : postComments.slice(0, 1);
    return (
      <ul className="mb-2">
        {commentsToShow.map((c) => (
          <li key={c._id} className="mb-1 text-blue-100 text-sm">
            <span className="font-bold text-blue-400">
              {typeof c.user === "object" && c.user !== null
                ? c.user.username
                : c.user}
            </span>
            : {c.content}
          </li>
        ))}
        {!showAll && postComments.length > 1 && (
          <li className="text-xs text-blue-400 italic">
            ...and {postComments.length - 1} more comment(s)
          </li>
        )}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-blue-700 flex items-center justify-center py-8 px-2 relative">
      {/* Left-side floating buttons */}
      <div className="fixed top-6 left-8 z-50 flex flex-col gap-4">
        <button
          className="bg-gray-800 text-blue-200 font-bold px-5 py-2 rounded-full shadow-lg shadow-blue-900/40 transition-all duration-200 text-base tracking-wide active:scale-95"
          title="Settings"
          onClick={() => setShowSettings(true)}
        >
          ⚙️ Settings
        </button>
        <a
          href="/user"
          className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-5 py-2 rounded-full shadow-lg shadow-blue-900/40 transition-all duration-200 text-base tracking-wide active:scale-95 text-center"
          title="Go to your profile"
        >
          My Profile
        </a>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-blue-900 rounded-2xl p-8 shadow-2xl max-w-sm w-full text-blue-100 relative">
            <button
              className="absolute top-3 right-4 text-blue-300 hover:text-white text-2xl"
              onClick={() => setShowSettings(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <div className="mb-4">
              <p className="text-blue-200">Settings functionality coming soon!</p>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded shadow"
              onClick={() => setShowSettings(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl w-full mx-auto p-6 md:p-8 bg-black/80 rounded-2xl shadow-2xl shadow-blue-900/60 mt-12 backdrop-blur-lg">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-white bg-clip-text tracking-tight drop-shadow-lg">
          Blog Posts
        </h1>
        <div className="flex justify-end mb-6 gap-4">
          <button
            onClick={() => setShowCreate((prev) => !prev)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-xl shadow-lg shadow-blue-900/30 transition-all duration-300 text-lg tracking-wide active:scale-95"
          >
            {showCreate ? 'Cancel' : 'Create Post'}
          </button>
        </div>
        {showCreate && (
          <form onSubmit={handleCreatePost} className="flex flex-col gap-4 mb-12 bg-blue-900/90 p-8 rounded-2xl shadow-lg shadow-blue-900/30 backdrop-blur-md">
            <input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={e => setNewPost({ ...newPost, title: e.target.value })}
              required
              className="border border-blue-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-lg bg-black/70 text-white placeholder-blue-300"
            />
            <textarea
              placeholder="Description"
              value={newPost.description}
              onChange={e => setNewPost({ ...newPost, description: e.target.value })}
              required
              className="border border-blue-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition min-h-[80px] text-base bg-black/70 text-white placeholder-blue-300"
            />
            <input
              type="text"
              placeholder="Tags (comma separated, e.g. tech,life,food)"
              value={Array.isArray(newPost.tags) ? newPost.tags.join(", ") : newPost.tags}
              onChange={e => setNewPost({ ...newPost, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
              className="border border-blue-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base bg-black/70 text-white placeholder-blue-300"
            />
            <textarea
              placeholder="Content (optional)"
              value={newPost.content}
              onChange={e => setNewPost({ ...newPost, content: e.target.value })}
              className="border border-blue-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition min-h-[100px] text-base bg-black/70 text-white placeholder-blue-300"
            />
            <input
              type="text"
              placeholder="Summary (optional)"
              value={newPost.summary}
              onChange={e => setNewPost({ ...newPost, summary: e.target.value })}
              className="border border-blue-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base bg-black/70 text-white placeholder-blue-300"
            />
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={newPost.article_image_url}
              onChange={e => setNewPost({ ...newPost, article_image_url: e.target.value })}
              className="border border-blue-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base bg-black/70 text-white placeholder-blue-300"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-xl shadow-lg shadow-blue-900/30 transition-all duration-300 text-lg tracking-wide active:scale-95"
            >
              <span className="inline-block align-middle mr-2">✍️</span> Create Post
            </button>
          </form>
        )}
        {error && (
          <div className="text-red-400 mb-8 text-center font-semibold bg-blue-950/60 py-2 rounded-lg shadow">
            {error}
          </div>
        )}
        <ul className="grid gap-8">
          {posts.length === 0 && (
            <li className="text-center text-blue-200 italic">
              No posts yet. Be the first to create one!
            </li>
          )}
          {posts.map((post, idx) => (
            <li
              key={post.id}
              className="relative border border-blue-800 p-8 rounded-2xl shadow-xl shadow-blue-900/30 bg-gradient-to-br from-black/90 via-blue-900/90 to-blue-800/90 hover:shadow-2xl hover:scale-[1.025] hover:shadow-blue-900/50 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Show username at the top */}
              <div className="mb-2 text-xs text-blue-300 font-mono">
                Username: {post.username || "Unknown"}
              </div>
              {/* Post number */}
              <span className="absolute top-4 left-4 text-xs text-blue-700 font-bold">#{idx + 1}</span>
              {/* 3-dots menu for owner only */}
              {currentUserId && post.user === currentUserId && (
                <div className="absolute top-4 right-4 group">
                  <button className="text-gray-400 hover:text-gray-700 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-400">
                    <span className="text-2xl">⋮</span>
                  </button>
                  <div className="hidden group-hover:block absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-t-lg"
                    >
                      🗑️ Delete
                    </button>
                    <button
                      // onClick={handleEditPost}
                      className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-b-lg"
                      disabled
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>
              )}
              <h2 className="text-2xl font-bold mb-2 text-blue-100 drop-shadow">
                {post.article_title}
              </h2>
              <p className="mb-4 text-blue-200 text-base">{post.article_description}</p>
              {/* Show tags as badges */}
              <div className="flex flex-wrap gap-2 mb-2">
                {Array.isArray(post.tags)
                  ? post.tags.map((tag: string, i: number) => (
                      <span key={i} className="inline-block bg-blue-800 text-blue-200 px-4 py-1 rounded-full text-xs font-semibold shadow">
                        {tag}
                      </span>
                    ))
                  : null}
              </div>
              {/* Show summary if available */}
              {post.summary && (
                <p className="mb-2 text-blue-300 text-sm italic">{post.summary}</p>
              )}
              {/* Show content if available */}
              {post.content && (
                <div className="mb-2 text-blue-100 whitespace-pre-line text-base">{post.content}</div>
              )}
              {/* Show image if available */}
              {post.article_image_url && (
                <img src={post.article_image_url} alt="Post image" className="w-full max-h-64 object-cover rounded-xl mb-2" />
              )}
              {/* Bottom actions: Like, Comment, Share */}
              <div className="flex gap-4 mt-6 items-center">
                <button
                  className="flex items-center gap-1 px-4 py-2 rounded-full bg-blue-700 hover:bg-blue-600 text-white font-semibold shadow hover:scale-105 transition"
                  onClick={() => handleLikePost(post.id)}
                  aria-pressed={likes[post.id]?.some(like => like.user === currentUserId)}
                >
                  <span className={`text-2xl transition ${likes[post.id]?.some(like => like.user === currentUserId) ? 'text-blue-200' : 'text-blue-400'}`}>❤️</span>
                  <span className="ml-1 font-semibold">Like</span>
                  <span className="ml-2 text-xs text-blue-300">{likes[post.id]?.length || 0}</span>
                </button>
                <button
                  className="flex items-center gap-1 px-4 py-2 rounded-full bg-blue-800 hover:bg-blue-700 text-blue-200 font-semibold shadow hover:scale-105 transition"
                  onClick={() => setShowCommentInput((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                  type="button"
                >
                  💬 Comment <span className="ml-2 text-xs text-blue-300">{comments[post.id]?.length || 0}</span>
                </button>
                <button
                  className="flex items-center gap-1 px-4 py-2 rounded-full bg-blue-900 hover:bg-blue-800 text-blue-200 font-semibold shadow hover:scale-105 transition"
                  onClick={() => handleShare(post.id)}
                  type="button"
                >
                  🔗 Share
                </button>
                {shareMsg[post.id] && (
                  <span className="ml-2 text-xs text-green-400">{shareMsg[post.id]}</span>
                )}
              </div>
              {/* Comment section */}
              <div className="mt-4 bg-blue-950/70 rounded-xl p-4 shadow-inner">
                <div className="text-sm text-blue-300 mb-2">Comments</div>
                {renderComments(post.id)}
                {showCommentInput[post.id] && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ""}
                      onChange={e => setCommentInputs(inputs => ({ ...inputs, [post.id]: e.target.value }))}
                      className="flex-1 border border-blue-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-black/60 text-white placeholder-blue-300"
                      placeholder="Add a comment..."
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded shadow hover:scale-105 transition"
                    >
                      Post
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}