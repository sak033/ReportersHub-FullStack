import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !content) return;

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);
      if (videoUrl) formData.append("videoUrl", videoUrl);

      console.log("Token:", token);
      await axios.post(
        "http://localhost:8080/articles",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Create New Article
        </h2>

        <input
          type="text"
          placeholder="Article Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <textarea
          placeholder="Write your article content..."
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border border-gray-300 rounded-lg px-4 py-3"
        />

        <input
          type="text"
          placeholder="YouTube Video URL (optional)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3"
        />

        <div className="flex justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg border border-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Article"}
          </button>
        </div>
      </div>
    </div>
  );
}