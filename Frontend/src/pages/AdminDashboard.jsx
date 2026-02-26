import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

  const [pendingArticles, setPendingArticles] = useState([]);
  const [reporterRequests, setReporterRequests] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPendingArticles();
    fetchReporterRequests();
  }, []);

  const fetchPendingArticles = () => {
    axios.get("http://localhost:8080/articles/pending", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPendingArticles(res.data))
    .catch(err => console.error(err));
  };

  const fetchReporterRequests = () => {
    axios.get("http://localhost:8080/users/reporter-requests", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setReporterRequests(res.data))
    .catch(err => console.error(err));
  };

  const approveArticle = (id) => {
    axios.put(`http://localhost:8080/articles/approve/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => fetchPendingArticles());
  };

  const rejectArticle = (id) => {
    axios.put(`http://localhost:8080/articles/reject/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => fetchPendingArticles());
  };

  const approveReporter = (id) => {
    axios.put(`http://localhost:8080/users/approve-reporter/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => fetchReporterRequests());
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <h3>Pending Articles</h3>
      {pendingArticles.map(article => (
        <div key={article.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <h4>{article.title}</h4>
          <p>{article.content}</p>

          <button onClick={() => approveArticle(article.id)}>Approve</button>
          <button onClick={() => rejectArticle(article.id)}>Reject</button>
        </div>
      ))}

      <h3>Reporter Requests</h3>
      {reporterRequests.map(user => (
        <div key={user.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <p>{user.name} ({user.email})</p>
          <button onClick={() => approveReporter(user.id)}>Approve Reporter</button>
        </div>
      ))}

    </div>
  );
}

export default AdminDashboard;