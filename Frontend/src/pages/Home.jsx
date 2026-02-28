import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import Banner from "../assets/Banner.png";  

function Home() {
  const [articles, setArticles] = useState([]);
  const [reporters, setReporters] = useState([]);

  useEffect(() => {
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
    
    <h1 className="text-5xl font-bold mb-6 tracking-wide">
      GLOBAL NEWS REPORTING
    </h1>

    <p className="text-blue-100 text-lg mb-10">
      Trusted Journalism Powered by Community Ratings
    </p>

    <div className="flex justify-center gap-6">
      <button className="bg-white text-blue-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
        Explore Articles
      </button>

      <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-700 transition">
        Become Reporter
      </button>
    </div>

  </div>
</div>




     <div className="max-w-7xl mx-auto px-8 py-20">
  <h2 className="text-3xl font-bold mb-12 text-gray-800">
    Trending Articles
  </h2>

  <div className="grid md:grid-cols-3 gap-10">
    {articles.map(article => (
      <div
        key={article.id}
        className="bg-white rounded-2xl shadow-md p-6 hover:-translate-y-2 hover:shadow-xl transition duration-300"
      >
        <h3 className="text-lg font-semibold mb-2">
          {article.title}
        </h3>

        <p className="text-gray-500 text-sm line-clamp-3 mb-4">
          {article.content}
        </p>

        <p className="text-sm text-gray-400">
          By {article.reporterName || "Reporter"}
        </p>
      </div>
    ))}
  </div>
</div>
      <div className="bg-[#F1F5F9] py-20">
  <div className="max-w-7xl mx-auto px-8">
    <h2 className="text-3xl font-bold mb-12">
      Top Reporters
    </h2>

    <div className="flex gap-8 overflow-x-auto pb-4">
      {reporters.map(r => (
        <div
          key={r.id}
          className="bg-white w-56 rounded-2xl shadow-md p-6 text-center flex-shrink-0"
        >
          <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4"></div>

          <h3 className="font-semibold">
            {r.name}
          </h3>

          <p className="text-yellow-500 font-medium">
            ⭐ {r.averageRating || 0}
          </p>

          <p className="text-gray-400 text-sm">
            {r.totalRatings} Ratings
          </p>
        </div>
      ))}
    </div>
  </div>
</div>
    </div>
  );
}

export default Home;