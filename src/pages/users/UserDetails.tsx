import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../../hooks/use-api";
import { ApiResponse, User } from "../../types";
import { Card, Spin, Tag, Avatar, Row, Col, Divider, Button } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  FlagOutlined,
  EditOutlined,
} from "@ant-design/icons";
import ManageUserModal from "../../components/users/ManageUserModal";

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const api = useApi();

  const fetchUser = async () => {
    setLoading(true);
    const res = await api.get<ApiResponse<User>>(`/users/${userId}`);
    setUser(res?.data ?? null);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  if (!user)
    return <div className="text-center text-lg mt-10">User not found.</div>;

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 py-10">
      <Card
        className="w-full max-w-xl shadow-2xl rounded-xl"
        bodyStyle={{ padding: 32 }}
        title={
          <div className="flex flex-col items-center">
            <Avatar
              size={96}
              icon={<UserOutlined />}
              className="mb-3 bg-blue-500"
              src={""}
            />
            <div className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </div>
            <div className="flex gap-2 mt-2">
              <Tag
                color={user.status === "ACTIVE" ? "green" : "red"}
                className="font-semibold"
              >
                {user.status}
              </Tag>
              <Tag
                color={
                  user.role === "ADMIN"
                    ? "geekblue"
                    : user.role === "CUSTOMER"
                    ? "green"
                    : "orange"
                }
                className="font-semibold"
              >
                {user.role}
              </Tag>
            </div>
            <Button
              type="primary"
              icon={<EditOutlined />}
              className="mt-4 bg-primary-dark"
              onClick={() => setShowEditModal(true)}
            >
              Edit
            </Button>
          </div>
        }
      >
        <Divider />
        <Row gutter={[16, 24]}>
          <Col span={12}>
            <div className="flex items-center gap-2 mb-2">
              <MailOutlined className="text-primary-dark" />
              <span className="font-semibold">Email:</span>
            </div>
            <div className="ml-7">{user.email}</div>
          </Col>
          <Col span={12}>
            <div className="flex items-center gap-2 mb-2">
              <PhoneOutlined className="text-primary-dark" />
              <span className="font-semibold">Phone:</span>
            </div>
            <div className="ml-7">
              {user.phoneNumber || <span className="text-gray-400">N/A</span>}
            </div>
          </Col>
          <Col span={12}>
            <div className="flex items-center gap-2 mb-2">
              <IdcardOutlined className="text-primary-dark" />
              <span className="font-semibold">Passport Number:</span>
            </div>
            <div className="ml-7">
              {user.passportNumber || (
                <span className="text-gray-400">N/A</span>
              )}
            </div>
          </Col>
          <Col span={12}>
            <div className="flex items-center gap-2 mb-2">
              <FlagOutlined className="text-primary-dark" />
              <span className="font-semibold">Nationality:</span>
            </div>
            <div className="ml-7">
              {user.nationality || <span className="text-gray-400">N/A</span>}
            </div>
          </Col>
        </Row>
        <Divider />
        <div className="text-center text-gray-500 text-xs mt-2">
          User ID: {user.userId}
        </div>
      </Card>
      <ManageUserModal
        visible={showEditModal}
        setVisible={setShowEditModal}
        callback={fetchUser}
        isEdit={true}
        userIdToEdit={user.userId}
      />
    </div>
  );
};

export default UserDetail;
