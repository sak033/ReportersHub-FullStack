import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import Banner from "../assets/Banner.png";  
import { Heart, MessageCircle, Bookmark, Share2, Eye, Compass, Newspaper, UserPlus } from "lucide-react";

function Home() {
  const [articles, setArticles] = useState([]);
  const [reporters, setReporters] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

  if (token) {
    api.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setCurrentUser(res.data))
    .catch(() => {});
  }
    // Fetch approved articles
    api.get("/articles/public")
      .then(res => setArticles(res.data))
      .catch(err => console.error(err));

    // Fetch all reporters (sorted by rating from backend)
    api.get("/reporters/top")
      .then(res => setReporters(res.data))
      .catch(err => console.error(err));
  }, []);

  // 🔥 Divide reporters into categories
  const topRated = reporters.filter(r => r.averageRating >= 3);
  const newReporters = reporters.filter(r => r.totalRatings === 0);
  const others = reporters.filter(
    r => r.averageRating < 3 && r.totalRatings > 0
  );

  const handleBecomeReporter = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  try {
    await api.put("/users/request-reporter", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    alert("Request sent successfully! Admin will review.");
  } catch (err) {
    alert("You may have already requested or are already a reporter.");
  }
};

const handleLike = async (e, articleId) => {
  e.preventDefault();

  try {
    await api.post(`/articles/${articleId}/like`);

    const res = await api.get("/articles/public");
    setArticles(res.data);

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
    alert("Link copied!");
  }

};

  return (
    <div >

<div className="relative w-full  -top-1 h-[400px]">
  
  {/* Background Image */}
  <img
    src={Banner}
    alt="Banner"
    className="w-full h-full object-cover"
  />

  {/* Overlay (optional but recommended) */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* Text Content */}
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
    
    <h1 className="text-5xl font-bold mb-3 tracking-wide">
      GLOBAL NEWS REPORTING
    </h1>

    <p className="text-blue-100 text-lg mb-6">
      Trusted Journalism Powered by Community Ratings
    </p>

  
<div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 flex-wrap">

  {/* EXPLORE */}
  <Link
    to="/explore"
    className="flex items-center justify-center gap-2 bg-white text-blue-800 font-semibold 
    px-5 py-2 sm:px-6 sm:py-3 
    text-sm sm:text-base 
    rounded-full shadow-md 
    hover:shadow-xl hover:-translate-y-1 transition"
  >
    <Compass size={18}/>
    Explore Articles
  </Link>

  {/* FEED */}
  <Link
    to="/feed"
    className="flex items-center justify-center gap-2 
    bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold 
    px-5 py-2 sm:px-6 sm:py-3 
    text-sm sm:text-base 
    rounded-full shadow-md 
    hover:shadow-xl hover:-translate-y-1 transition"
  >
    <Newspaper size={18}/>
    News Feed
  </Link>

  {/* REPORTER */}

  {!currentUser ? (
    <button
      onClick={() => navigate("/login")}
      className="flex items-center justify-center gap-2 
      bg-blue-600 text-white font-semibold 
      px-5 py-2 sm:px-6 sm:py-3 
      text-sm sm:text-base 
      rounded-full shadow-md 
      hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition"
    >
      <UserPlus size={18}/>
      Become Reporter
    </button>
  ) : currentUser.role === "REPORTER" ? (
    <button
      disabled
      className="bg-gray-400 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-full cursor-not-allowed text-sm sm:text-base"
    >
      You are a Reporter
    </button>
  ) : (
    <button
      onClick={handleBecomeReporter}
      className="flex items-center justify-center gap-2 
      bg-blue-600 text-white font-semibold 
      px-5 py-2 sm:px-6 sm:py-3 
      text-sm sm:text-base 
      rounded-full shadow-md 
      hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition"
    >
      <UserPlus size={18}/>
      Become Reporter
    </button>
  )}

</div>

  </div>
</div>

<div className="-mt-16 py-20">
  <div className="max-w-7xl mx-auto px-8">
    <h2 className="text-3xl font-bold mb-12">
      Top Reporters
    </h2>

    <div className="flex gap-8 overflow-x-auto pb-4">
      {reporters.map(r => (
        <Link
          key={r.id}
          to={`/reporter/${r.id}`}
          className="bg-white w-56 rounded-2xl shadow-md p-6 text-center flex-shrink-0"
        >
          <img
  src={
    r.profileImageUrl
      ? `http://localhost:8080${r.profileImageUrl}`
      : "https://i.pravatar.cc/200"
  }
  alt="Reporter"
  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-blue-100"
/>

          <h3 className="font-semibold">
            {r.name}
          </h3>

          <p className="text-yellow-500 font-medium">
            ⭐ {r.averageRating || 0}
          </p>

          <p className="text-gray-400 text-sm">
            {r.totalRatings} Ratings
          </p>
        </Link>
      ))}
    </div>
  </div>
</div>


<div className="max-w-7xl -mt-28  mx-auto px-8 py-20">
  <h2 className="text-3xl font-bold mb-12 text-gray-800">
    Trending Articles
  </h2>

  <div className="grid md:grid-cols-3 gap-10">
    {articles.map(article => (
  <Link
    to={`/article/${article.id}`}
        key={article.id}
        className="bg-white rounded-2xl shadow-md p-6 hover:-translate-y-2 hover:shadow-xl transition duration-300"
      >

        {/* IMAGE */}
  {article.imageUrl && (
    <img
      src={`http://localhost:8080${article.imageUrl}`}
      alt="Article"
      className="rounded-lg mb-4 w-full h-48 object-cover"
    />
  )}

  {/* VIDEO */}
  {article.videoUrl && (
    <iframe
      className="w-full mb-4 rounded-lg"
      height="200"
      src={article.videoUrl.replace("watch?v=", "embed/")}
      allowFullScreen
    />
  )}
        <h3 className="text-lg font-semibold mb-2">
          {article.title}
        </h3>

        <p className="text-gray-500 text-sm line-clamp-3 mb-4">
          {article.content}
        </p>

        <p className="text-sm text-gray-400 mb-3">
  By {article.reporterName || "Reporter"}
</p>

{/* ARTICLE ENGAGEMENT */}
<div className="flex items-center justify-between pt-3 border-t text-gray-500">

  <div className="flex items-center gap-4">

    <button
  onClick={(e)=>{
    e.preventDefault();
    e.stopPropagation();
    handleLike(e, article.id);
  }}
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
    e.stopPropagation();
    const res = await api.post(`/articles/${article.id}/save`);
alert(res.data);
  }}
  className="hover:text-yellow-500"
>
  <Bookmark size={18}/>
</button>

    <button
      onClick={(e)=>{
  e.preventDefault();
  e.stopPropagation();
  handleShare(e, article.id, article.title);
}}
      className="hover:text-green-500"
    >
      <Share2 size={18}/>
    </button>

  </div>

</div>
      </Link>
    ))}
  </div>
</div>
      
    </div>
  );
}

export default Home;