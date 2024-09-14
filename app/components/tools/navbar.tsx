"use client";
import { usePathname } from "next/navigation";
import { SearchOutlined} from '@ant-design/icons'

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="p-5 border-b border-gray-300  bg-white flex items-center justify-between fixed top-0 left-0 md:left-60 w-full md:w-[calc(100%-15rem)] h-16 z-10 transition-all duration-200 ease-in-out">
      <div className="text-blue-900 font-bold capitalize">{pathname.split("/").pop()}</div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
        <SearchOutlined  className="text-white" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none text-white outline-none"
          />
        </div>
        
      </div>
    </div>
  );
};

export default Navbar;
