"use client";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CodeOutlined } from '@ant-design/icons';

type Patient = {
  _id: string;
  firstname: string;
  sex: string;
};

const Home: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/patient/order/orderlist');
        if (!response.ok) throw new Error('Network response was not ok');
        const data: { patients: Patient[] } = await response.json(); // Specify the type of `data`
        setPatients(data.patients.map(({ _id, firstname, sex }) => ({ _id, firstname, sex })));
      } catch (error) {
        setError('Error fetching patients');
        console.error('Error fetching patients:', error);
      }
    };
  
    fetchPatients();
  }, []);
  

  return (
    <div className="mt-24 ml-0 lg:ml-60 w-full max-w-4xl lg:max-w-[calc(100%-15rem)] mx-auto p-5 rounded-lg">
      <h1 className="text-xl font-bold mb-5">Patients</h1>
     
        <Table>
          <TableCaption>A list of patients with active orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Firstname</TableHead>
              <TableHead>Sex</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map(({ _id, firstname, sex }) => (
              <TableRow key={_id}>
                <TableCell>{firstname}</TableCell>
                <TableCell>{sex}</TableCell>
                <TableCell>
                  <Link href={`/doctor/medicaldata/medicalhistory/all/${_id}`}>
                    <CodeOutlined className="text-2xl text-gray-600 group-hover:text-white" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
     
    </div>
  );
};

export default Home;
