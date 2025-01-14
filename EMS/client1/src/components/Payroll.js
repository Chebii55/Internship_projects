import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // Use navigate for routing

const Payroll = () => {
    const [payrolls, setPayrolls] = useState([]);
    const [employeeId, setEmployeeId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sessionData, setSessionData] = useState([]);
    const navigate = useNavigate();  // Navigate hook for routing

    // Computed summary metrics
    const totalPayments = payrolls.reduce((sum, payroll) => sum + payroll.net_pay, 0);
    const totalPayrolls = payrolls.length;

    useEffect(() => {
        // Function to check session and fetch employeeId
        const checkSession = async () => {
            try {
                const response = await fetch("/check_session");
                if (!response.ok) throw new Error("Session check failed");
                const data = await response.json();
                setSessionData(data);
                setEmployeeId(data.employee_id); // Assume backend sends { employee_id: <id> }
            } catch (err) {
                setError("Failed to validate session. Please log in.");
                console.error(err);
            }
        };
        // Function to fetch payroll data
        const fetchPayrolls = fetch(`/payrolls`)
            .then(r => r.json())
            .then(data => {
                // Filter payrolls based on sessionData.id
                const filteredPayrolls = data.filter(payroll => payroll.employee_id === sessionData.id);
                setPayrolls(filteredPayrolls); // Update the state with the filtered data
            })
            .catch(error => console.error('Error fetching payrolls:', error));

        
        // Initialize: Validate session and fetch payrolls
        const initialize = async () => {
            setLoading(true);
            await checkSession();
            if (employeeId) await fetchPayrolls();
            setLoading(false);
        };

        initialize();
    }, [employeeId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl text-gray-600 animate-pulse">Loading payroll data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm uppercase">Total Payments</h3>
                    <p className="text-3xl font-bold text-green-600">${totalPayments.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm uppercase">Number of Payrolls</h3>
                    <p className="text-3xl font-bold text-blue-600">{totalPayrolls}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm uppercase">Employee Username</h3>
                    <p className="text-3xl font-bold text-purple-600">{sessionData.username}</p>
                </div>
            </div>

            {/* Detailed Payroll Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {payrolls.map((payroll) => (
                    <div
                        key={payroll.payroll_id}
                        className="flex items-center bg-white border rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="p-4 bg-green-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                        </div>
                        <div className="px-4 py-2 text-gray-700">
                            <h3 className="text-sm font-semibold">Date: {payroll.payment_date}</h3>
                            <p className="text-lg font-bold text-green-600">Net Pay: ${payroll.net_pay}</p>
                            <button
                                onClick={() => navigate(`/payroll/${payroll.payroll_id}`)}  // Navigate to payroll details
                                className="bg-blue-500 text-white px-3 py-1 rounded mt-2 text-sm shadow hover:bg-blue-600 transition"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Payroll;
