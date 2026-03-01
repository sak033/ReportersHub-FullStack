import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

function ReporterProfile() {
  const { id } = useParams();
  const [reporter, setReporter] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/reporters/${id}`)
      .then(res => setReporter(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleRating = (value) => {
    api.post(`/reporters/${id}/rate?value=${value}`)
      .then(res => {
        setMessage(res.data);
      })
      .catch(err => {
        console.error(err);
        setMessage("You must be logged in to rate.");
      });
  };

  if (!reporter) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{reporter.name}</h1>

      <h3>Rate this Reporter:</h3>
      <div style={{ marginBottom: "10px" }}>
        {[1,2,3,4,5].map(num => (
          <button
            key={num}
            onClick={() => handleRating(num)}
            style={{ marginRight: "5px" }}
          >
            {num} ⭐
          </button>
        ))}
      </div>

      {message && <p style={{ color: "green" }}>{message}</p>}

      <h2>Approved Articles</h2>
      {reporter.approvedArticles && reporter.approvedArticles.map(article => (
        <div
          key={article.id}
          style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}
        >
          <h3>{article.title}</h3>
          <p>{article.createdAt}</p>
        </div>
      ))}
    </div>
  );
}

export default ReporterProfile;