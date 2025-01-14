import React from "react";

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className="bg-white shadow">
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-4 px-2">
          <h1 className="text-xl font-semibold">Employee Management System</h1>
          <button
            className="text-gray-500 hover:text-gray-600"
            onClick={toggleSidebar}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
