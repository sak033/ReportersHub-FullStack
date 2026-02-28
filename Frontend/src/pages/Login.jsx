import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Background from "../assets/bg_Login.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  

 const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const loginRes = await api.post("/auth/login", { email, password });
    const token = loginRes.data.token;

    localStorage.setItem("token", token);

    const userRes = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const role = userRes.data.role;

    console.log("Role from backend:", role);  // 👈 HERE

    localStorage.setItem("role", role);

    if (role === "ADMIN") navigate("/admin");
    else if (role === "REPORTER") navigate("/dashboard");
    else navigate("/");

  } catch (err) {
    setError("Invalid email or password");
  }
};
 return (
  <div
    className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
    style={{
      backgroundImage: `url(${Background})`
    }}
  >
    {/* Dark Overlay (makes text readable) */}
    <div className="absolute inset-0 bg-black/40"></div>

    {/* Login Card */}
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 w-full max-w-md rounded-2xl shadow-2xl p-10">
      
      <h2 className="text-3xl font-bold text-center text-white mb-8">
        Welcome Back
      </h2>

      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          Login
        </button>
      </form>

      <p className="text-sm text-white text-center mt-6">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-white cursor-pointer hover:underline"
        >
          Register
        </span>
      </p>
    </div>
  </div>
);
}

export default Login;