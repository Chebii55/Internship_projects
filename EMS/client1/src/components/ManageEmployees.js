import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook to navigate to other pages

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await fetch('/employees');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle employee creation
  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) {
        throw new Error('Failed to create employee');
      }

      const newEmp = await response.json();
      setEmployees((prev) => [...prev, newEmp]);
      setNewEmployee({ name: '', email: '', role: '', department: '' }); // Reset form
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  // Function to handle viewing employee details
  const handleViewDetails = (employeeId) => {
    navigate(`/employees/${employeeId}`); // Navigate to the employee details page
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Manage Employees</h1>

      {/* Employee List */}
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white mb-8">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                  Loading employees...
                </td>
              </tr>
            ) : employees.length ? (
              employees.map((employee) => (
                <tr key={employee.id} className="border-b">
                  <td className="px-4 py-2">{employee.full_name}</td>
                  <td className="px-4 py-2">{employee.email}</td>
                  <td className="px-4 py-2">{employee.role}</td>
                  <td className="px-4 py-2">{employee.department}</td>
                  <td>
                    <button
                      onClick={() => handleViewDetails(employee.employee_id)} // Navigate to employee details
                      className="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageEmployees;
