import { Outlet, Navigate } from "react-router-dom";
import Header from "../components/menu/header/header";
import Sidebar from "../components/menu/sidebar/sidebar";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const access = localStorage.getItem("uid");

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return access ? (
    <div>
      <div className={`container ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="m-header">
          <Header />
        </div>
        <div className="m-sidebar">
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        <div className="m-content">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
