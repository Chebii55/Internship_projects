import React, { useState, useEffect } from "react";

const PerformanceStatement = () => {
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeFeedback, setEmployeeFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the employee id from the /check_session endpoint
  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const response = await fetch("/check_session"); // This will get the employee id
        if (!response.ok) {
          throw new Error("Failed to fetch session data");
        }

        const sessionData = await response.json();
        setEmployeeId(sessionData.id); // Set the employee_id in state
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchEmployeeId();
  }, []);
  
  console.log(employeeId)

  // Fetch performance data once we have the employee ID
  useEffect(() => {
    if (!employeeId) return; // Don't fetch performance data until we have employee_id

    const fetchFeedback = async () => {
      try {
        const response = await fetch("/performances"); // Fetch performance data
        if (!response.ok) {
          throw new Error("Failed to fetch feedback data");
        }

        const data = await response.json();
        const filteredFeedback = data.filter(
          (feedback) => feedback.employee_id === employeeId
        );
        setEmployeeFeedback(filteredFeedback);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [employeeId]); // Re-fetch performance data when employeeId is updated

  // Loading and error states
  if (loading) {
    return <div className="text-center text-lg">Loading performance data...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-blue-600">Performance Feedback</h2>
      {employeeFeedback.length > 0 ? (
        employeeFeedback.map((feedback) => (
          <div
            key={feedback.id}
            className="mb-6 p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-800">
                Rating:{" "}
                <span className="text-yellow-500">
                  {feedback.rating.toFixed(1)} / 5
                </span>
              </span>
              <span className="text-sm text-gray-500">{feedback.review_date}</span>
            </div>
            <p className="text-gray-700 mb-4">{feedback.comments}</p>
            <div className="text-sm text-gray-500">
              <strong>Review Date:</strong> {feedback.review_date}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-lg text-gray-500">No performance feedback available.</div>
      )}
    </div>
  );
};

export default PerformanceStatement;
