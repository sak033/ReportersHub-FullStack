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
      <div className="max-w-6xl mx-auto px-6 py-16">
  <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>

  <div className="bg-white rounded-2xl shadow-md p-8 mb-12">
    <h3 className="text-xl font-semibold mb-6">Reporter Requests</h3>

    <table className="w-full text-left">
      <thead>
        <tr className="border-b text-gray-500">
          <th className="py-3">Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {reporterRequests.map(user => (
          <tr key={user.id} className="border-b">
            <td className="py-4">{user.name}</td>
            <td>{user.email}</td>
            <td className="flex mt-3 gap-3">
              <button
                onClick={() => approveReporter(user.id)}
                className="bg-green-500 text-white px-3 py-1 rounded-full"
              >
                Approve
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded-full">
                Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
}

export default AdminDashboard;