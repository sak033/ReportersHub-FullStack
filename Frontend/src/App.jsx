import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import ReporterProfile from "./pages/ReporterProfile";
import Login from "./pages/Login";
import ReporterDashboard from "./pages/ReporterDashboard";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import { Navigate } from "react-router-dom";  
import Register from "./pages/Register";

function App() {
  return (
    <>
  <Navbar />
  <Routes>
  <Route path="/" element={<Home/>}/>
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