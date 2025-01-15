import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Login';
import SignUp from "./Signup";
import UserProfile from "./UserProfile";
import DashboardPersonalInfo from "./DashboardPersonalInfo";
import Layout from "./Layout";
import EditProfile from "./EditProfile";
import Payroll from "./Payroll";
import PayrollDetails from "./PayrollDetails"
import Leave from "./Leave";
import PerformanceStatement from "./PerformanceStatement";
import Navbar from "./Navbar";
import ManageEmployees from "./ManageEmployees";
import { useEffect,useState } from "react";
import Sidebar from "./Sidebar";
import ViewEmployee from "./ViewEmployee";
import ManagePayrolls from "./ManagePayrolls";
import AddPayroll from "./AddPayroll";
import ManageLeave from "./ManageLeave";
import AddPerformanceStatement from "./AddPerformanceStatement";
function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // to manage authentication state


  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Assuming check_session endpoint returns user session info or status
    fetch("/check_session")
      .then((response) => response.json())
      .then((data) => {
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        console.error("Error checking session:", error);
        setIsAuthenticated(false);
      });
  }, []);


  return (
    <div className="App"> 
      <Router> 
        <div className="bg-gray-100 h-screen flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Navbar */}
            <Navbar toggleSidebar={toggleSidebar} />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<DashboardPersonalInfo />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/edit-profile/:employeeId" element={<EditProfile />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/payroll/:payrollId" element={<PayrollDetails />} />
              <Route path="/performances" element={<PerformanceStatement />} />
              <Route path="/leaves" element={<Leave />} />
              <Route path="/employees" element={<ManageEmployees />} />
              <Route path="/employees/:employeeId" element={<ViewEmployee />} />
              <Route path="/payrolls" element={<ManagePayrolls/>} />
              <Route path="/payroll/add" element={<AddPayroll/>} />
              <Route path="/manage-leaves" element={<ManageLeave/>} />
              <Route path="/add-performances" element={<AddPerformanceStatement/>} />




            </Routes>
          </div>
        </div>
      </Router>
    </div> 
  );
}

export default App;
