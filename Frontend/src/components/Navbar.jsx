import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/Logo.png";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-blue-900 shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Row */}
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <img src={Logo} alt="logo" className="h-10 w-auto" />
            <Link to="/" className="text-xl font-bold text-white">
              ReportersHub
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-white font-medium">
            <Link to="/" className="hover:text-blue-300 transition">
              Home
            </Link>

            <Link className="hover:text-blue-300 transition">
              Live
            </Link>

            <Link className="hover:text-blue-300 transition">
              Top Reporters
            </Link>

            {role === "REPORTER" && (
              <Link to="/dashboard" className="hover:text-blue-300">
                Dashboard
              </Link>
            )}

            {role === "ADMIN" && (
              <Link to="/admin" className="hover:text-blue-300">
                Admin
              </Link>
            )}

            {token ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-4 pb-4 text-white font-medium">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            <Link onClick={() => setMenuOpen(false)}>
              Live
            </Link>

            <Link onClick={() => setMenuOpen(false)}>
              Top Reporters
            </Link>

            {role === "REPORTER" && (
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
            )}

            {role === "ADMIN" && (
              <Link to="/admin" onClick={() => setMenuOpen(false)}>
                Admin
              </Link>
            )}

            {token ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-500 px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-blue-600 px-4 py-2 rounded-lg text-center"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;