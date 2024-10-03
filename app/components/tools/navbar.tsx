"use client";
import { useState,  useMemo } from 'react';
import { useSession } from "next-auth/react";
import { SearchOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";
import Image from 'next/image';

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const user = useMemo(() => {
    return session?.user?.username ? { username: session.user.username } : null;
  }, [session]);

  // Memoize user data to avoid unnecessary re-renders
  const image = useMemo(() => {
    return session?.user?.image ? { image: session.user.image } : null;
  }, [session]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      router.push(`/admin/search?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="p-8 bg-gray-100 flex items-center justify-between fixed top-0 left-0 md:left-60 w-full md:w-[calc(100%-15rem)] h-16 z-10 transition-all duration-200 ease-in-out">
       <div className="flex items-center gap-2 p-2 rounded-lg shadow-md">
        <SearchOutlined className="text-black" />
        <input
          type="text"
          placeholder="Search patients"
          className="bg-transparent border-none text-black outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch} // Trigger search on Enter
        />
      </div>
      
      <div className="flex items-center gap-5">
      <div className="flex items-center ">
        {/* Use a fallback image if profile.image is undefined */}
        <Image
          src={image?.image || "/uploads/default-profile.jpg"} // Ensure src is always a string
          alt={user?.username || "User profile"}
          width={50} // Desired width
          height={50} // Desired height
          className="rounded-full object-cover"
        /></div>
      <div className="text-indigo-400 text-base font-normal capitalize p-1">
        {user ? user.username : ''}
      </div>
      </div>
    </div>
  );
};

export default Navbar;
