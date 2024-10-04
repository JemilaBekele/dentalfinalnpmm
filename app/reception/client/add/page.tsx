'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Define type for form data
type FormData = {
  cardno: string;
  firstname: string;
  age: string;
  sex: string;
  email: string;
  phoneNumber: string;
  description: string;
};

const PatientForm = () => {
  const [formData, setFormData] = useState<FormData>({
    cardno: '',
    firstname: '',
    age: '',
    sex: '',
    email: '',
    phoneNumber: '',
    description: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Handle changes for input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/patient/registerdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
console.log(result); // Check what the API response looks like


      if (response.ok) {
        const patientId = result.savedPatient._id; // Assuming the response contains a field 'id' for the new patient
        setSuccess('Patient created successfully');
        setError(null);
        setFormData({
          cardno: '',
          firstname: '',
          age: '',
          sex: '',
          email: '',
          phoneNumber: '',
          description: '',
        });
        router.push(`/reception/card/add/${patientId}`); // Navigate to the card page with patient ID
      } else {
        setError(result.error);
        setSuccess(null);
      }
    } catch (error) {
      setError('An error occurred while creating the patient');
      setSuccess(null);
    }
  };

  return (
    <div className="flex ml-7 mt-7">
      <div className="flex-grow md:ml-60 container mx-auto">
        <div className="p-6 bg-white rounded shadow-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Register Patient</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cardno" className="block text-sm font-medium text-gray-700">Card Number:</label>
                <input
                  id="cardno"
                  name="cardno"
                  type="text"
                  value={formData.cardno}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name:</label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={50}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age:</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number:</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                 
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Sex:</label>
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Register
            </button>
            {error && <p className="mt-4 text-center bg-red-200 text-red-600">{error}</p>}
            {success && <p className="mt-4 text-center bg-green-200 text-green-600">{success}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
