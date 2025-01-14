import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      console.log(data)
  
      if (response.ok) {
        setSuccess(data.message); // Display success message
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        setError(data.error); // Display the error message
      }
    } catch (err) {
      setError("An error occurred. Please try again."); // Generic error handling
    }
  };
  

  return (
    <div className="h-screen bg-gradient-to-r from-indigo-800 to-blue-900 to-cyan-300  flex justify-center items-center w-full">
      <form onSubmit={handleSubmit}>
        <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-xl max-w-sm">
          <div className="space-y-4">
            <h1 className="text-center text-2xl font-semibold text-gray-600">Login</h1>
            <hr />
            <div className="flex items-center border-2 py-2 px-3 rounded-md mb-4">
              <input
                className="pl-2 outline-none border-none w-full"
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-md">
              <input
                className="pl-2 outline-none border-none w-full"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className={`mt-6 w-full shadow-xl bg-gradient-to-tr from-blue-600 to-red-700 hover:to-red-400 text-indigo-100 py-2 rounded-md text-lg tracking-wide transition duration-1000 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-500 font-semibold hover:text-blue-600 hover:underline transition duration-200"
            >
              Sign Up
            </Link>
          </p>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          {success && <p className="text-green-500 mt-4 text-center">{success}</p>}
        </div>
      </form>
    </div>
  );
};

export default Login;
