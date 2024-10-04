"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useSearchParams } from "next/navigation";

type User = {
  _id: string;
  cardno: string;
  firstname: string;
  age: string;
  sex: string;
};

const UsersPage: React.FC = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search"); // Get the 'search' query parameter

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!search) {
      setError("Please provide a Card ID or First Name in the search.");
      return;
    }

    const fetchUsers = async () => {
      try {
        // Decide which parameter to use based on the input format
        const isCardno = /^\d+$/.test(search); // Assuming cardno is numeric
        const endpoint = isCardno
          ? `/api/patient/registerdata/search?cardno=${search}`
          : `/api/patient/registerdata/search?firstname=${search}`;

        const response = await axios.get(endpoint);

        // Ensure the response data is an array
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setError('Unexpected data format received from server');
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError('An error occurred while fetching patients');
      }
    };

    fetchUsers();
  }, [search]);

  return (
    <div className="mt-24 ml-0 lg:ml-60 w-full max-w-4xl lg:max-w-[calc(100%-15rem)] mx-auto p-5 rounded-lg">
      <h1 className="text-xl font-bold mb-5">Patients</h1>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <Table>
          <TableCaption>A list of patients with active orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Firstname</TableHead>
              <TableHead>Sex</TableHead>
              <TableHead>Age</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>No patients found.</TableCell>
              </TableRow>
            ) : (
              users.map(({ _id, firstname, sex, age }) => (
                <TableRow key={_id}>
                  <TableCell>{firstname}</TableCell>
                  <TableCell>{sex}</TableCell>
                  <TableCell>{age}</TableCell>
                 
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default UsersPage;
