import React, { useState, useEffect } from 'react';

const Leave = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [employeeId, setEmployeeId] = useState(null); // Simulating employee session ID
  const [leaves, setLeaves] = useState([]);
  const [newLeave, setNewLeave] = useState({
    leave_type: 'Unpaid',
    start_date: '',
    end_date: '',
    reason: ''
  });

  // Simulate session check for employee ID
  useEffect(() => {
    const sessionEmployeeId = 4; // Simulate a session ID
    if (sessionEmployeeId) {
      setEmployeeId(sessionEmployeeId);
      setIsAuthenticated(true);
      fetchLeaves(sessionEmployeeId);
    }
  }, []);

  // Fetch leaves based on employee ID
  const fetchLeaves = async (employeeId) => {
    const leaveData = [
      {
        created_at: "2024-11-20 10:48:09",
        employee_id: 4,
        end_date: "2024-05-24",
        leave_id: 2,
        leave_type: "Unpaid",
        reason: "Perhaps challenge later under. Of seem conference.",
        start_date: "2024-01-23",
        status: "Approved"
      },
      {
        created_at: "2024-11-20 10:48:09",
        employee_id: 4,
        end_date: "2024-09-16",
        leave_id: 3,
        leave_type: "Vacation",
        reason: "Republican treat truth other prevent page. Medical best finally other.",
        start_date: "2024-03-17",
        status: "Approved"
      },
      // Add other leave data as needed
    ];
    setLeaves(leaveData.filter(leave => leave.employee_id === employeeId));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLeave(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCreateLeave = (e) => {
    e.preventDefault();
    // In a real-world application, submit the leave request to the backend
    setLeaves(prevState => [...prevState, { ...newLeave, leave_id: Date.now(), status: 'Pending', created_at: new Date().toISOString() }]);
    setNewLeave({
      leave_type: 'Unpaid',
      start_date: '',
      end_date: '',
      reason: ''
    });
  };

  // Format dates to a more readable format
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto p-4">
      {isAuthenticated ? (
        <>
          <h2 className="text-2xl  font-semibold mb-4">Your Leave Information</h2>

          <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr className='bg-gradient-to-tr from-blue-200 to-blue-900'>
                  <th className="px-4 py-2 text-left">Leave Type</th>
                  <th className="px-4 py-2 text-left">Start Date</th>
                  <th className="px-4 py-2 text-left">End Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Reason</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length ? (
                  leaves.map(leave => (
                    <tr key={leave.leave_id} className="border-b">
                      <td className="px-4 py-2">{leave.leave_type}</td>
                      <td className="px-4 py-2">{formatDate(leave.start_date)}</td>
                      <td className="px-4 py-2">{formatDate(leave.end_date)}</td>
                      <td className="px-4 py-2">{leave.status}</td>
                      <td className="px-4 py-2">{leave.reason}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-2 text-center text-gray-500">No leaves found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Create New Leave Request</h3>

            <form onSubmit={handleCreateLeave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                <select
                  name="leave_type"
                  value={newLeave.leave_type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Sick">Sick</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={newLeave.start_date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={newLeave.end_date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <textarea
                  name="reason"
                  value={newLeave.reason}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="4"
                  required
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Submit Leave Request
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <div className="text-center text-red-500">
          <p>You are not authenticated. Please log in to view your leave information.</p>
        </div>
      )}
    </div>
  );
};

export default Leave;
