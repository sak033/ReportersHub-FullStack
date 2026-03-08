import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import ReporterProfile from "./pages/ReporterProfile";
import Login from "./pages/Login";
import ReporterDashboard from "./pages/ReporterDashboard";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import { Navigate } from "react-router-dom";  
import Register from "./pages/Register";
import CreateArticle from "./pages/CreateArticle"; 
import ArticleDetails from "./pages/ArticleDetails";
import EditArticle from "./pages/EditArticle.jsx"; 
import SavedArticles from "./pages/SavedArticles";
import Explore from "./pages/Explore";
import Feed from "./pages/Feed";


function App() {
  return (
    <>
  <Navbar />
  <Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/create-article" element={<CreateArticle />} />  
  <Route path="/reporter/:id" element={<ReporterProfile/>}/>
  <Route path="/login" element={<Login/>}/>
  <Route path="/register" element={<Register/>}/>
  <Route path="/dashboard" element={<ReporterDashboard />} />
  
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/article/:id" element={<ArticleDetails />} />
<Route path="/edit-article/:id" element={<EditArticle />} />
<Route path="/saved" element={<SavedArticles />} />
<Route path="/explore" element={<Explore />} />
<Route path="/feed" element={<Feed />} />
  </Routes>
  </>
  )
}

export default App;