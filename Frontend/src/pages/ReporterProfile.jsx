import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Bookmark, Share2, Eye } from "lucide-react";

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

    const handleLike = async (e, articleId) => {
  e.preventDefault();

  try {
    await api.post(`/articles/${articleId}/like`);

    // reload reporter data from backend
    const res = await api.get(`/reporters/${id}`);
    setReporter(res.data);

  } catch (err) {
    console.error(err);
  }
};


const handleShare = (e, articleId, title) => {

  e.preventDefault();

  const url = `${window.location.origin}/article/${articleId}`;

  if (navigator.share) {

    navigator.share({
      title: title,
      url: url
    });

  } else {

    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");

  }

};

  return (
  <div className="min-h-screen bg-gray-50">

    {/* HERO BANNER */}
    <div className="h-60 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

    <div className="max-w-6xl mx-auto px-4 -mt-24 space-y-12">

      {/* PROFILE CARD */}
      <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8">

        {/* Avatar */}
        <img
          src={
            reporter.profileImageUrl
              ? `http://localhost:8080${reporter.profileImageUrl}`
              : "https://i.pravatar.cc/200"
          }
          alt="Reporter"
          className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
        />

        {/* INFO */}
        <div className="flex-1 text-center md:text-left">

          <h1 className="text-3xl font-bold text-gray-900">
            {reporter.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center justify-center md:justify-start gap-3 mt-2">

            <div className="flex text-yellow-400 text-xl">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>
                  {index < Math.round(reporter.averageRating || 0) ? "★" : "☆"}
                </span>
              ))}
            </div>

            <span className="text-gray-500 text-sm">
              {reporter.averageRating?.toFixed(1) || 0} ({reporter.totalRatings || 0} ratings)
            </span>

          </div>

          <p className="text-gray-600 mt-4 max-w-xl">
            Independent journalist delivering accurate and impactful stories.
            Passionate about technology, health and global affairs.
          </p>

          {/* RATE BUTTONS */}
          <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
            {[1,2,3,4,5].map(num => (
              <button
                key={num}
                onClick={() => handleRating(num)}
                className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-medium transition shadow"
              >
                {num} ⭐
              </button>
            ))}
          </div>

          {message && (
            <p className="mt-3 text-green-600 text-sm">{message}</p>
          )}

        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl p-6 shadow text-center">
          <p className="text-gray-500 text-sm">Articles</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {reporter.approvedArticles?.length || 0}
          </h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow text-center">
          <p className="text-gray-500 text-sm">Rating</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {reporter.averageRating?.toFixed(1) || 0}
          </h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow text-center">
          <p className="text-gray-500 text-sm">Total Reviews</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {reporter.totalRatings || 0}
          </h3>
        </div>

      </div>

      {/* ARTICLES */}
      <div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Published Articles
        </h2>

        {reporter.approvedArticles?.length === 0 ? (
          <p className="text-gray-500">No published articles yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {reporter.approvedArticles?.map(article => (
              <Link
  to={`/article/${article.id}`}
  key={article.id}
  className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition block"
>

                {/* IMAGE */}
                {article.imageUrl && (
                  <img
                    src={`http://localhost:8080${article.imageUrl}`}
                    alt="Article"
                    className="w-full h-44 object-cover"
                  />
                )}

                {/* VIDEO */}
                {article.videoUrl && (
                  <iframe
                    className="w-full"
                    height="200"
                    src={article.videoUrl.replace("watch?v=", "embed/")}
                    allowFullScreen
                  />
                )}

                <div className="p-5">

                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-gray-500 mb-3">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </p>

                  <p className="text-gray-600 text-sm line-clamp-3">
  {article.content}
</p>

{/* ARTICLE ENGAGEMENT */}
<div className="flex items-center justify-between mt-4 pt-4 border-t text-gray-500">

  <div className="flex items-center gap-4">

   <button
  onClick={(e)=>handleLike(e, article.id)}
  className="flex items-center gap-1 hover:text-red-500"
>
      <Heart size={18}/>
      <span className="text-sm">{article.likes || 0}</span>
    </button>

   <button
  onClick={(e) => {
    e.preventDefault();
    window.location.href = `/article/${article.id}#comments`;
  }}
  className="flex items-center gap-1 hover:text-blue-500"
>
  <MessageCircle size={18}/>
  <span className="text-sm">{article.commentsCount || 0}</span>
</button>

    <div className="flex items-center gap-1">
      <Eye size={18}/>
      <span className="text-sm">{article.views || 0}</span>
    </div>

  </div>

  <div className="flex items-center gap-3">

    <button
  onClick={async (e) => {

    e.preventDefault();

    try {

      const res = await api.post(`/articles/${article.id}/save`);

      alert(res.data);

    } catch (err) {
      console.error(err);
    }

  }}
  className="hover:text-yellow-500"
>
  <Bookmark size={18}/>
</button>
    <button
  onClick={(e)=>handleShare(e, article.id, article.title)}
  className="hover:text-green-500"
>
  <Share2 size={18}/>
</button>

  </div>

</div>

                </div>

              </Link>
            ))}

          </div>
        )}

      </div>

    </div>
  </div>
);
}

export default ReporterProfile;