
import { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Trash2,
  Send,
  Plus,
  UserCircle,
} from "lucide-react";
import "./App.css";

const API = "http://127.0.0.1:8000/api";

function App() {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("ayaan");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({});
  const [activeComments, setActiveComments] = useState({});

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API}/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    if (!content.trim()) return;

    try {
      const response = await fetch(`${API}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, content }),
      });

      if (!response.ok) throw new Error("Could not create post");

      setContent("");
      fetchPosts();
    } catch (error) {
      alert(error.message);
    }
  };

  const likePost = async (postId) => {
    try {
      const response = await fetch(`${API}/posts/${postId}/like`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Could not like post");

      fetchPosts();
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await fetch(
        `${API}/posts/${postId}/comments`
      );

      if (!response.ok) throw new Error("Could not load comments");

      const data = await response.json();
      setComments((prev) => ({ ...prev, [postId]: data }));
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleComments = async (postId) => {
    const isOpen = activeComments[postId];

    setActiveComments((prev) => ({
      ...prev,
      [postId]: !isOpen,
    }));

    if (!isOpen) {
      await fetchComments(postId);
    }
  };

  const addComment = async (postId) => {
    const commentContent = commentInputs[postId] || "";

    if (!commentContent.trim()) return;

    try {
      const response = await fetch(
        `${API}/posts/${postId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            content: commentContent,
          }),
        }
      );

      if (!response.ok) throw new Error("Could not add comment");

      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }));

      await fetchComments(postId);
    } catch (error) {
      alert(error.message);
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Could not delete post");

      fetchPosts();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="app">
      <header className="navbar">
        <h2>Socially</h2>
        <div className="profile">
          <UserCircle size={25} />
          <span>{username}</span>
        </div>
      </header>

      <main className="feed-container">
        <h1>Your Feed</h1>
        <p className="subtitle">
          Share your thoughts with the community.
        </p>

        <section className="create-post">
          <h3>Create a post</h3>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows="4"
          />

          <button className="post-button" onClick={createPost}>
            <Plus size={18} />
            Share Post
          </button>
        </section>

        <section className="posts-section">
          <h2>Recent Posts</h2>

          {loading ? (
            <p>Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="empty">No posts yet. Be the first to share!</p>
          ) : (
            posts.map((post) => (
              <article className="post-card" key={post.id}>
                <div className="post-header">
                  <div className="post-user">
                    <UserCircle size={35} />
                    <div>
                      <strong>{post.username}</strong>
                      <small>
                        {post.created_at
                          ? new Date(post.created_at).toLocaleString()
                          : ""}
                      </small>
                    </div>
                  </div>

                  <button
                    className="delete-button"
                    onClick={() => deletePost(post.id)}
                    title="Delete post"
                  >
                    <Trash2 size={19} />
                  </button>
                </div>

                <p className="post-content">{post.content}</p>

                <div className="post-actions">
                  <button onClick={() => likePost(post.id)}>
                    <Heart size={19} />
                    Like ({post.likes})
                  </button>

                  <button onClick={() => toggleComments(post.id)}>
                    <MessageCircle size={19} />
                    Comments
                  </button>
                </div>

                {activeComments[post.id] && (
                  <div className="comments-section">
                    <h4>Comments</h4>

                    {(comments[post.id] || []).map((comment) => (
                      <div className="comment" key={comment.id}>
                        <strong>{comment.username}</strong>
                        <p>{comment.content}</p>
                      </div>
                    ))}

                    {(comments[post.id] || []).length === 0 && (
                      <p>No comments yet.</p>
                    )}

                    <div className="comment-input">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        placeholder="Write a comment..."
                      />

                      <button onClick={() => addComment(post.id)}>
                        <Send size={17} />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
