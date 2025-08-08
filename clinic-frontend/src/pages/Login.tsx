import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/api/login", { email, password });
      login(res.data);
      console.log(res.data);
      navigate(res.data.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9f9f9]">
      <div className="w-full max-w-md px-8 py-12 bg-transparent">
        {/* Welcome Text */}
        <h2 className="text-2xl red-500 font-bold mb-2">Welcome</h2>

        {/* Email Input */}
        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="Example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-full border-gray-400 bg-red-50 placeholder-gray-400 mb-6 focus:outline-none"
        />

        {/* Password Input */}
        <label className="block mb-2 text-sm font-medium">Password</label>
        <input
          type="password"
          placeholder="At least 8 Characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-full border-gray-400 bg-red-50 placeholder-gray-400 mb-8 focus:outline-none"
        />

        {/* Sign In Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-full font-medium"
        >
          Sign In
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-sm mt-6">
          Don’t have an account yet?{" "}
          <Link
            to="/register"
            className="text-red-500 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
