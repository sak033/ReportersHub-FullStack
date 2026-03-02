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
      .then(res => setMessage(res.data))
      .catch(() => setMessage("You must be logged in to rate."));
  };

  if (!reporter)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-8">

          {/* Avatar */}
          <img
            src="https://i.pravatar.cc/200"
            alt="Reporter"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
          />

          {/* Info */}
          <div className="flex-1 text-center md:text-left">

            <h1 className="text-3xl font-bold text-gray-800">
              {reporter.name}
            </h1>

            {/* Rating Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mt-3">

              {/* Stars */}
              <div className="flex text-yellow-400 text-xl">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index}>
                    {index < Math.round(reporter.averageRating || 0) ? "★" : "☆"}
                  </span>
                ))}
              </div>

              <span className="text-gray-500 text-sm">
                {reporter.averageRating?.toFixed(1) || 0} 
                {" "}({reporter.totalRatings || 0} ratings)
              </span>
            </div>

            {/* About */}
            <p className="text-gray-600 mt-4 max-w-2xl">
              Independent journalist delivering accurate and impactful stories.
              Passionate about technology, health and global affairs.
            </p>

            {/* Rate Buttons */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
              {[1,2,3,4,5].map(num => (
                <button
                  key={num}
                  onClick={() => handleRating(num)}
                  className="px-4 py-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 transition"
                >
                  {num} ⭐
                </button>
              ))}
            </div>

            {message && (
              <p className="mt-3 text-green-600 text-sm">
                {message}
              </p>
            )}

          </div>
        </div>

        {/* ARTICLES SECTION */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Published Articles
            </h2>
          </div>

          {reporter.approvedArticles?.length === 0 ? (
            <p className="text-gray-500">No published articles yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reporter.approvedArticles?.map(article => (
  <div
    key={article.id}
    className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5"
  >

    {/* IMAGE */}
    {article.imageUrl && (
      <img
        src={`http://localhost:8080${article.imageUrl}`}
        alt="Article"
        className="rounded-lg mb-3 w-full h-40 object-cover"
      />
    )}

    {/* VIDEO */}
    {article.videoUrl && (
      <iframe
        className="w-full mb-3 rounded-lg"
        height="200"
        src={article.videoUrl.replace("watch?v=", "embed/")}
        allowFullScreen
      />
    )}

    <h3 className="font-semibold text-gray-800 mb-2">
      {article.title}
    </h3>

    <p className="text-sm text-gray-500 mb-3">
      {new Date(article.createdAt).toLocaleDateString()}
    </p>

    <p className="text-gray-600 text-sm line-clamp-3">
      {article.content}
    </p>

  </div>
))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ReporterProfile;