import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ReporterDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState(null);
const [videoUrl, setVideoUrl] = useState("");
const [rank, setRank] = useState(null);

const navigate =useNavigate();

  const token = localStorage.getItem("token");

  const handleProfileImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  await axios.post(
    "http://localhost:8080/users/profile-image",
    formData,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  window.location.reload(); // simple refresh
};

  useEffect(() => {
  // Fetch dashboard data
  axios
    .get("http://localhost:8080/reporters/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setData(res.data);
      setLoading(false);

      // AFTER getting dashboard data, fetch ranking
      return axios.get("http://localhost:8080/reporters/top");
    })
    .then(res => {
      const reporters = res.data;

      // Find current reporter position
      const index = reporters.findIndex(
        r => r.id === data?.id || r.name === data?.name
      );

      if (index !== -1) {
        setRank(index + 1);
      }
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
    
    <div className="min-h-screen bg-gray-50 py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-16">
<div className="flex flex-col lg:flex-row gap-10">
  <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 max-w-3xl mx-auto">
  
  <div className=" sm:flex-row items-center sm:items-start gap-6">

    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
<div>
    {/* Profile Image */}
    <img
  src={
    data.profileImageUrl
      ? `http://localhost:8080${data.profileImageUrl}`
      : "https://i.pravatar.cc/150"
  }
  alt="Profile"
  className="w-28 h-28 rounded-full object-cover border-4 border-blue-100"
/>
<input
  type="file"
  onChange={handleProfileImageUpload}
/>
  </div>

    <div className="mt-3">
      {/* Name */}
      <h2 className="text-2xl font-bold text-gray-800">
        {data.name}
      </h2>

      {/* Rating */}
     <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
  
  {/* Dynamic Stars */}
  <div className="flex text-yellow-400 text-lg">
    {Array.from({ length: 5 }).map((_, index) => (
      <span key={index}>
        {index < Math.round(data.averageRating || 0) ? "★" : "☆"}
      </span>
    ))}
  </div>

  {/* Dynamic Rating Numbers */}
  <span className="text-gray-500 text-sm">
    ({data.averageRating?.toFixed(1) || 0} • {data.totalRatings || 0} reviews)
  </span>

</div>
      {rank && (
  <p className="text-sm text-blue-600 mt-2 font-medium">
    Rank #{rank} Top Reporter
  </p>
)}
    </div>

    </div>


    {/* Info Section */}
    <div className="flex-1 text-center sm:text-left mt-6 sm:mt-0">

     {/* About */}
      <p className="text-gray-600 mt-4  text-sm sm:text-base leading-relaxed">
        Passionate reporter covering technology, health, and global news.
        Dedicated to delivering accurate and impactful journalism.
      </p>

      {/* Edit Button */}
      <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
        Edit Profile
      </button>

    </div>
  </div>
</div>
        
<div className="bg-blue-900 rounded-xl p-6 sm:p-8 ">
  {/* Stats Section */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-5">

  {/* Average Rating */}
  <div className="bg-white p-4 rounded-xl shadow-sm">
    <p className="text-xs text-gray-500">Average Rating</p>
    <h2 className="text-2xl font-bold  mt-1">
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

</div>
<div className="flex flex-col mt-4 sm:flex-row gap-4">
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

<div
  onClick={() => navigate("/create-article")}
  className="bg-white border-2 border-dashed border-blue-400 p-4 rounded-xl shadow-sm cursor-pointer hover:scale-[1.03] hover:bg-blue-50 transition flex flex-col items-center justify-center"
>
  <span className="text-3xl text-blue-600 font-bold">+</span>
  <p className="text-sm mt-2 text-gray-600">Create Article</p>
</div>
</div>
</div>
</div>


        

        {/* My Articles Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            My Articles
          </h2>

          {data.myArticles.length === 0 ? (
            <p className="text-gray-500">You haven't written any articles yet.</p>
          ) : (
           <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
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