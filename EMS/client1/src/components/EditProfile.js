import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        job_title: '',
        department: '',
        employment_status: '',
        email: '',
        phone_number: '',
        address: '',
    });

    const { employeeId } = useParams(); // Get employeeId from URL params
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch employee data when the component mounts
    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await fetch(`/employees/${employeeId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch employee data');
                }
                const employeeJson = await response.json();
                setFormData(employeeJson);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, [employeeId]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Destructure and exclude date-related fields (created_at, updated_at, date_of_birth, date_hired)
        const { payrolls,leaves,performances,created_at, updated_at, date_of_birth, date_hired, ...dataToSubmit } = formData;
        console.log(dataToSubmit)
        try {
            const response = await fetch(`/employees/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSubmit) // Send filtered data
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedEmployee = await response.json();
            alert('Profile updated successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    // Handle loading and error states
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="bg-gradient-to-r from-indigo-800 to-blue-900 min-h-screen flex items-center justify-center p-4">
            <div className="font-std mb-10 w-full rounded-2xl bg-white p-10 font-normal leading-relaxed text-gray-900 shadow-xl">
                <h1 className="text-2xl font-bold text-indigo-800 mb-6">Edit Profile</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="full_name" className="block text-gray-700">Full Name</label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="job_title" className="block text-gray-700">Job Title</label>
                        <input
                            type="text"
                            id="job_title"
                            name="job_title"
                            value={formData.job_title}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="department" className="block text-gray-700">Department</label>
                        <input
                            type="text"
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="employment_status" className="block text-gray-700">Employment Status</label>
                        <input
                            type="text"
                            id="employment_status"
                            name="employment_status"
                            value={formData.employment_status}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone_number" className="block text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            id="phone_number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-gray-700">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
