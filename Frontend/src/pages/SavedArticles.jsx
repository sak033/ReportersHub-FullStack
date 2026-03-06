import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

function SavedArticles() {

  const [articles, setArticles] = useState([]);

  useEffect(() => {

    api.get("/articles/saved-articles")
      .then(res => setArticles(res.data))
      .catch(err => console.error(err));

  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h1 className="text-3xl font-bold mb-8">
        Saved Articles
      </h1>

      {articles.length === 0 ? (

        <p className="text-gray-500">
          You haven't saved any articles yet.
        </p>

      ) : (

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {articles.map(article => (

            <Link
              key={article.id}
              to={`/article/${article.id}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >

              {article.imageUrl && (
                <img
                  src={`http://localhost:8080${article.imageUrl}`}
                  alt="Article"
                  className="w-full h-40 object-cover"
                />
              )}

              <div className="p-4">

                <h3 className="font-semibold text-gray-800 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-xs text-gray-500 mt-2">
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>

              </div>

            </Link>

          ))}

        </div>

      )}

    </div>
  );
}

export default SavedArticles;