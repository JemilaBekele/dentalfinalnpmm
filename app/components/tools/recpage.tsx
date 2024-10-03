"use client";
import React from "react";
import SideNavbar from "./sidebar";
import {  UserOutlined,ProjectOutlined,FormOutlined ,BuildOutlined ,TeamOutlined} from '@ant-design/icons';

const items = [
  { label: "Dashboard", icon: <ProjectOutlined/>, link: "/reception" },
  { label: "Register", icon: <FormOutlined />, link: "/reception/client/add" },
  { label: "Patients", icon: <TeamOutlined />, link: "/reception/client/all" },
  { label: "Order", icon: <BuildOutlined />, link: "/reception/client/order" },
  { label: "Profile", icon: <UserOutlined />, link: "/reception/profile" },

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
