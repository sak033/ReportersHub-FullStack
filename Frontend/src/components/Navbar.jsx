import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div style={{ padding: "10px", borderBottom: "1px solid gray" }}>
      
      <Link to="/">Home</Link>

      {/* Reporter Dashboard */}
      {role === "REPORTER" && (
        <Link to="/dashboard" style={{ marginLeft: "10px" }}>
          Dashboard
        </Link>
      )}

      {/* Admin Dashboard */}
      {role === "ADMIN" && (
        <Link to="/admin" style={{ marginLeft: "10px" }}>
          Admin Dashboard
        </Link>
      )}

      {token ? (
        <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
          Logout
        </button>
      ) : (
        <Link to="/login" style={{ marginLeft: "10px" }}>
          Login
        </Link>
      )}
    </div>
  );
}

export default Navbar;