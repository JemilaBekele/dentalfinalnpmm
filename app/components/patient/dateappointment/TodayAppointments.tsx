import React, { useEffect, useState } from 'react';
import { Table,TableCaption,TableHead,TableHeader, TableBody, TableCell, TableRow } from '@/components/ui/table';

interface Appointment {
  id: string;
  appointmentDate: string;
  doctorId: {username:string};
  status: string;
  patientId: {
    username: string;
    cardno: string;
  };
}

const TodayAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodayAppointments = async () => {
      try {
        const response = await fetch('/api/app'); // Adjust the API endpoint as needed
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        if (data.success) {
          setAppointments(data.data); // Set the fetched appointments
        } else {
          setError(data.message || "Unknown error occurred");
        }
      } catch (err) {
        setError("Unknown error occurred");
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
    return <div className="text-center bg-green  text-gray-500">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 ">
      <h1 className="text-2xl font-bold mb-6 text-center">Today&apos;s Scheduled Appointments</h1>
      <Table>
      <TableCaption>A list of patients with Today&apos;s Scheduled Appointments.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Appointment Date</TableHead>
              <TableHead>Name</TableHead>              
              <TableHead>Card No</TableHead>
              <TableHead>By</TableHead>
              <TableHead>Action</TableHead>

            </TableRow>
          </TableHeader>
        <TableBody>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{new Date(appointment.appointmentDate).toLocaleString()}</TableCell>
                <TableCell>{appointment.patientId.username} </TableCell>
                <TableCell>{appointment.patientId.cardno}</TableCell>
                <TableCell>Dr {appointment.doctorId.username}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
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
