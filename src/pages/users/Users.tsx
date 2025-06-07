import React from "react";
import UsersTable from "../../components/home/UsersTable";
import { User, UserStatus, UserType } from "../../types";

const dummyUsers: User[] = [
  {
    id: "u1",
    firstName: "Thilina",
    lastName: "Perera",
    email: "thilina.perera@example.com",
    phoneNumber: "+94712345678",
    role: UserType.Admin,
    passportNumber: "N1234567",
    nationality: "Sri Lankan",
    status: UserStatus.Active,
    createdAt: "2024-12-01T08:30:00Z",
  },
  {
    id: "u2",
    firstName: "Nadeesha",
    lastName: "Silva",
    email: "nadeesha.silva@example.com",
    role: UserType.Customer,
    status: UserStatus.Active,
    createdAt: "2025-01-10T14:20:00Z",
  },
  {
    id: "u3",
    firstName: "Kamal",
    lastName: "Fernando",
    email: "kamal.fernando@example.com",
    phoneNumber: "+94777654321",
    role: UserType.Operator,
    passportNumber: "P9087654",
    nationality: "Sri Lankan",
    status: UserStatus.Active,
    createdAt: "2025-03-05T09:00:00Z",
  },
  {
    id: "u4",
    firstName: "Amila",
    lastName: "Jayasinghe",
    email: "amila.j@example.com",
    role: UserType.Customer,
    phoneNumber: "+94781234567",
    status: UserStatus.Active,
    createdAt: "2025-04-12T11:45:00Z",
  },
  {
    id: "u5",
    firstName: "Ruwan",
    lastName: "Perera",
    email: "ruwan.p@example.com",
    phoneNumber: "+94773456789",
    role: UserType.Admin,
    passportNumber: "L6543210",
    nationality: "Sri Lankan",
    status: UserStatus.Inactive,
    createdAt: "2024-11-25T10:10:00Z",
  },
];

function Users() {
  const handleView = (user: any) => console.log("View user", user);
  const handleEdit = (user: any) => console.log("Edit user", user);
  const handleDelete = (user: any) => console.log("Delete user", user);
  return (
    <div
      style={{ padding: 24, backgroundColor: "#f9fafb", minHeight: "100vh" }}
    >
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Users</h1>
      <UsersTable
        users={dummyUsers}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Users;
