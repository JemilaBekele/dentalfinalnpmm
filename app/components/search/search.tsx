import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

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
  const search = searchParams.get("search");
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const role = useMemo(() => session?.user?.role || '', [session]);

  // Define the role to route mapping here
  const roleToRouteMap: { [key: string]: string } = {
    admin: '/admin/medicaldata/medicalhistory/all/{patientId}',
    doctor: '/doctor/medicaldata/medicalhistory/all/{patientId}',
    reception: '/reception/card/all/{patientId}',
  };

  useEffect(() => {
    if (!search) {
      setError("Please provide a Card ID or First Name in the search.");
      return;
    }

    const fetchUsers = async () => {
      try {
        const isPhoneNumber = /^\d+$/.test(search);
        const endpoint = isPhoneNumber
          ? `/api/patient/registerdata/search?phoneNumber=${search}`
          : `/api/patient/registerdata/search?firstname=${search}`;

        const response = await axios.get<User[]>(endpoint); // Specify the type here
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
    <div className="flex mt-30 m-7">
      <div className="flex-grow md:ml-60 container mx-auto p-4">
      {error && <div className="error">{error}</div>}
      {users.length > 0 && (
        <Table>
          <TableCaption>A list of users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Card No</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Sex</TableHead>
              <TableHead>Phone Number</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id} onClick={() => router.push(roleToRouteMap[role].replace('{patientId}', user._id))}>
                <TableCell>{user.cardno}</TableCell>
                <TableCell>{user.firstname}</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>{user.sex}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div> </div>
  );
};

export default UsersPage;
