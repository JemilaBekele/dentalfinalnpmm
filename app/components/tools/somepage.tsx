"use client";
import React from "react";
import SideNavbar from "./sidebar";
import { ContainerOutlined, UserOutlined, ProjectOutlined, TeamOutlined, SolutionOutlined , LogoutOutlined} from '@ant-design/icons';

const items= [
  { label: "Dashboard", icon: <ProjectOutlined/>, link: "/dashboard" },
  { label: "Register", icon: <SolutionOutlined />, link: "/admin/users/add" },
  { label: "Employees", icon: <TeamOutlined />, link: "/admin/users" },
  { label: "Patients", icon: <UserOutlined />, link: "/patients" },
  { label: "Profile", icon: <ContainerOutlined/>, link: "/profile" },
  { label: "Logout", icon: <LogoutOutlined/>, link: "/logout" },
];

const SomePage: React.FC = () => {
  return (
    <div>
      <SideNavbar items={items} />
      {/* Other page content */}
    </div>
  );
};

export default SomePage;
