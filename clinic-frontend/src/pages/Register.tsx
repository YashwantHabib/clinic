import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    const res = await API.post("/api/register", {
      name: username,
      email,
      password,
    });
    login(res.data);
    navigate("/dashboard");
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9f9f9]">
      <div className="w-full max-w-md px-8 py-12 bg-transparent">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-2">Sign Up</h2>

        {/* Email Input */}
        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="Example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-full border-gray-400 bg-red-50 placeholder-gray-400 mb-6 focus:outline-none"
        />

        {/* Username Input */}
        <label className="block mb-2 text-sm font-medium">User Name</label>
        <input
          type="text"
          placeholder="John Doe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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

        {/* Sign Up Button */}
        <button
          onClick={handleRegister}
          className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg font-medium transition"
        >
          Sign Up
        </button>

        {/* Login Link */}
        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-500 font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
