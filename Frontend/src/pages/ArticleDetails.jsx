import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRef } from "react";
import { Trash2 } from "lucide-react";

export default function ArticleDetails() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState("");
const [expanded, setExpanded] = useState(false);
const commentInputRef = useRef(null);
const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  


useEffect(() => {

  const loadArticle = async () => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id || "guest";

      const viewedKey = `viewed_article_${id}_user_${userId}`;

      const alreadyViewed = sessionStorage.getItem(viewedKey);

      if (!alreadyViewed) {
        await axios.post(`http://localhost:8080/articles/${id}/view`);
        sessionStorage.setItem(viewedKey, "true");
      }

      const res = await axios.get(`http://localhost:8080/articles/${id}`);
      setArticle(res.data);

      const commentsRes = await axios.get(`http://localhost:8080/comments/${id}`);
setComments(commentsRes.data);

if (window.location.hash === "#comments") {

  setTimeout(() => {
    commentInputRef.current?.focus();
  }, 300);

}

    } catch (err) {
      console.error(err);
    }
  };

  loadArticle();

}, [id]);

const handleComment = async () => {

  if (!newComment.trim()) return;

  try {

    await axios.post(
      `http://localhost:8080/comments/${id}`,
      newComment,
      {
        headers: {
          "Content-Type": "text/plain",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setNewComment("");

    const res = await axios.get(`http://localhost:8080/comments/${id}`);
    setComments(res.data);

  } catch (err) {
    console.error(err);
  }
};

const handleDeleteComment = async (commentId) => {

  try {

    await axios.delete(
      `http://localhost:8080/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    // reload comments
    const res = await axios.get(`http://localhost:8080/comments/${id}`);
    setComments(res.data);

  } catch (err) {
    console.error(err);
  }

};

  if (!article) return <div className="p-10">Loading...</div>;

  return (
  <div className="min-h-screen bg-gray-50">

    {/* HERO SECTION */}
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 px-4">

      <div className="max-w-4xl mx-auto text-white">

        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
        >
          ← Back
        </button>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          {article.title}
        </h1>

       

        <p className="text-white mb-6">
  {new Date(article.createdAt).toLocaleDateString()} • {article.views} views
</p>

      </div>

    </div>


    {/* ARTICLE BODY */}
    <div className="max-w-4xl mx-auto px-4 -mt-10">

      <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-10">

        {/* IMAGE */}
        {article.imageUrl && (
          <img
            src={`http://localhost:8080${article.imageUrl}`}
            alt="Article"
            className="rounded-xl w-full mb-8 object-cover"
          />
        )}

        {/* CONTENT */}
        <div className="text-lg leading-relaxed text-gray-800">

  <p className={expanded ? "" : "line-clamp-4"}>
    {article.content}
  </p>

  {article.content.length > 200 && (
    <button
      onClick={() => setExpanded(!expanded)}
      className="text-blue-600 mt-2 hover:underline"
    >
      {expanded ? "Show Less" : "Read More"}
    </button>
  )}

</div>
        {/* COMMENTS SECTION */}
<div id="comments" className="mt-12">

  <h2 className="text-2xl font-semibold mb-6">
  Comments ({comments.length})
  </h2>

  {/* Comment Input */}
 <div className="flex items-start gap-3 mb-8 w-full">
  {/* Logged in user profile image */}
  <img
    src={
      user?.profileImageUrl
        ? `http://localhost:8080${user.profileImageUrl}`
        : "https://i.pravatar.cc/100"
    }
    alt="profile"
    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
  />

  <div className="flex-1 flex flex-col sm:flex-row gap-2">
    <input
      ref={commentInputRef}
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      placeholder="Write a thoughtful comment..."
      className="w-full border border-gray-300 rounded-full px-5 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />

    <button
      onClick={handleComment}
      disabled={!newComment.trim()}
      className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
    >
      Post
    </button>

  </div>

</div>
  {/* Comment List */}
  <div className="space-y-6">

   {comments.map(c => (

  <div
    key={c.id}
    className="flex gap-4 bg-gray-50 p-4 rounded-xl"
  >

    {/* USER PROFILE IMAGE */}
    <img
      src={
        c.user?.profileImageUrl
          ? `http://localhost:8080${c.user.profileImageUrl}`
          : "https://i.pravatar.cc/100"
      }
      alt="profile"
      className="w-10 h-10 rounded-full object-cover"
    />

    <div className="flex-1">

     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">

        <div>
          <p className="font-semibold text-gray-800">
            {c.user?.name}
          </p>

          <p className="text-xs text-gray-500">
            {new Date(c.createdAt).toLocaleString()}
          </p>
        </div>

        {/* DELETE BUTTON */}
        {user && user.id === c.user?.id && (
          <button
  onClick={() => handleDeleteComment(c.id)}
  className="text-gray-400 hover:text-red-500 transition"
  title="Delete comment"
>
  <Trash2 size={16} />
</button>
        )}

      </div>

      <p className="text-gray-700 mt-2 break-words">
        {c.content}
      </p>

    </div>

  </div>

))}
  </div>

</div>

      </div>

    </div>

  </div>
);
}