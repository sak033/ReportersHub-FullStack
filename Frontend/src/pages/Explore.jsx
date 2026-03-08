import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { Search, Flame } from "lucide-react";

function Explore() {

  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const categories = ["ALL","Politics","Tech","Sports","Crime"];

  useEffect(() => {
    loadArticles();
  }, [page, category]);

  const loadArticles = async () => {
    setLoading(true);

    try {

      const res = await api.get("/articles/public", {
        params:{
          page:page,
          category:category !== "ALL" ? category : null
        }
      });

      if(page === 0){
        setArticles(res.data);
      }else{
        setArticles(prev => [...prev,...res.data]);
      }

    } catch(err){
      console.error(err);
    }

    setLoading(false);
  };

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  // Infinite scroll
  useEffect(() => {

    const handleScroll = () => {

      if(
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ){
        setPage(prev => prev + 1);
      }

    };

    window.addEventListener("scroll",handleScroll);

    return () => window.removeEventListener("scroll",handleScroll);

  },[]);

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">

      <h1 className="text-3xl font-bold mb-8">
        Explore Articles
      </h1>

      {/* SEARCH BAR */}

      <div className="relative mb-8">

        <Search className="absolute left-3 top-3 text-gray-400"/>

        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border rounded-lg"
        />

      </div>

      {/* CATEGORY FILTER */}

      <div className="flex gap-4 mb-10 flex-wrap">

        {categories.map(c => (

          <button
            key={c}
            onClick={()=>{
              setCategory(c);
              setPage(0);
            }}
            className={`px-4 py-2 rounded-full border ${
              category === c
              ? "bg-blue-600 text-white"
              : "bg-white"
            }`}
          >
            {c}
          </button>

        ))}

      </div>

      {/* TRENDING LABEL */}

      <div className="flex items-center gap-2 mb-6 text-red-500 font-semibold">

        <Flame size={20}/>
        Trending Articles

      </div>

      {/* ARTICLE GRID */}

      <div className="grid md:grid-cols-3 gap-8">

        {filteredArticles.map(article => (

          <Link
            key={article.id}
            to={`/article/${article.id}`}
            className="bg-white rounded-xl shadow p-5 hover:shadow-xl transition"
          >

            {article.imageUrl && (
              <img
                src={`http://localhost:8080${article.imageUrl}`}
                className="w-full h-40 object-cover rounded mb-4"
              />
            )}

            <h3 className="font-semibold text-lg mb-2">
              {article.title}
            </h3>

            <p className="text-gray-500 text-sm line-clamp-3 mb-3">
              {article.content}
            </p>

            {/* REPORTER */}

            <div className="flex items-center justify-between text-sm">

              <span className="flex items-center gap-1 text-blue-600 font-medium">
                ⭐ {article.reporterName}
              </span>

              <span className="text-gray-400">
                ❤️ {article.likes || 0}
              </span>

            </div>

          </Link>

        ))}

      </div>

      {loading && (
        <p className="text-center mt-10 text-gray-500">
          Loading more articles...
        </p>
      )}

    </div>
  );
}

export default Explore;