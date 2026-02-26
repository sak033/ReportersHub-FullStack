import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
  e.preventDefault();

  api.post("/auth/login", { email, password })
    .then(res => {
      const token = res.data.token;

      // Save token
      localStorage.setItem("token", token);

      // Fetch user info
      return api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    })
    .then(res => {
      // Save role
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "ADMIN") {
  navigate("/admin");
} else if (res.data.role === "REPORTER") {
  navigate("/dashboard");
} else {
  navigate("/");
}
    })
    .catch(() => {
      setError("Invalid credentials");
    });
};
  return (
    <div style={{ padding: "20px" }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;