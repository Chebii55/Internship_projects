import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ManagePayrolls = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch payroll data
  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const response = await fetch("/payrolls"); // Adjust the URL as needed for your API
        if (!response.ok) {
          throw new Error("Failed to fetch payroll data");
        }
        const data = await response.json();
        setPayrolls(data); // Set the payroll data
      } catch (error) {
        console.error("Error fetching payrolls:", error);
      } finally {
        setLoading(false); // Stop loading when data is fetched
      }
    };

    fetchPayrolls();
  }, []);

  const handleDelete = async (payrollId) => {
    try {
      const response = await fetch(`/payrolls/${payrollId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete payroll");
      }
      // Remove the deleted payroll from the state
      setPayrolls(payrolls.filter((payroll) => payroll.payroll_id !== payrollId));
    } catch (error) {
      console.error("Error deleting payroll:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading while fetching data
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Manage Payrolls</h1>

      {/* Payroll List */}
      <div>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Payroll ID</th>
              <th className="px-4 py-2 text-left">Employee ID</th>
              <th className="px-4 py-2 text-left">Payment Date</th>
              <th className="px-4 py-2 text-left">Basic Pay</th>
              <th className="px-4 py-2 text-left">Allowances</th>
              <th className="px-4 py-2 text-left">Deductions</th>
              <th className="px-4 py-2 text-left">Net Pay</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.length > 0 ? (
              payrolls.map((payroll) => (
                <tr key={payroll.payroll_id}>
                  <td className="px-4 py-2">{payroll.payroll_id}</td>
                  <td className="px-4 py-2">{payroll.employee_id}</td>
                  <td className="px-4 py-2">{payroll.payment_date}</td>
                  <td className="px-4 py-2">${payroll.basic_pay}</td>
                  <td className="px-4 py-2">${payroll.allowances}</td>
                  <td className="px-4 py-2">${payroll.deductions}</td>
                  <td className="px-4 py-2">${payroll.net_pay}</td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/payroll/${payroll.payroll_id}`}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      View
                    </Link>
                    <Link
                      to={`/payroll/edit/${payroll.payroll_id}`}
                      className="text-yellow-500 hover:underline mr-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(payroll.payroll_id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-2 text-center">
                  No payrolls found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Payroll Button */}
      <div className="mt-4">
        <Link
          to="/payroll/add"
          className="border border-green-500 bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Add Payroll
        </Link>
      </div>
    </div>
  );
};

export default ManagePayrolls;
