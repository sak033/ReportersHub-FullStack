import { useEffect, useState } from "react";
import axios from "axios";

export default function ReporterDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState(null);
const [videoUrl, setVideoUrl] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8080/reporters/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
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

  const handleCreateArticle = async () => {
    console.log("Submit clicked");
  if (!title || !content) return;

  try {
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);
    if (videoUrl) formData.append("videoUrl", videoUrl);


   
    const res = await axios.post(
      "http://localhost:8080/articles",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
          
        }
      }
    );

    const newArticle = res.data;

    setData(prev => ({
      ...prev,
      myArticles: [newArticle, ...prev.myArticles]
    }));

    setTitle("");
    setContent("");
    setImage(null);
    setVideoUrl("");
    setSubmitting(false);

  } catch (err) {
    console.error(err);
    setSubmitting(false);
  }
};
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Unauthorized or no data.</p>
      </div>
    );

  return (
    
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {data.name}
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your articles and track your performance.
          </p>
        </div>

        {/* Stats Section */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">

  {/* Average Rating */}
  <div className="bg-white p-4 rounded-xl shadow-sm">
    <p className="text-xs text-gray-500">Average Rating</p>
    <h2 className="text-2xl font-bold text-blue-600 mt-1">
      {data.averageRating}
    </h2>
  </div>

  {/* Total Ratings */}
  <div className="bg-white p-4 rounded-xl shadow-sm">
    <p className="text-xs text-gray-500">Total Ratings</p>
    <h2 className="text-2xl font-bold mt-1">
      {data.totalRatings}
    </h2>
  </div>

  {/* Total Articles */}
  <div className="bg-white p-4 rounded-xl shadow-sm">
    <p className="text-xs text-gray-500">Total Articles</p>
    <h2 className="text-2xl font-bold mt-1">
      {data.myArticles.length}
    </h2>
  </div>

  {/* Go Live Action Box */}
 <div
  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl shadow-sm cursor-pointer hover:scale-[1.02] transition"
>
  <p className="text-xs opacity-80">Ready to Publish?</p>

  <div className="flex items-center gap-2 mt-2">
    <h2 className="text-lg font-semibold">Go</h2>
    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
      LIVE
    </span>
    
  </div>
</div>

</div>

        {/* Create Article Section */}
        <div className="bg-white rounded-2xl shadow-md p-10 space-y-6">
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

          {/* Image Upload */}
<input
  type="file"
  accept="image/*"
  onChange={(e) => setImage(e.target.files[0])}
  className="w-full border border-gray-300 rounded-lg px-4 py-3"
/>

{/* YouTube Video URL */}
<input
  type="text"
  placeholder="YouTube Video URL (optional)"
  value={videoUrl}
  onChange={(e) => setVideoUrl(e.target.value)}
  className="w-full border border-gray-300 rounded-lg px-4 py-3"
/>

          <button
            onClick={handleCreateArticle}
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Article"}
          </button>
        </div>

        {/* My Articles Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            My Articles
          </h2>

          {data.myArticles.length === 0 ? (
            <p className="text-gray-500">You haven't written any articles yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {data.myArticles.map(article => (
                <div
                  key={article.id}
                  className="bg-white p-6 rounded-2xl shadow-md"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {article.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Created: {new Date(article.createdAt).toLocaleString()}
                  </p>

                  <div className="mt-4">
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium ${
                        article.status === "APPROVED"
                          ? "bg-green-100 text-green-600"
                          : article.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {article.status}
                    </span>
                  </div>
                  {article.imageUrl && (
  <img
    src={`http://localhost:8080${article.imageUrl}`}
    alt="Article"
    className="rounded-lg mt-4"
  />
)}

{article.videoUrl && (
  <iframe
    className="w-full mt-4 rounded-lg"
    height="250"
    src={article.videoUrl.replace("watch?v=", "embed/")}
    allowFullScreen
  />
)}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}