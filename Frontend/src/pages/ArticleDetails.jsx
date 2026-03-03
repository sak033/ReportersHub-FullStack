import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ArticleDetails() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/articles/${id}`)
      .then(res => setArticle(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!article) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6">{article.title}</h1>

      <p className="text-gray-500 mb-6">
        {new Date(article.createdAt).toLocaleDateString()}
      </p>

      {article.imageUrl && (
        <img
          src={`http://localhost:8080${article.imageUrl}`}
          alt="Article"
          className="rounded-xl mb-8"
        />
      )}

      <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
        {article.content}
      </p>
    </div>
  );
}