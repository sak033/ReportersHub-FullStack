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
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center sm:text-left">
        Admin Dashboard
      </h2>

      {/* Reporter Requests */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-8 mb-10">
        <h3 className="text-lg sm:text-xl font-semibold mb-6">
          Reporter Requests
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm sm:text-base">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-3">Name</th>
                <th>Email</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reporterRequests.map(user => (
                <tr key={user.id} className="border-b">
                  <td className="py-4">{user.name}</td>
                  <td className="break-all">{user.email}</td>
                  <td className="py-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                      <button
                        onClick={() => approveReporter(user.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-full transition"
                      >
                        Approve
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full transition">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Articles */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-8">
        <h3 className="text-lg sm:text-xl font-semibold mb-6">
          Pending Articles
        </h3>

        {pendingArticles.length === 0 ? (
          <p className="text-gray-500 text-sm sm:text-base">
            No pending articles.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-3">Title</th>
                  <th>Content</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingArticles.map(article => (
                  <tr key={article.id} className="border-b">
                    <td className="py-4 font-semibold">
                      {article.title}
                    </td>
                    <td className="max-w-xs truncate">
                      {article.content}
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                        <button
                          onClick={() => approveArticle(article.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-full transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectArticle(article.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full transition"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  </div>
);}

export default AdminDashboard;