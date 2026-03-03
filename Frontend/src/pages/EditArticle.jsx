import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [article, setArticle] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/articles/${id}`)
      .then(res => {
        setArticle(res.data);
        setTitle(res.data.title);
        setContent(res.data.content);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8080/articles/${id}`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate(`/article/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
  <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Edit Article
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Make changes and resubmit for review.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">

        {/* Approved Warning */}
        {article?.status === "APPROVED" && (
          <div className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-4 py-3 rounded-lg mb-6 text-sm">
            Editing this article will require admin re-approval.
          </div>
        )}

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter article title"
          />
        </div>

        {/* Content */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-xl px-4 py-3 h-48 sm:h-56 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your article..."
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">

          {/* Cancel */}
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          {/* Update */}
          <button
            onClick={handleUpdate}
            disabled={!title || !content}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Article
          </button>

        </div>

      </div>
    </div>
  </div>
);
}