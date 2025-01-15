import React, { useState } from "react";
import { useNavigate,Link } from 'react-router-dom';


const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    id_number: "",
    password: "",
    confirm_password: "",
    role: "",
    address: "",
    phone_number: "",
    department: "",
    job_title: "",
    employment_status: "",
    date_of_birth: "",
    date_hired: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const roles = ["Admin", "Manager", "Staff"];
  const employmentStatuses = ["Full-time", "Part-time", "Contract"];
  const departments = ["Human Resources", "Engineering", "Marketing", "Sales", "Finance", "Customer Support"];
  const jobTitles = [
    "Software Engineer",
    "Data Analyst",
    "Project Manager",
    "HR Specialist",
    "Sales Executive",
    "Marketing Manager",
  ];
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setFormData({
          full_name: "",
          username: "",
          email: "",
          id_number: "",
          password: "",
          confirm_password: "",
          role: "",
          address: "",
          phone_number: "",
          department: "",
          job_title: "",
          employment_status: "",
          date_of_birth: "",
          date_hired: "",
        });
        navigate('/dashboard');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-indigo-800 to-blue-900 to-cyan-300 flex justify-center items-center">
      <div className="bg-white border rounded-lg px-8 py-6 max-w-2xl overflow-y-auto h-[90vh] shadow-lg">
        {/* Heading */}
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-600">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Full Name and Username */}
          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label htmlFor="full_name" className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
            </div>
          </div>

          {/* Email, ID Number, Role */}
          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
            </div>
            
            <div className="w-1/2">
              <label htmlFor="phone_number" className="block text-gray-700 font-medium mb-2">
                Phone Number
              </label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
            </div>
            
          </div>

          {/* Address and Phone Number */}
          <div className="mb-4 flex gap-4">
          <div className="w-1/2">
              <label htmlFor="id_number" className="block text-gray-700 font-medium mb-2">
                ID Number
              </label>
              <input
                type="text"
                id="id_number"
                name="id_number"
                value={formData.id_number}
                onChange={handleChange}
                className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
            </div>
            
            
          </div>
          <div className="mb-4 flex gap-2">
          <div className="w-1/2">
              <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                required
              >
                <option value="" disabled>
                  Select Role
                </option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label htmlFor="department" className="block text-gray-700 font-medium mb-2">
                Department
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                required
              >
                <option value="" disabled>
                  Select Department
                </option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Department, Job Title, Employment Status */}
          <div className="mb-4 flex gap-4">
          
            <div className="mb-4 w-1/2">
            <label htmlFor="job_title" className="block text-gray-700 font-medium mb-2">
              Job Title
            </label>
            <select
              id="job_title"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
              className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
              required
            >
              <option value="" disabled>
                Select Job Title
              </option>
              {jobTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/2">
              <label htmlFor="employment_status" className="block text-gray-700 font-medium mb-2">
                Employment Status
              </label>
              <select
                id="employment_status"
                name="employment_status"
                value={formData.employment_status}
                onChange={handleChange}
                className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                required
              >
                <option value="" disabled>
                  Select Status
                </option>
                {employmentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Date Fields */}
          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label htmlFor="date_of_birth" className="block text-gray-700 font-medium mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="date_hired" className="block text-gray-700 font-medium mb-2">
                Date Hired
              </label>
              <input
                type="date"
                id="date_hired"
                name="date_hired"
                value={formData.date_hired}
                onChange={handleChange}
                className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
            </div>
          </div>

          {/* Password and Confirm Password */}
          <div>
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
              {formData.password && formData.password.length < 8 && (
                <p className="text-red-500 mt-1 text-sm">Password must be at least 8 characters long.</p>
              )}
            </div>
            <div>
              <label htmlFor="confirm_password" className="block text-gray-700 font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                required
              />
              {formData.confirm_password && formData.confirm_password.length < 8 && (
                <p className="text-red-500 mt-1 text-sm">Confirm Password must be at least 8 characters long.</p>
              )}
              {formData.password &&
                formData.confirm_password &&
                formData.password !== formData.confirm_password &&
                formData.confirm_password.length >= 8 && (
                  <p className="text-red-500 mt-1 text-sm">Passwords do not match.</p>
                )}
            </div>
          </div>


          {/* Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              className="mt-6 w-full shadow-xl bg-gradient-to-tr from-blue-600 to-red-700 hover:to-red-400 text-indigo-100 py-2 rounded-md text-lg tracking-wide transition duration-1000"
            >
              Sign Up
            </button>
          </div>
          <p className="text-center text-gray-600">
            Have an account?{" "}
            <Link
              to="/"
              className="text-blue-500 font-semibold hover:text-blue-600 hover:underline transition duration-200"
            >
              Log in
            </Link>
          </p>
          {/* Feedback */}
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          {success && <p className="text-green-500 mt-4 text-center">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
