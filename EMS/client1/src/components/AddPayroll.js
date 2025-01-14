import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPayroll = () => {
  const [payrollData, setPayrollData] = useState({
    employee_id: "",
    payment_date: "",
    basic_pay: "",
    allowances: "",
    deductions: "",
    loans: "",
    nhif: "",
    nssf: "",
    paye: "",
    net_pay: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook to navigate after successful form submission

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayrollData({
      ...payrollData,
      [name]: value,
    });
  };

  // Calculate net pay
  const calculateNetPay = () => {
    const {
      basic_pay,
      allowances,
      deductions,
      loans,
      nhif,
      nssf,
      paye,
    } = payrollData;

    const netPay =
      parseFloat(basic_pay) +
      parseFloat(allowances) -
      (parseFloat(deductions) +
        parseFloat(loans) +
        parseFloat(nhif) +
        parseFloat(nssf) +
        parseFloat(paye));

    setPayrollData({ ...payrollData, net_pay: netPay.toFixed(2) });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/payrolls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payrollData),
      });

      if (!response.ok) {
        throw new Error("Failed to create payroll");
      }

      // Redirect to the manage payroll page after success
      navigate("/payrolls");
    } catch (error) {
      setError("Error creating payroll: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Add Payroll</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Employee ID */}
        <div>
          <label htmlFor="employee_id" className="block text-sm font-medium">
            Employee ID
          </label>
          <input
            type="number"
            id="employee_id"
            name="employee_id"
            value={payrollData.employee_id}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Payment Date */}
        <div>
          <label htmlFor="payment_date" className="block text-sm font-medium">
            Payment Date
          </label>
          <input
            type="date"
            id="payment_date"
            name="payment_date"
            value={payrollData.payment_date}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Basic Pay */}
        <div>
          <label htmlFor="basic_pay" className="block text-sm font-medium">
            Basic Pay
          </label>
          <input
            type="number"
            id="basic_pay"
            name="basic_pay"
            value={payrollData.basic_pay}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Allowances */}
        <div>
          <label htmlFor="allowances" className="block text-sm font-medium">
            Allowances
          </label>
          <input
            type="number"
            id="allowances"
            name="allowances"
            value={payrollData.allowances}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Deductions */}
        <div>
          <label htmlFor="deductions" className="block text-sm font-medium">
            Deductions
          </label>
          <input
            type="number"
            id="deductions"
            name="deductions"
            value={payrollData.deductions}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Loans */}
        <div>
          <label htmlFor="loans" className="block text-sm font-medium">
            Loans
          </label>
          <input
            type="number"
            id="loans"
            name="loans"
            value={payrollData.loans}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* NHIF */}
        <div>
          <label htmlFor="nhif" className="block text-sm font-medium">
            NHIF
          </label>
          <input
            type="number"
            id="nhif"
            name="nhif"
            value={payrollData.nhif}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* NSSF */}
        <div>
          <label htmlFor="nssf" className="block text-sm font-medium">
            NSSF
          </label>
          <input
            type="number"
            id="nssf"
            name="nssf"
            value={payrollData.nssf}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* PAYE */}
        <div>
          <label htmlFor="paye" className="block text-sm font-medium">
            PAYE
          </label>
          <input
            type="number"
            id="paye"
            name="paye"
            value={payrollData.paye}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Net Pay */}
        <div>
          <label htmlFor="net_pay" className="block text-sm font-medium">
            Net Pay
          </label>
          <input
            type="number"
            id="net_pay"
            name="net_pay"
            value={payrollData.net_pay}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled
          />
        </div>

        {/* Calculate Net Pay Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={calculateNetPay}
            className="border border-blue-500 bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Calculate Net Pay
          </button>
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            type="submit"
            disabled={loading}
            className="border border-green-500 bg-green-500 text-white px-4 py-2 rounded-md"
          >
            {loading ? "Adding Payroll..." : "Add Payroll"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPayroll;
