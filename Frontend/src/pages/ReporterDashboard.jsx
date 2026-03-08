import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Eye } from "lucide-react";

export default function ReporterDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState(null);
const [videoUrl, setVideoUrl] = useState("");
const [rank, setRank] = useState(null);
const [showEditModal, setShowEditModal] = useState(false);
const [editName, setEditName] = useState("");
const [editAbout, setEditAbout] = useState("");
const [editImage, setEditImage] = useState(null);
const [openMenuId, setOpenMenuId] = useState(null);
const [tab, setTab] = useState("created");
const [savedArticles, setSavedArticles] = useState([]);

const navigate =useNavigate();

  const token = localStorage.getItem("token");

  
  useEffect(() => {
  // Fetch dashboard data
  axios
    .get("http://localhost:8080/reporters/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setData(res.data);
      setLoading(false);
      setEditName(res.data.name);
      setEditAbout(res.data.about || "");
      axios
  .get("http://localhost:8080/articles/saved-articles", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => setSavedArticles(res.data))
  .catch(err => console.error(err));

      // AFTER getting dashboard data, fetch ranking
      return axios.get("http://localhost:8080/reporters/top");
    })
    .then(res => {
      const reporters = res.data;

      // Find current reporter position
      const index = reporters.findIndex(
  r => r.id === res.data.id
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


    const handleSaveProfile = async () => {
  try {
    const formData = new FormData();
    formData.append("name", editName);
    formData.append("about", editAbout);
    if (editImage) formData.append("image", editImage);

    await axios.put(
      "http://localhost:8080/users/update-profile",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setShowEditModal(false);
    window.location.reload();

  } catch (err) {
    console.error(err);
  }
};

const handleDelete = async (articleId) => {
  try {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this article?"
    );

    if (!confirmDelete) return;


    console.log("TOKEN:", token);
    await axios.delete(
      `http://localhost:8080/articles/${articleId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // ✅ Remove deleted article from UI immediately
    setData(prev => ({
      ...prev,
      myArticles: prev.myArticles.filter(a => a.id !== articleId)
    }));

    setOpenMenuId(null);

  } catch (err) {
    console.error(err);
  }
};

  return (
    
    <div className="min-h-screen bg-gray-50 py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-16">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
  <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 h-full">
  
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
      <p className={`mt-4 text-sm sm:text-base leading-relaxed min-h-[80px] ${
  data.about ? "text-gray-600" : "text-gray-400 italic"
}`}>
  {data.about || "Add a short bio to tell people about yourself."}
</p>

      {/* Edit Button */}
     <button
  onClick={() => setShowEditModal(true)}
  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
>
  Edit Profile
</button>
    </div>
  </div>
</div>
        
<div className="bg-blue-900 rounded-xl p-6 sm:p-8 h-full">
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
<div className="flex gap-8 border-b mb-6">

<button
onClick={() => setTab("created")}
className={`pb-2 font-semibold ${
tab === "created"
? "border-b-2 border-blue-600 text-blue-600"
: "text-gray-400"
}`}
>
Created
</button>

<button
onClick={() => setTab("saved")}
className={`pb-2 font-semibold ${
tab === "saved"
? "border-b-2 border-blue-600 text-blue-600"
: "text-gray-400"
}`}
>
Saved
</button>

</div>


          <div className="flex items-center justify-between mb-10">
  

  <span className="text-sm text-gray-500">
    {data.myArticles.length} Articles
  </span>
</div>
{tab === "created" ? (

data.myArticles.length === 0 ? (
  <p className="text-gray-500">You haven't written any articles yet.</p>
) : (

<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
{data.myArticles.map(article => (
<div
key={article.id}
onClick={() => navigate(`/article/${article.id}`)}
className="relative group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
>

{/* IMAGE */}
<div className="relative h-48 bg-gray-100 overflow-hidden">
{article.imageUrl ? (
<img
src={`http://localhost:8080${article.imageUrl}`}
alt="Article"
className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
/>
) : (
<div className="flex items-center justify-center h-full text-gray-400 text-sm">
No Image
</div>
)}

{/* STATUS BADGE */}
<span
className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow ${
article.status === "APPROVED"
? "bg-green-500 text-white"
: article.status === "PENDING"
? "bg-yellow-500 text-white"
: "bg-red-500 text-white"
}`}
>
{article.status}
</span>

{/* 3 DOT MENU BUTTON */}
<button
onClick={(e) => {
e.stopPropagation();
setOpenMenuId(openMenuId === article.id ? null : article.id);
}}
className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full shadow hover:bg-white"
>
⋮
</button>

{/* DROPDOWN MENU */}
{openMenuId === article.id && (
<div
onClick={(e) => e.stopPropagation()}
className="absolute top-12 right-3 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20"
>
<button
onClick={() => navigate(`/edit-article/${article.id}`)}
className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
>
Edit
</button>

<button
onClick={() => handleDelete(article.id)}
className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
>
Delete
</button>
</div>
)}

</div>

{/* CONTENT */}
<div className="p-6">
<h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
{article.title}
</h3>

<p className="text-sm text-gray-500 mt-2">
{new Date(article.createdAt).toLocaleDateString()}
</p>

<p className="text-gray-600 text-sm mt-4 line-clamp-3">
{article.content}
</p>
<div className="flex items-center gap-5 mt-4 pt-3 border-t text-gray-500 text-sm">

  <div className="flex items-center gap-1">
    <Heart size={16}/>
    <span>{article.likes || 0}</span>
  </div>

  <div className="flex items-center gap-1">
    <MessageCircle size={16}/>
    <span>{article.commentsCount || 0}</span>
  </div>

  <div className="flex items-center gap-1">
    <Eye size={16}/>
    <span>{article.views || 0}</span>
  </div>

</div>
</div>

</div>
))}
</div>

)

) : (

savedArticles.length === 0 ? (
<p className="text-gray-500">No saved articles yet.</p>
) : (

<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
{savedArticles.map(article => (
<div
key={article.id}
onClick={() => navigate(`/article/${article.id}`)}
className="relative group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
>

<div className="relative h-48 bg-gray-100 overflow-hidden">
{article.imageUrl && (
<img
src={`http://localhost:8080${article.imageUrl}`}
className="w-full h-full object-cover"
/>
)}
</div>

<div className="p-6">
<h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
{article.title}
</h3>

<p className="text-sm text-gray-500 mt-2">
{new Date(article.createdAt).toLocaleDateString()}
</p>
</div>

</div>
))}
</div>

)

)}
        </div>

      </div>



      {showEditModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-5 shadow-xl">

      <h2 className="text-xl font-semibold">Edit Profile</h2>

      {/* Profile Image */}
      <div className="text-center">
  <p className="text-sm font-medium mb-3">Profile Image</p>

  <label className="cursor-pointer block">
    <img
      src={
        editImage
          ? URL.createObjectURL(editImage)
          : data.profileImageUrl
          ? `http://localhost:8080${data.profileImageUrl}`
          : "https://i.pravatar.cc/150"
      }
      alt="Edit Profile"
      className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-blue-100 hover:opacity-80 transition"
    />

    {/* Hidden File Input */}
    <input
      type="file"
      hidden
      accept="image/*"
      onChange={(e) => setEditImage(e.target.files[0])}
    />
  </label>

  <p className="text-xs text-gray-500 mt-2">
    Click image to change
  </p>
</div>

      {/* Name */}
      <div>
        <label className="text-sm font-medium">Name</label>
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="mt-2 w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* About */}
      <div>
        <label className="text-sm font-medium">About</label>
        <textarea
          value={editAbout}
          onChange={(e) => setEditAbout(e.target.value)}
          className="mt-2 w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div className="flex justify-end gap-3 pt-3">
        <button
          onClick={() => setShowEditModal(false)}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleSaveProfile}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Save Changes
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
}