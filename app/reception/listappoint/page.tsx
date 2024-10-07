"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { CodeOutlined } from "@ant-design/icons";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const router = useRouter();

  const fetchAppointmentsByDate = async (date: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/app/listappoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate: date }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch filtered appointments");
      }
      const data = await response.json();
      if (data.success) {
        setAppointments(data.data);
      } else {
        setError(data.message || "Unknown error occurred");
      }
    } catch (err) {
      setError("Error fetching appointments.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      fetchAppointmentsByDate(selectedDate);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const handleViewMedicalHistory = (patientId: string | undefined) => {
    if (patientId) {
      router.push(`/reception/card/all/${patientId}`);
    } else {
      console.error("Invalid patient ID");
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
      <h1 className="text-2xl font-bold mb-6 text-center">
         Appointments
      </h1>

      {/* Form for filtering by date */}
      <form onSubmit={handleSubmit} className="mb-4 text-center">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)} // Update selected date on input change
          className="px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Filter
        </button>
      </form>

      {loading ? (
        <div>Loading appointments...</div>
      ) : error ? (
        <div className="text-center bg-red-100 text-red-500">{error}</div>
      ) : (
        <Table>
          <TableCaption>A list of patients with Scheduled Appointments.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Appointment Date</TableHead>
              <TableHead>Appointment Time</TableHead>
              <TableHead>Name</TableHead>
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
      )}
    </div>
  );
};

export default TodayAppointments;
