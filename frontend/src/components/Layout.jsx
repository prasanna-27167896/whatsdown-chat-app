import React from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="flex min-h-screen">
      {showSidebar && <Sidebar />}

      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
