"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Spinner from '@/app/components/ui/Spinner';
import Image from 'next/image';


type User = {
  _id: string;
  username: string;
  phone: string;
  role: string;
  image?: string; // Marked image as optional
};

type UserDetailsProps = {
  params: {
    id: number;
  };
};

const UserDetails: React.FC<UserDetailsProps> = ({ params }) => {
  const userId = params.id;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/register/${userId}`);
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Error fetching user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleEdit = () => {
    router.push(`/admin/users/edit/${userId}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/users/signup/${userId}`);
      router.push('/admin/users');
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Error deleting user.");
    }
  };

  if (loading) return <div className="text-center"><Spinner /></div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">User Details</h1>
      
      {/* Displaying the user image if it exists */}
      {user.image && (
        <div className="mb-4 flex justify-center">
          <Image src={user.image} alt={user.username} 
           
           width={100} // Desired width
           height={200} // Desired height
           className="rounded-full w-32 h-32 mx-auto object-cover" />
        </div>
      )}
      
      <div className="mb-4 flex">
        <h2 className="text-xl font-semibold mr-2">Name:</h2>
        <p className="text-gray-700 text-xl">{user.username}</p>
      </div>
      <div className="mb-4 flex">
        <h2 className="text-xl font-semibold mr-2">Phone:</h2>
        <p className="text-gray-700 text-xl">{user.phone}</p>
      </div>
      <div className="mb-4 flex">
        <h2 className="text-xl font-semibold mr-2">Role:</h2>
        <p className="text-gray-700 text-xl">{user.role}</p>
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <EditOutlined className="text-2xl text-blue-500 group-hover:text-white" onClick={handleEdit} />
        <DeleteOutlined className="text-2xl text-red-500 group-hover:text-white" onClick={handleDelete} />
      </div>
    </div>
  );
};

export default UserDetails;
