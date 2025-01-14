import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ViewEmployee = () => {
  const { employeeId } = useParams(); // Get the employee ID from the route
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all employees data
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/employees');

        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }

        const data = await response.json();

        // Filter the employee data by employeeId after fetching
        const selectedEmployee = data.find((emp) => emp.employee_id === parseInt(employeeId));

        setEmployee(selectedEmployee); // Set the specific employee data
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchEmployees();
  }, [employeeId]); // Re-run the effect when employeeId changes

  if (loading) {
    return <div>Loading...</div>; // Show loading text while fetching data
  }

  if (!employee) {
    return <div>Employee not found</div>; // Handle case where employee data is not available
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Employee Details</h1>

      {/* Employee Details */}
      <div className="mb-4">
        <p><strong>Name:</strong> {employee.full_name}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Phone:</strong> {employee.phone_number}</p>
        <p><strong>Role:</strong> {employee.role}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Date of Birth:</strong> {employee.date_of_birth}</p>
        <p><strong>Employment Status:</strong> {employee.employment_status}</p>
        <p><strong>Address:</strong> {employee.address}</p>
      </div>

      {/* Leaves */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Leaves</h2>
        {employee.leaves && employee.leaves.length > 0 ? (
          <ul>
            {employee.leaves.map((leave) => (
              <li key={leave.leave_id} className="mb-2">
                <p><strong>Leave Type:</strong> {leave.leave_type}</p>
                <p><strong>Status:</strong> {leave.status}</p>
                <p><strong>Reason:</strong> {leave.reason}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No leaves found</p>
        )}
      </div>

      {/* Performance */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Performance</h2>
        {employee.performances && employee.performances.length > 0 ? (
          <ul>
            {employee.performances.map((performance) => (
              <li key={performance.id} className="mb-2">
                <p><strong>Review Date:</strong> {performance.review_date}</p>
                <p><strong>Rating:</strong> {performance.rating}</p>
                <p><strong>Comments:</strong> {performance.comments}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No performance reviews found</p>
        )}
      </div>

      {/* Edit and Delete buttons */}
      <div className="mt-4">
        <button className="mr-2 border border-blue-500 bg-blue-500 text-white px-4 py-2 rounded-md">
          Edit
        </button>
        <button className="border border-red-500 bg-red-500 text-white px-4 py-2 rounded-md">
          Delete
        </button>
      </div>
    </div>
  );
};

export default ViewEmployee;
