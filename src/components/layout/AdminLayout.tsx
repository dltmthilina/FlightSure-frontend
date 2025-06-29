import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Layout from "./Layout";
import Header from "./Header";
import Footer from "./Footer";

const AdminLayout: React.FC = () => {
  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Airports", path: "admin/airports" },
    { name: "Airplanes", path: "admin/airplanes" },
    { name: "Flights", path: "admin/flights" },
    { name: "Users", path: "admin/users" },
    /*  { name: "Search", path: "/search" }, */
  ];

  return (
    <div>
      <Header />
      <div className="flex ">
        <div className="w-64 h-screen bg-primary-dark text-white p-4">
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded ${
                    isActive ? "bg-white text-primary-dark" : "hover:bg-primary"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className={`h-full min-h-screen overflow-hidden  w-full`}>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
