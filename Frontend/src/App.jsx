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
  </Routes>
  </>
  )
}

export default App;