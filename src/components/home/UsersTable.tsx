import React from "react";
import { Table, Dropdown, Button, Tag } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { User } from "../../types";
import { useNavigate } from "react-router-dom";

interface Props {
  users: User[];
  onView: (user: User) => void;
  onDelete: (user: User) => void;
}

const UsersTable: React.FC<Props> = ({ users, onView, onDelete }) => {
  const navigate = useNavigate();
  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: User["role"]) => (
        <Tag
          color={
            role === "ADMIN"
              ? "geekblue"
              : role === "CUSTOMER"
              ? "green"
              : "orange"
          }
        >
          {role}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: User["status"]) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: "View",
                onClick: () => navigate(`/users/${record.userId}`),
              },

              {
                key: "delete",
                label: "Delete",
                danger: true,
                onClick: () => onDelete(record),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <Table
      rowKey="userId"
      dataSource={users}
      columns={columns}
      pagination={false}
    />
  );
};

export default UsersTable;
