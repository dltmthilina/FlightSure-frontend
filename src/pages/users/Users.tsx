import React, { useEffect, useState } from "react";
import UsersTable from "../../components/home/UsersTable";
import { ApiResponse, User } from "../../types";
import ManageUserModal from "../../components/users/ManageUserModal";
import useApi from "../../hooks/use-api";

function Users() {
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserId, setEditUserId] = useState<string | undefined>();
  const [users, setUsers] = useState<User[]>([]);
  const api = useApi();

  useEffect(() => {
    refreshUsers();
  }, []);

  const handleView = (user: User) => console.log("View user", user);
  const handleDelete = (user: User) => console.log("Delete user", user);

  const refreshUsers = async () => {
    const res = await api.get<ApiResponse<User[]>>("/users");
    //console.log(res);
    setUsers(res?.data ?? []);
  };

  return (
    <div
      style={{ padding: 24, backgroundColor: "#f9fafb", minHeight: "100vh" }}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>

        <ManageUserModal
          visible={showUserModal}
          setVisible={setShowUserModal}
          callback={refreshUsers}
          isEdit={false}
        />
      </div>
      <UsersTable users={users} onView={handleView} onDelete={handleDelete} />
    </div>
  );
}

export default Users;
