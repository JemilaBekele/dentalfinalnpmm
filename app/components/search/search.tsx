"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo  } from 'react';
import axios from 'axios';
import { CodeOutlined } from '@ant-design/icons';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useSession } from 'next-auth/react';
import { useSearchParams } from "next/navigation";

type User = {
  _id: string;
  cardno: string;
  firstname: string;
  age: string;
  sex: string;
  phoneNumber: string;
};

const UsersPage: React.FC = () => {
    const { data: session } = useSession(); 
  const searchParams = useSearchParams();
  const search = searchParams.get("search"); // Get the 'search' query parameter
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [, setError] = useState<string | null>(null);
  const role = useMemo(() => session?.user?.role || '', [session]); 
  useEffect(() => {
    if (!search) {
      setError("Please provide a Card ID or First Name in the search.");
      return;
    }

    const fetchUsers = async () => {
      try {
        // Decide which parameter to use based on the input format
        const isphoneNumber= /^\d+$/.test(search); // Assuming cardno is numeric
        const endpoint = isphoneNumber
          ? `/api/patient/registerdata/search?phoneNumber=${search}`
          : `/api/patient/registerdata/search?firstname=${search}`;

        const response = await axios.get(endpoint);

        // Ensure the response data is an array
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setError('Unexpected data format received from server');
        }
      } catch (error) {
        console.error("Error fetching users:", );
        setError('An error occurred while fetching patients');
      }
    };

    fetchUsers();
  }, [search]);
  const handleViewMedicalHistory = (patientId: string | undefined) => {
    if (patientId) {
        {role === 'admin' && (
      router.push(`/admin/medicaldata/medicalhistory/all/${patientId}`))}
        {role === 'doctor' && (
          router.push(`/doctor/medicaldata/medicalhistory/all/${patientId}`))}
        {role === 'reception' && (
            router.push(`/reception/card/all/${patientId}`))}
    } else {
      console.error('Invalid patient ID');
    }
  };
  return (
    <div className="mt-24 ml-0 lg:ml-60 w-full max-w-4xl lg:max-w-[calc(100%-15rem)] mx-auto p-5 rounded-lg">
      <h1 className="text-xl font-bold mb-5">Patients</h1>
      
        <Table>
          <TableCaption>A list of patients with active orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Firstname</TableHead>
              <TableHead>Sex</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Action</TableHead>
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
                  <TableCell>
                    <button
                      onClick={() =>
                        handleViewMedicalHistory(_id)
                      }
                      className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600"
                      aria-label="MedicalHistory"
                    >
                      <CodeOutlined />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
     
    </div>
  );
};

export default UsersPage;
