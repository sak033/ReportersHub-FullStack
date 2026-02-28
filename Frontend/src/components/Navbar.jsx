import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-blue-900 border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">
          ReportersHub
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8 text-white font-medium">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>

          <Link className="hover:text-blue-600 transition">Live</Link>

          <Link className="hover:text-blue-600 transition">Top Reporters</Link>

          {role === "REPORTER" && (
            <Link to="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
          )}

          {role === "ADMIN" && (
            <Link to="/admin" className="hover:text-blue-600">
              Admin
            </Link>
          )}

          {token ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;