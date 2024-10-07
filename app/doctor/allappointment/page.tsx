"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableCaption, TableHead, TableHeader, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { CodeOutlined } from '@ant-design/icons';

interface Appointment {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorId: { username: string };
  status: string;
  patientId: {
    id: {
        _id: string;
        
      };
    username: string;
    cardno: string;
  };
}

const TodayAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter(); // For programmatic navigation

  useEffect(() => {
    const fetchTodayAppointments = async () => {
      try {
        const response = await fetch('/api/app/doctor'); // Adjust the API endpoint as needed
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        console.log(data);
        if (data.success) {
          setAppointments(data.data); // Set the fetched appointments
        } else {
          setError(data.message || 'Unknown error occurred');
        }
      } catch (err) {
        setError('Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTodayAppointments();
  }, []);

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div className="text-center bg-green text-gray-500">{error}</div>;
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert 24-hour to 12-hour, handling midnight as 12
    return `${formattedHour}:${minutes} ${ampm}`;
  };
  // Handler to navigate on button click
  const handleViewMedicalHistory = (patientId: string | undefined) => {
    if (patientId) {
      router.push(`/doctor/medicaldata/medicalhistory/all/${patientId}`);
    } else {
      console.error('Invalid patient ID');
    }
  };
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-200 text-blue-800"; 
      case "Completed":
        return "bg-green-200 text-green-800"; 
      case "Cancelled":
        return "bg-red-200 text-red-800"; 
      case "Pending":
        return "bg-yellow-200 text-yellow-800"; 
      default:
        return "bg-gray-200 text-gray-800"; 
    }
  };
  return (
    <div className="mt-24 ml-0 lg:ml-60 w-full max-w-4xl lg:max-w-[calc(100%-15rem)] mx-auto p-5 rounded-lg">
      
      <h1 className="text-2xl font-bold mb-6 text-center">Scheduled Appointments</h1>
      <Table>
        <TableCaption>A list of patients with Scheduled Appointments.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Appointment Date</TableHead>
            <TableHead>Appointment Time</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Card No</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>By</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {new Date(appointment.appointmentDate).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </TableCell>
                  <TableCell>{formatTime(appointment.appointmentTime)}</TableCell>
                  <TableCell>{appointment.patientId.username}</TableCell>
                  <TableCell>{appointment.patientId.cardno}</TableCell>
                  <TableCell> <p  className={`flex items-center justify-center px-1 py-1 rounded-full ${getStatusClass(appointment.status)}`}>{appointment.status}</p></TableCell>
                  <TableCell>Dr {appointment.doctorId.username}</TableCell>
                  <TableCell>
                    <button
                      onClick={() =>
                        handleViewMedicalHistory(appointment.patientId?.id._id)
                      }
                      className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600"
                      aria-label="MedicalHistory"
                    >
                      <CodeOutlined />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No appointments scheduled for today.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
      </Table>
    </div>
  );
};

export default TodayAppointments;
