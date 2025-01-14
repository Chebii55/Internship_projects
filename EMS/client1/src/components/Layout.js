import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import DashboardPersonalInfo from "./DashboardPersonalInfo";
import UserProfile from "./UserProfile";

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-gray-100 h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />
        <DashboardPersonalInfo/>
    
      </div>
    </div>
  );
};

export default Layout;
