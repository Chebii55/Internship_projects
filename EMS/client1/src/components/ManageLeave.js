import React, { useState, useEffect } from "react";

const ManageLeave = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch leaves data from the API
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await fetch("/leaves");
        if (!response.ok) {
          throw new Error("Failed to fetch leaves data");
        }
        const data = await response.json();
        setLeaveData(data);
      } catch (error) {
        setError("Error fetching leave data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, []);

  // Handle the approval or rejection of a leave request
  const handleLeaveStatusChange = async (leaveId, newStatus) => {
    try {
      const response = await fetch(`/leaves/${leaveId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update leave status");
      }

      // Update the status in the state after successful response
      setLeaveData((prevData) =>
        prevData.map((leave) =>
          leave.leave_id === leaveId ? { ...leave, status: newStatus } : leave
        )
      );
    } catch (error) {
      setError("Error updating leave status: " + error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Manage Leave Requests</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Leave ID</th>
                <th className="px-4 py-2 border">Employee ID</th>
                <th className="px-4 py-2 border">Leave Type</th>
                <th className="px-4 py-2 border">Start Date</th>
                <th className="px-4 py-2 border">End Date</th>
                <th className="px-4 py-2 border">Reason</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveData.map((leave) => (
                <tr key={leave.leave_id} className="border-b">
                  <td className="px-4 py-2">{leave.leave_id}</td>
                  <td className="px-4 py-2">{leave.employee_id}</td>
                  <td className="px-4 py-2">{leave.leave_type}</td>
                  <td className="px-4 py-2">{leave.start_date}</td>
                  <td className="px-4 py-2">{leave.end_date}</td>
                  <td className="px-4 py-2">{leave.reason}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        leave.status === "Pending"
                          ? "bg-yellow-300 text-yellow-800"
                          : leave.status === "Approved"
                          ? "bg-green-300 text-green-800"
                          : leave.status === "Rejected"
                          ? "bg-red-300 text-red-800"
                          : ""
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {leave.status === "Pending" && (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleLeaveStatusChange(leave.leave_id, "Approved")}
                          className="px-4 py-2 bg-green-500 text-white rounded-md"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleLeaveStatusChange(leave.leave_id, "Rejected")}
                          className="px-4 py-2 bg-red-500 text-white rounded-md"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageLeave;
