"use client";
import React from "react";
import SideNavbar from "./sidebar";
import { SmileOutlined, UserOutlined } from '@ant-design/icons';

const items = [
  { label: "Dashboard", icon: <SmileOutlined />, link: "/dashboard" },
  { label: "Register", icon: <SmileOutlined />, link: "/reception/client/add" },
  { label: "Patients", icon: <UserOutlined />, link: "/reception/client/all" },
  { label: "Order", icon: <SmileOutlined />, link: "/reception/client/order" },
  { label: "Profile", icon: <UserOutlined />, link: "/profile" },
  { label: "Logout", icon: <UserOutlined />, link: "/logout" },
];

const Recpage: React.FC = () => {
  return (
    <div>
      <SideNavbar items={items} />
      {/* Other page content */}
    </div>
  );
};

export default Recpage;
