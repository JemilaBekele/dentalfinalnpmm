"use client"; // This is required for components that use hooks in the app directory

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  cardno: string;
  firstname: string;

  age: string;
  email: string;
  phoneNumber: string;
  sex: string;
  description: string;
};

type PatientDetailsProps = {
  params: {
    id: string;
  };
};

const UpdatePatientForm: React.FC<PatientDetailsProps> = ({ params }) => {
  const patientId: string = params.id;
  
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    cardno: "",
    firstname: "",
  
    age: "",
    email: "",
    phoneNumber: "",
    sex: "",
    description: "",
  });
  
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`/api/patient/registerdata/${patientId}`, {
               
          headers: {
            'Content-Type': 'application/json',
            // Include JWT here
          },
          
        });
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/patient/registerdata/${patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json",
        
         },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Patient updated successfully");
        router.push(`/reception/client/${patientId}`);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      setMessage("Internal server error");
    }
  };

  const handleCancel = () => {
    router.push("/reception/client/all");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-10">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Update Patient</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Card Number", name: "cardno", type: "text" },
                { label: "First Name", name: "firstname", type: "text", minLength: 3, maxLength: 50 },
           
                { label: "Age", name: "age", type: "number" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone Number", name: "phoneNumber", type: "tel" },
              ].map(({ label, name, type, minLength, maxLength }) => (
                <div key={name} className="col-span-1">
                  <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    value={formData[name as keyof FormData]}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                    minLength={minLength}
                    maxLength={maxLength}
                  />
                </div>
              ))}

              <div className="col-span-1 sm:col-span-2">
                <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                  Sex
                </label>
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="w-full py-2 px-4 bg-gray-300 text-gray-700 font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>

            {message && <p className="mt-4 text-center bg-red-300 text-red-400">{message}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdatePatientForm;
