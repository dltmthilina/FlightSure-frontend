import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Header from "./Header";

const CustomerLayout: React.FC = () => {
  const menuItems = [
    { name: "Search Flights", path: "customer/search" },
    { name: "My Bookings", path: "customer/bookings" },
    // Add more customer menu items as needed
  ];

  return (
    <div>
      <Header />
      <div className="flex">
        <div className="w-64 h-screen bg-primary-dark text-white p-4">
          <h2 className="text-xl font-bold mb-6">Customer Panel</h2>
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
    </div>
  );
};

export default CustomerLayout;
