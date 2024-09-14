"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const UserForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
    phone: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const response = await res.json();
      setErrorMessage(response.message);
    } else {
      router.refresh();
      router.push("/admin");
    }
  };

  return (
    <div className="bg-[var(--bgSoft)] p-5 rounded-lg mt-24 ml-0 lg:ml-60 w-full max-w-4xl lg:max-w-[calc(100%-15rem)] mx-auto">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-6">
          <div className="w-full md:w-[48%]">
            <label className="block mb-2" htmlFor="username">Username</label>
            <input
              className="p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded w-full"
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
              value={formData.username}
            />
          </div>
          <div className="w-full md:w-[48%]">
            <label className="block mb-2" htmlFor="password">Password</label>
            <input
              className="p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded w-full"
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              value={formData.password}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <div className="w-full md:w-[48%]">
            <label className="block mb-2" htmlFor="role">Role</label>
            <select
              className="p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded w-full"
              id="role"
              name="role"
              onChange={handleChange}
              required
              value={formData.role}
            >
              <option value="" disabled>Select Role</option>
              <option value="admin">Admin</option>
              <option value="reception">Reception</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <div className="w-full md:w-[48%]">
            <label className="block mb-2" htmlFor="phone">Phone</label>
            <input
              className="p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded w-full"
              type="text"
              id="phone"
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              required
              value={formData.phone}
            />
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="self-center mt-4 py-2 px-6 rounded-lg bg-gray-900 text-white shadow-md hover:shadow-lg hover:bg-gray-500 focus:opacity-85 active:opacity-85"
            type="submit"
          >
            Submit
          </button>
          {errorMessage && (
            <p className="mt-4 text-red-500 text-sm">{errorMessage}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserForm;
