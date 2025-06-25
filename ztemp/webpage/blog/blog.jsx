import React, { useEffect, useState } from "react";
import "./blog.css";
import WebpageHeader from "../header/header.jsx";

const MEDIUM_RSS_FEED = "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@tommy.rowe.dev"; // Our Medium RSS feed
const RSS_FEED = MEDIUM_RSS_FEED;

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(RSS_FEED)
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          setPosts(data.items);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <WebpageHeader />
      <main className="blog-container">
        <h1 className="blog-title">MyPropertyPal Blog</h1>
        {loading && (
          <div className="blog-loading-spinner">
            <div className="spinner"></div>
            <div className="spinner-text">Loading articles...</div>
          </div>
        )}
        {!loading && posts.length === 0 && <p>No articles found.</p>}
        <div className="blog-list">
          {posts.map(post => (
            <a
              className="blog-post"
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              key={post.guid}
            >
              {post.thumbnail && (
                <img src={post.thumbnail} alt={post.title} className="blog-thumb" />
              )}
              <div className="blog-content">
                <h2>{post.title}</h2>
                <p className="blog-desc">{post.description.replace(/<[^>]+>/g, '').slice(0, 120)}...</p>
                <span className="blog-date">
                  {new Date(post.pubDate).toLocaleDateString()}
                </span>
              </div>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}