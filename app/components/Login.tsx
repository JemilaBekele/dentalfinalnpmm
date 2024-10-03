"use client"; // Mark this component as a client component

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSessionData from '../hook/useSessionData'; // Adjust path as needed
import Spinner from '../components/ui/Spinner'
const LoginForm: React.FC = () => {
  const router = useRouter();
  const { session, loading } = useSessionData();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(''); // Clear error message on new attempt

    const result = await signIn('credentials', {
      redirect: false, // Prevent automatic redirect, we handle it manually
      phone,
      password,
    });

    if (result?.error) {
      setErrorMessage(result.error); // Set error if login fails
    } else if (result?.ok) {
      // Success case, will redirect after session is updated
    }
  };

  // Effect to handle redirection based on the session's status
  useEffect(() => {
    if (loading) return; // Wait for session data to load
    if (!session) {
      router.push("/signIn"); // Redirect to sign-in page if not authenticated
    } else {
      const userRole = session.user?.role; // Get the role from session
      switch (userRole) {
        case "admin":
          router.push("/admin");
          break;
        case "doctor":
          router.push("/doctor");
          break;
        case "reception":
          router.push("/reception");
          break;
        default:
          router.push("/unauthorized"); // Handle any other roles or missing roles
      }
    }
  }, [router, session, loading]); // Include loading instead of status

  if (loading) return <Spinner />;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-white via-indigo-600 to-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-black">Login</h1>

        <label htmlFor="phone" className="block text-base font-medium text-gray-800">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="mt-1 block w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
        />

        <label htmlFor="password" className="block text-base font-medium text-gray-800 mt-4">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
        />

        <button
          type="submit"
          className="mt-6 w-full bg-gradient-to-r from-gold to-indigo-400 hover:from-indigo-400 hover:to-gold text-black font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Login
        </button>

        {errorMessage && (
          <p className="mt-4 text-red-400 text-sm">{errorMessage}</p>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
