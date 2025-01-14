import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PayrollDetails = () => {
    const { payrollId } = useParams();
    const [payroll, setPayroll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayrollDetails = async () => {
            try {
                const response = await fetch(`/payrolls/${payrollId}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data = await response.json();
                setPayroll(data);
            } catch (err) {
                setError("Failed to fetch payroll details. Please try again later.");
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (payrollId) {
            fetchPayrollDetails();
        } else {
            setError("Payroll ID is missing.");
            setLoading(false);
        }
    }, [payrollId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-800 to-blue-900">
                <div className="text-xl font-semibold text-white">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-800 to-blue-900">
                <div className="text-red-500 text-xl font-semibold">{error}</div>
            </div>
        );
    }

    if (!payroll) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-800 to-blue-900">
                <div className="text-gray-500 text-xl">No payroll details available.</div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-indigo-800 to-blue-900 min-h-screen flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-6">
                    <h1 className="text-3xl font-bold uppercase">Payroll Details</h1>
                    {/* <p className="text-sm mt-1">Payroll ID: {payrollId}</p> */}
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* <div className="py-2">
                            <h3 className="font-semibold text-gray-700">Employee ID</h3>
                            <p className="text-gray-900">{payroll.employee_id}</p>
                        </div> */}
                        <div className="py-2">
                            <h3 className="font-semibold text-gray-700">Basic Pay</h3>
                            <p className="text-gray-900">KES {payroll.basic_pay.toLocaleString()}</p>
                        </div>
                        <div className="py-2">
                            <h3 className="font-semibold text-gray-700">Loans</h3>
                            <p className="text-gray-900">KES {payroll.loans.toLocaleString()}</p>
                        </div>
                        <div className="py-2">
                            <h3 className="font-semibold text-gray-700">NHIF</h3>
                            <p className="text-gray-900">KES {payroll.nhif.toLocaleString()}</p>
                        </div>
                        <div className="py-2">
                            <h3 className="font-semibold text-gray-700">NSSF</h3>
                            <p className="text-gray-900">KES {payroll.nssf.toLocaleString()}</p>
                        </div>
                        <div className="py-2">
                            <h3 className="font-semibold text-gray-700">PAYE</h3>
                            <p className="text-gray-900">KES {payroll.paye.toLocaleString()}</p>
                        </div>
                        <div className="py-2">
                            <h3 className="font-semibold text-gray-700">Deductions</h3>
                            <p className="text-gray-900">KES {payroll.deductions.toLocaleString()}</p>
                        </div>
                        <div className="py-2">
                            <h3 className="font-semibold text-gray-700">Allowances</h3>
                            <p className="text-gray-900">KES {payroll.allowances.toLocaleString()}</p>
                        </div>
                        <div className="py-2 md:col-span-2">
                            <h3 className="font-semibold text-gray-700">Net Pay</h3>
                            <p className="text-green-600 font-bold text-lg">KES {payroll.net_pay.toLocaleString()}</p>
                        </div>
                        <div className="py-2 md:col-span-2">
                            <h3 className="font-semibold text-gray-700">Payment Date</h3>
                            <p className="text-gray-900">{new Date(payroll.payment_date).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayrollDetails;
