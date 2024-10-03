'use client';
import { useState, useEffect } from "react";

interface Patient {
  firstname: string;
  cardno: string;
}

type PatientDetailsProps = {
  params: {
    id: number;
  };
};

const CreateCardPage: React.FC<PatientDetailsProps> = ({ params }) => {
  const patientId = params.id; // Patient ID from URL
  const [cardprice, setCardPrice] = useState<string>("");
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch patient details based on patientId
  const fetchPatientData = async () => {
    if (!patientId) return;
    try {
      const response = await fetch(`/api/patient/registerdata/${patientId}`);
      const data = await response.json();
      if (response.ok) {
        setPatientData(data);
      } else {
        setError(data.error || "Error fetching patient details");
      }
    } catch (err) {
      setError("Error fetching patient details");
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/Invoice/card/${patientId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardprice }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Card created successfully!");
        setCardPrice("");
      } else {
        setError(data.error || "Error creating card");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  // Fetch patient data when the component mounts or ID changes
  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  return (
    <div className="flex ml-7 mt-7">
      <div className="flex-grow md:ml-60 container mx-auto">
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Create a New Card</h1>

      {/* Success and Error Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <strong>Error:</strong> {error}
        </div>
      )}
      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          <strong>Success:</strong> {message}
        </div>
      )}

      {patientData && (
        <div className="mb-6">
          <p className="text-lg">
            <strong>Patient Name:</strong> {patientData.firstname}
          </p>
          <p className="text-lg">
            <strong>Card Number:</strong> {patientData.cardno}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Card Price:</label>
          <input
            type="text"
            value={cardprice}
            onChange={(e) => setCardPrice(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div></div></div>
  );
};

export default CreateCardPage;
