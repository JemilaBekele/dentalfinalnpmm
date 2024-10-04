import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from "next/link";
type Patient = {
  _id: string;
  cardno?: string;
  firstname?: string;

  age?: string;
  sex?: string;
  email?: string;
  phoneNumber?: string;
  description?: string;
};

type PatientDetailsProps = {
  params: {
    id: string;
  };
};

const PatientComponent: React.FC<PatientDetailsProps> = ({ params }) => {
  const patientId = params.id;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/patient/registerdata/${patientId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setPatient(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Error fetching user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [patientId]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!patient) return <div>Patient not found</div>;

  const renderDetail = (label: string, value?: string) => {
    if (value) {
      return (
        <div className="flex flex-col mb-4">
          <h2 className="font-semibold text-gray-600">{label}</h2>
          <p className="text-gray-800">{value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white  h-auto p-4 rounded-lg shadow-md ">
    <div className="flex bg-white  flex-col items-center space-y-4 ">

      <div className="text-center">
        <h1 className="text-xl font-bold capitalize">{`${patient.firstname} `}</h1>
        <p className="text-gray-600 capitalize">{patient.email}</p>
        <p className="text-gray-600">{patient.phoneNumber}</p>
        <p className="text-gray-600">{patient.age} yrs</p>
      </div>
      
    
      <div className=" p-4 rounded-lg shadow-md w-full max-h-64 overflow-y-auto">
        {renderDetail('Card No', patient.cardno)}
        {renderDetail('Sex', patient.sex)}
        {renderDetail('Description', patient.description)}
      </div>

      <Link href={`/doctor/medicaldata/medicalhistory/all/${patientId}`} className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 text-gray-600 p-4 rounded-lg shadow-md transition">
  <span>Medical Records</span>
 
      </Link>
      <Link href={`/doctor/medicaldata/appointment/all/${patientId}`} className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 text-gray-600 p-4 rounded-lg shadow-md transition">
        <span>Appointments</span>
       
      </Link>
      <Link href={`/doctor/medicaldata/healthinfo/all/${patientId}`} className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 text-gray-600 p-4 rounded-lg shadow-md transition">
        <span>Health Information</span>
       
      </Link>
      <Link href={`/doctor/medicaldata/image/all/${patientId}`} className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 text-gray-600 p-4 rounded-lg shadow-md transition">
        <span>Images</span>
       
      </Link>
      <Link href={`/doctor/Invoice/all/${patientId}`} className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 text-gray-600 p-4 rounded-lg shadow-md transition">
        <span>Invoice</span>
       
      </Link>

    </div>
    </div>


    
  );
};

export default PatientComponent;
