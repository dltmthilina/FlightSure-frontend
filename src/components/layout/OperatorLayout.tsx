import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const OperatorLayout: React.FC = () => {
  const menuItems = [
    { name: "Flights", path: "/operator/flights" },
    { name: "Bookings", path: "/operator/bookings" },
    // Add more operator menu items as needed
  ];

  return (
    <div className="flex">
      <div className="w-64 h-screen bg-primary-dark text-white p-4">
        <h2 className="text-xl font-bold mb-6">Operator Panel</h2>
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
      <div className="h-full min-h-screen overflow-hidden w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default OperatorLayout;
