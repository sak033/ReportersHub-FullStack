import { useEffect, useState } from "react";
import api from "../api";
import { Heart, MessageCircle, Eye } from "lucide-react";
import { Link } from "react-router-dom";

function Feed() {

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.get("/articles/public")
      .then(res => setArticles(res.data))
      .catch(err => console.error(err));
  }, []);

  return (

    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">

      {articles.map(article => (

        <div
          key={article.id}
          className="h-screen snap-start relative"
        >

          {/* IMAGE */}
          {article.imageUrl && (
            <img
              src={`http://localhost:8080${article.imageUrl}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

          {/* TEXT CONTENT */}
          <div className="
            absolute 
            bottom-20 left-4 right-4
            sm:left-8 sm:right-auto
            max-w-full sm:max-w-lg md:max-w-xl
            text-white z-10
          ">

            <h1 className="
              text-xl 
              sm:text-2xl 
              md:text-3xl 
              lg:text-4xl 
              font-bold mb-3
            ">
              {article.title}
            </h1>

            <p className="
              text-gray-200 
              text-sm sm:text-base 
              mb-4 line-clamp-3
            ">
              {article.content}
            </p>

            <p className="text-xs sm:text-sm mb-4">
              ⭐ {article.reporterName}
            </p>

            <Link
              to={`/article/${article.id}`}
              className="
                inline-block
                bg-white text-black
                px-4 py-2
                text-sm sm:text-base
                rounded font-semibold
                hover:bg-gray-200
              "
            >
              Read Full Article
            </Link>

          </div>

          {/* RIGHT SIDE ICONS */}

          <div className="
            absolute
            right-3
            bottom-24
            sm:right-6
            flex flex-col
            gap-5
            text-white
            text-center
            z-10
          ">

            <div className="flex flex-col items-center">
              <Heart size={22} className="sm:w-7 sm:h-7"/>
              <p className="text-xs sm:text-sm">{article.likes || 0}</p>
            </div>

            <div className="flex flex-col items-center">
              <MessageCircle size={22} className="sm:w-7 sm:h-7"/>
              <p className="text-xs sm:text-sm">{article.commentsCount || 0}</p>
            </div>

            <div className="flex flex-col items-center">
              <Eye size={22} className="sm:w-7 sm:h-7"/>
              <p className="text-xs sm:text-sm">{article.views || 0}</p>
            </div>

          </div>

        </div>

      ))}

    </div>

  );

}

export default Feed;