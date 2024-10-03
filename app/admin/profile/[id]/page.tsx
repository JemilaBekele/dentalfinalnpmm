"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type User = {
  _id: string;
  username: string;
  phone: string;
  role: string; // Add the role field
};

type UserDetailsProps = {
  params: {
    id: number;
  };
};

const EditUser: React.FC<UserDetailsProps> = ({ params }) => {
  const userId = params.id;
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
  });

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`/api/register/${userId}`);
          setUser(response.data);
          setFormData({
            username: response.data.username,
            phone: response.data.phone,
          });
        } catch (err) {
          console.error("Error fetching user:", err);
          setError("Error fetching user details.");
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/register/${userId}`, formData);

      // Determine the dynamic route based on the user's role
      const roleBasedRoute = user?.role === "admin"
        ? `/admin/profile`
        : user?.role === "doctor"
        ? `/doctor/profile`
        : `/user/profile`; // Default route for other roles

      router.push(roleBasedRoute);
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Error updating user.");
    }
  };

  const handleCancel = () => {
    // Determine the dynamic route based on the user's role
    const roleBasedRoute = user?.role === "admin"
      ? `/admin/profile`
      : user?.role === "doctor"
      ? `/doctor/profile`
      : `/reception/profile`; // Default route for other roles

    router.push(roleBasedRoute);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-lg w-full bg-gradient-to-r from-purple-200 via-pink-200 to-red-200 rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-lg font-semibold text-gray-600 mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-lg font-semibold text-gray-600 mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              required
            />
          </div>

          <div className="flex justify-center gap-6 mt-8">
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-bold shadow-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Update
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-500 text-white rounded-full text-lg font-bold shadow-lg hover:bg-gray-600 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
