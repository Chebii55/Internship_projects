import { useEffect, useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch("/check_session")
      .then((r) => r.json())
      .then((data) => setUserData(data));
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/check_session", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        alert("Session expired or invalid. Please log in again.");
        navigate("/");
        return;
      }
      navigate("/");
    } catch (error) {
      console.error("Error checking session:", error);
      alert("An error occurred while checking the session.");
    }
  };

  return (
    <div
      className={`absolute bg-gray-800 text-white w-56 min-h-screen overflow-y-auto transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } ease-in-out duration-300`}
    >
      <div className="p-4">
        <h1 className="text-2xl font-semibold text-center text-indigo-500">EMS</h1>

        <ul className="mt-4 space-y-2">
          <li>
            <Link to="/dashboard" className="block px-4 py-2 rounded-md hover:bg-gray-700">
              Dashboard
            </Link>
          </li>

          {userData?.role === "Admin" && (
            <>
              <li>
                <Link to="/employees" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                  Manage Employees
                </Link>
              </li>
              <li>
                <Link to="/payrolls" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                  Manage Payrolls
                </Link>
              </li>
              <li>
                <Link to="/manage-leaves" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                  Manage Leave
                </Link>
              </li>
              <li>
                <Link to="/performances" className="block px-4 py-2 rounded-md hover:bg-gray-700">
                  Add Performance Statements
                </Link>
              </li>
            </>
          )}

          <li>
            <Link to="/payroll" className="block px-4 py-2 rounded-md hover:bg-gray-700">
              Payroll
            </Link>
          </li>
          <li>
            <Link to="/leaves" className="block px-4 py-2 rounded-md hover:bg-gray-700">
              Leave
            </Link>
          </li>
          <li>
            <Link to="/performances" className="block px-4 py-2 rounded-md hover:bg-gray-700">
              Performance Statement
            </Link>
          </li>

          <li className="mt-6">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 mt-4 text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
