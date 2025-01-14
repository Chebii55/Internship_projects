import React, { useEffect, useState } from 'react';

const UserProfile = () => {
    const [sessionData, setSessionData] = useState(null);
    const [employeeData, setEmployeeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch session data
    useEffect(() => {
        const checkSession = async () => {
            try {
                const sessionResponse = await fetch('/check_session');
                if (!sessionResponse.ok) {
                    throw new Error('Session check failed.');
                }
                const sessionJson = await sessionResponse.json();
                console.log(sessionResponse)
                setSessionData(sessionJson);

                // Fetch employee data based on session employee ID
                const employeeResponse = await fetch(`/employee/${sessionJson.id}`);
                if (!employeeResponse.ok) {
                    throw new Error('Failed to fetch employee data');
                }
                const employeeJson = await employeeResponse.json();
                setEmployeeData(employeeJson);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    // Handle loading and error states
    if (loading) return <p className="text-gray-500">Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    // Render the profile page with employee data
    if (employeeData) {
        return (
            <div className="bg-gradient-to-r from-indigo-800 to-blue-900 min-h-screen flex items-center justify-center p-4">
                <div className="font-std mb-10 w-full rounded-2xl bg-white p-10 font-normal leading-relaxed text-gray-900 shadow-xl">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 text-center mb-8 md:mb-0">
                            <img
                                src="https://i.pravatar.cc/300"
                                alt="Profile Picture"
                                className="rounded-full w-48 h-48 mx-auto mb-4 border-4 border-indigo-800 transition-transform duration-300 hover:scale-105 ring ring-gray-300"
                            />
                            <button className="mt-4 bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300 ring ring-gray-300 hover:ring-indigo-300">Edit Profile</button>
                        </div>
                        <div className="md:w-2/3 md:pl-8">
                            <h1 className="text-2xl font-bold text-indigo-800 mb-2">{employeeData.full_name}</h1>
                            <p className="text-gray-600 mb-6">{employeeData.job_title}</p>

                            <h2 className="text-xl font-semibold text-indigo-800 mb-4">Organization Information</h2>
                            <p className="text-gray-700 mb-6">
                                {employeeData.department} / {employeeData.job_title}
                            </p>

                            <h2 className="text-xl font-semibold text-indigo-800 mb-4">Contact Information</h2>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-800 " viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    {employeeData.email}
                                </li>
                                <li className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-800" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    {employeeData.phone_number}
                                </li>
                                <li className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-800 0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    {employeeData.address}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default UserProfile;
