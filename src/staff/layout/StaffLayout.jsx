import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components";  // Your staff sidebar component
// import Header from "./components/Header";    // Your common header component

const StaffLayout = () => {
  return (
    <main className="page-wrapper">
      {/* left of page */}
      <Sidebar />
      {/* right side/content of the page */}
      <div className="content-wrapper">
        <Outlet />
      </div>
    </main>
  );
};

export default StaffLayout;
