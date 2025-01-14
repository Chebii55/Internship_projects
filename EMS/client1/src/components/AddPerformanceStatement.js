import React, { useState, useEffect } from "react";

const AddPerformanceStatement = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch employee data (you can replace with your actual employee data fetching logic)
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/employees"); // Replace with your API endpoint for employees
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        setError("Error fetching employees: " + error.message);
      }
    };
    fetchEmployees();
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const performanceData = {
      employee_id: employeeId,
      rating,
      comments,
      review_date: reviewDate,
    };

    try {
      const response = await fetch("/performance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(performanceData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit performance statement");
      }

      setSuccessMessage("Performance statement added successfully!");
      // Reset form after successful submission
      setEmployeeId("");
      setRating(0);
      setComments("");
      setReviewDate("");
    } catch (error) {
      setError("Error submitting performance statement: " + error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Add Performance Statement</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Employee ID */}
        <div className="flex flex-col">
          <label htmlFor="employeeId" className="mb-2 font-medium">Employee</label>
          <select
            id="employeeId"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div className="flex flex-col">
          <label htmlFor="rating" className="mb-2 font-medium">Rating (1-5)</label>
          <input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(Math.max(1, Math.min(5, e.target.value)))}
            min="1"
            max="5"
            className="p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Comments */}
        <div className="flex flex-col">
          <label htmlFor="comments" className="mb-2 font-medium">Comments</label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
            rows="4"
            required
          ></textarea>
        </div>

        {/* Review Date */}
        <div className="flex flex-col">
          <label htmlFor="reviewDate" className="mb-2 font-medium">Review Date</label>
          <input
            type="date"
            id="reviewDate"
            value={reviewDate}
            onChange={(e) => setReviewDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Performance Statement
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPerformanceStatement;
