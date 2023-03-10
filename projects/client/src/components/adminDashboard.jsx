import React from "react";
import SidebarAdmin from "./sidebar";
import UserList from "../pages/admin/userList";


const AdminDashboard = () => {
  return (
    <div style={{ display: "flex" }}>
      <SidebarAdmin />
      <UserList />
    </div>
  );
};

export default AdminDashboard;
