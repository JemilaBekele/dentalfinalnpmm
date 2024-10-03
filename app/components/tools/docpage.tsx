"use client";
import React from "react";
import SideNavbar from "./sidebar";
import { ContainerOutlined, UserOutlined, ProjectOutlined, SolutionOutlined } from '@ant-design/icons';

const items= [
  { label: "Dashboard", icon: <ProjectOutlined/>, link: "/doctor" },
  { label: "Appointment", icon: <SolutionOutlined />, link: "/doctor/" },
  { label: "Patients", icon: <UserOutlined />, link: "/doctor/patients" },
  { label: "Invoice  Report", icon: <UserOutlined />, link: "/doctor/Invoice/report" },
  { label: "Profile", icon: <ContainerOutlined/>, link: "/doctor/profile" },
  
];

const Docpage: React.FC = () => {
  return (
    <div>
      <SideNavbar items={items} />
      {/* Other page content */}
    </div>
  );
};

export default Docpage;
