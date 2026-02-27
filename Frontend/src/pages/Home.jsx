import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

function Home() {
  const [articles, setArticles] = useState([]);
  const [reporters, setReporters] = useState([]);

  useEffect(() => {
    // Fetch approved articles
    api.get("/articles/public")
      .then(res => setArticles(res.data))
      .catch(err => console.error(err));

    // Fetch all reporters (sorted by rating from backend)
    api.get("/reporters/top")
      .then(res => setReporters(res.data))
      .catch(err => console.error(err));
  }, []);

  // 🔥 Divide reporters into categories
  const topRated = reporters.filter(r => r.averageRating >= 3);
  const newReporters = reporters.filter(r => r.totalRatings === 0);
  const others = reporters.filter(
    r => r.averageRating < 3 && r.totalRatings > 0
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Homepage</h1>

      {/* ================= Articles ================= */}
      <h2>Approved Articles</h2>
      {articles.map(article => (
        <div
          key={article.id}
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px"
          }}
        >
          <h3>{article.title}</h3>
          <p>{article.content}</p>
        </div>
      ))}

      {/* ================= Top Rated ================= */}
      <h2>⭐ Top Rated Reporters</h2>
      {topRated.length === 0 && <p>No top rated reporters yet.</p>}
      {topRated.map(r => (
        <div key={r.id}>
          <Link to={`/reporter/${r.id}`}>
            {r.name}
          </Link>{" "}
          — {r.averageRating} ⭐
        </div>
      ))}

      {/* ================= New ================= */}
      <h2>🌱 New Reporters</h2>
      {newReporters.length === 0 && <p>No new reporters.</p>}
      {newReporters.map(r => (
        <div key={r.id}>
          <Link to={`/reporter/${r.id}`}>
            {r.name}
          </Link>{" "}
          — No ratings yet
        </div>
      ))}

      {/* ================= Others ================= */}
      <h2>📉 Other Reporters</h2>
      {others.length === 0 && <p>No other reporters.</p>}
      {others.map(r => (
        <div key={r.id}>
          <Link to={`/reporter/${r.id}`}>
            {r.name}
          </Link>{" "}
          — {r.averageRating} ⭐
        </div>
      ))}
    </div>
  );
}

export default Home;