'use client';

import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {Patient} from "@/types/patient"


type PatientDetailsProps = {
  params: {
    id: number;
  };
};

const UserDetails: React.FC<PatientDetailsProps> = ({ params }) => {
  const patientId = params.id;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Explicitly type fetchUser
  const fetchUser = async (): Promise<void> => {
    try {
      const response: AxiosResponse<Patient> = await axios.get(`/api/patient/registerdata/${patientId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setPatient(response.data); // Assign patient data directly
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Error fetching user details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [patientId]);

  const handleEdit = () => {
    router.push(`/reception/client/edit/${patientId}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/patient/registerdata/${patientId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      router.push('/reception/client/all');
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Error deleting user.');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!patient) return <div>Patient not found</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">User Details</h1>
      <div className="mb-4 flex">
        <h2 className="text-lg font-semibold mr-2">Card Number:</h2>
        <p className="text-gray-700 text-lg">{patient.cardno}</p>
      </div>
      <div className="mb-4 flex">
        <h2 className="text-lg font-semibold mr-2">First Name:</h2>
        <p className="text-gray-700 text-lg">{patient.firstname}</p>
      </div>

      <div className="mb-4 flex">
        <h2 className="text-lg font-semibold mr-2">Age:</h2>
        <p className="text-gray-700 text-lg">{patient.age}</p>
      </div>
      <div className="mb-4 flex">
        <h2 className="text-lg font-semibold mr-2">Sex:</h2>
        <p className="text-gray-700 text-lg">{patient.sex}</p>
      </div>
      <div className="mb-4 flex">
        <h2 className="text-lg font-semibold mr-2">Email:</h2>
        <p className="text-gray-700 text-lg">{patient.email}</p>
      </div>
      <div className="mb-4 flex">
        <h2 className="text-lg font-semibold mr-2">Phone Number:</h2>
        <p className="text-gray-700 text-lg">{patient.phoneNumber}</p>
      </div>
      <div className="mb-4 flex">
        <h2 className="text-lg font-semibold mr-2">Description:</h2>
        <p className="text-gray-700 text-lg">{patient.description}</p>
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <EditOutlined className="text-2xl text-blue-500 group-hover:text-white" onClick={handleEdit} />
        <DeleteOutlined className="text-2xl text-red-500 group-hover:text-white" onClick={handleDelete} />
      </div>
    </div>
  );
};

export default UserDetails;
