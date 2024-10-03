"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { EditOutlined } from '@ant-design/icons';
import Image from 'next/image';
type User = {
  _id: string;
  username: string;
  phone: string;
  role: string;
  image?: string; 
};

const Profile = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const userId = useMemo(() => {
    return session?.user?.id || null;
  }, [session]);

  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`/api/register/${userId}`);
          setProfile(response.data);
        } catch (err) {
          console.error("Error fetching user:", err);
          setError("Error fetching user details.");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      setLoading(false);
      setError("User ID is not available.");
    }
  }, [userId]);

  const handleEdit = () => {
    if (userId && profile?.role) {
      // Determine the dynamic route based on the user's role
      const roleBasedRoute = profile.role === "admin"
        ? `/admin/profile/${userId}`
        : profile.role === "doctor"
        ? `/doctor/profile/${userId}`
        : `/reception/profile/${userId}`; // Default route for other roles

      router.push(roleBasedRoute);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return <div>User not found</div>;

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="max-w-md w-full bg-gradient-to-r from-white-200 via-blue-200 to-white-200  rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Profile</h1>
        {profile.image && (
        <div className="mb-4 flex justify-center">
          <Image src={profile.image} alt={profile.username} 
           
           width={100} // Desired width
           height={200} // Desired height
           className="rounded-full w-32 h-32 mx-auto object-cover" />
        </div>
      )}
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-800">Username</h2>
          <p className="text-gray-800 text-lg">{profile.username}</p>
        </div>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-800">Phone</h2>
          <p className="text-gray-800 text-lg">{profile.phone}</p>
        </div>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-600">Role</h2>
          <p className="text-gray-800 text-lg">{profile.role}</p>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-bold hover:bg-indigo-700 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105"
          >
            <EditOutlined className="mr-2" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
