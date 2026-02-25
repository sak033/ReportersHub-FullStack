import { useEffect, useState } from "react";
import axios from "axios";

export default function ReporterDashboard() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("token");

    axios.get("http://localhost:8080/reporters/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setData(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });

  }, []);

  if (loading) return <p>Loading...</p>;

  if (!data) return <p>Unauthorized or no data.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Reporter Dashboard</h1>

      <h2>Welcome, {data.name}</h2>

      <p>⭐ Average Rating: {data.averageRating}</p>
      <p>📊 Total Ratings: {data.totalRatings}</p>

      <h3>My Articles</h3>

      {data.myArticles.length === 0 ? (
        <p>No articles yet.</p>
      ) : (
        <ul>
          {data.myArticles.map(article => (
            <li key={article.id}>
              <strong>{article.title}</strong>
              <br />
              Status: {article.status}
              <br />
              Created: {new Date(article.createdAt).toLocaleString()}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}