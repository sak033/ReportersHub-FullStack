import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: "10px", borderBottom: "1px solid gray" }}>
      <Link to="/">Home</Link>

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