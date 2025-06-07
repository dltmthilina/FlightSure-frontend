import React from "react";
import { NavLink } from "react-router-dom";

const AdminLayout: React.FC = () => {
  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Airports", path: "/airports" },
    { name: "Airplanes", path: "/airplanes" },
    { name: "Flights", path: "/flights" },
  ];

  return (
    <div className="w-64 h-screen bg-primary-dark text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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
  );
};

export default AdminLayout;
