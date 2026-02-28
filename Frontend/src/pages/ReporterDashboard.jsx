import { useEffect, useState } from "react";
import axios from "axios";

export default function ReporterDashboard() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");


  const handleCreateArticle = () => {
  const token = localStorage.getItem("token");

  axios.post(
    "http://localhost:8080/articles",
    {
      title,
      content
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  .then(() => {
    alert("Article submitted for approval!");
    setTitle("");
    setContent("");
    window.location.reload(); // quick refresh
  })
  .catch(err => console.error(err));
};
  useEffect(() => {

    const token = localStorage.getItem("token");

    axios.get("http://localhost:8080/reporters/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
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

  if (loading) return <p>Loading...</p>;

  if (!data) return <p>Unauthorized or no data.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
  <div className="bg-white p-6 rounded-2xl shadow-md">
    <h4 className="text-gray-500">Average Rating</h4>
    <p className="text-3xl font-bold text-blue-600">
      {data.averageRating}
    </p>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow-md">
    <h4 className="text-gray-500">Total Ratings</h4>
    <p className="text-3xl font-bold">
      {data.totalRatings}
    </p>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow-md">
    <h4 className="text-gray-500">Total Articles</h4>
    <p className="text-3xl font-bold">
      {data.myArticles.length}
    </p>
  </div>
</div>
    </div>
  );
}