import React, { useEffect, useState } from "react";
import { Modal, Button, Form as AntForm, Select, Form } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import CommonTextInput from "../common/CommonTextInput";
import useApi from "../../hooks/use-api";
import { User, UserType, UserStatus, ApiResponse } from "../../types";
import Loader from "../common/Loader";

const { Option } = Select;

const UserSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string(),
  role: Yup.string().required("Role is required"),
  passportNumber: Yup.string(),
  status: Yup.string().required("Status is required"),
  password: Yup.string().when("isEdit", {
    is: false,
    then: (schema) =>
      schema
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
  confirmPassword: Yup.string().when("isEdit", {
    is: false,
    then: (schema) =>
      schema
        .required("Confirm password is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

type ModalProps = {
  user?: User;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  callback: () => void;
  isEdit: boolean;
  userIdToEdit?: string;
};

const ManageUserModal = ({
  userIdToEdit,
  callback,
  isEdit,
  visible,
  setVisible,
  user
}: ModalProps) => {
  const [userData, setUserData] = useState<User>(user ?? {
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "" as UserType,
    passportNumber: "",
    nationality: "",
    status: UserStatus.Active,
    createdAt: "",
  });
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (isEdit && userIdToEdit) {
        await getSelectedUserData();
      }
      setLoading(false);
    };
    fetchData();
    
  }, [userIdToEdit]);

  const getSelectedUserData = async () => {
    const res = await api.get<ApiResponse<User>>(`/users/${userIdToEdit}`);
    if (res) {
      setUserData(res.data);
    }
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    if (isEdit && userIdToEdit) {
      await api
        .put(`/users/${userIdToEdit}`, values, {
          onErrorMessage: "Failed to update user",
          onSuccessMessage: "User updated successfully",
        })
        .then(() => callback());
      resetForm();
      setVisible(false);
      return;
    }
    await api
      .post("/users", values, {
        onErrorMessage: "Failed to create user",
        onSuccessMessage: "User created successfully",
      })
      .then(() => callback());

    resetForm();
    setVisible(false);
  };

  return (
    <>
      {!isEdit && (
        <Button
          type="primary"
          className="bg-primary-dark"
          onClick={() => setVisible(true)}
        >
          Add New User
        </Button>
      )}
      {loading ? (
        <Loader />
      ) : (
        <Formik
          enableReinitialize
          initialValues={{
            firstName: userData?.firstName ?? "",
            lastName: userData?.lastName ?? "",
            email: userData?.email ?? "",
            phoneNumber: userData?.phoneNumber ?? "",
            role: userData?.role ?? "",
            passportNumber: userData?.passportNumber ?? "",
            nationality: userData?.nationality ?? "",
            status: userData?.status ?? UserStatus.Active,
            password: "",
            confirmPassword: "",
            isEdit: isEdit,
          }}
          validationSchema={UserSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleSubmit,
            isSubmitting,
            errors,
            handleBlur,
            handleChange,
            touched,
            resetForm,
            values,
            setFieldValue,
          }) => {
            const handleClose = () => {
              resetForm();
              form.resetFields();
              setVisible(false);
            };

            return (
              <Modal
                className="max-h-[600px] overflow-hidden"
                title={isEdit ? "Update User" : "Create New User"}
                open={visible}
                onCancel={handleClose}
                footer={null}
              >
                <Form
                  className="overflow-y-scroll h-[500px]"
                  onSubmitCapture={handleSubmit}
                  form={form}
                  layout="vertical"
                >
                  <AntForm.Item label="First Name">
                    <CommonTextInput
                      value={values.firstName}
                      onChange={handleChange}
                      name="firstName"
                      helperText={
                        touched.firstName ? errors.firstName : undefined
                      }
                      onBlur={handleBlur}
                    />
                  </AntForm.Item>
                  <AntForm.Item label="Last Name">
                    <CommonTextInput
                      value={values.lastName}
                      onChange={handleChange}
                      name="lastName"
                      helperText={
                        touched.lastName ? errors.lastName : undefined
                      }
                      onBlur={handleBlur}
                    />
                  </AntForm.Item>
                  <AntForm.Item label="Email">
                    <CommonTextInput
                      value={values.email}
                      onChange={handleChange}
                      name="email"
                      helperText={touched.email ? errors.email : undefined}
                      onBlur={handleBlur}
                    />
                  </AntForm.Item>
                  <AntForm.Item label="Phone Number">
                    <CommonTextInput
                      value={values.phoneNumber}
                      onChange={handleChange}
                      name="phoneNumber"
                      helperText={
                        touched.phoneNumber ? errors.phoneNumber : undefined
                      }
                      onBlur={handleBlur}
                    />
                  </AntForm.Item>
                  <AntForm.Item label="Role">
                    <Select
                      value={values.role}
                      onChange={(val) => setFieldValue("role", val)}
                      onBlur={handleBlur}
                      placeholder="Select role"
                    >
                      <Option value={UserType.Admin}>Admin</Option>
                      <Option value={UserType.Operator}>Operator</Option>
                      <Option value={UserType.Customer}>Customer</Option>
                    </Select>
                    {touched.role && errors.role && (
                      <div className="text-red-600 text-sm mt-1">
                        {errors.role}
                      </div>
                    )}
                  </AntForm.Item>
                  <AntForm.Item label="Passport Number">
                    <CommonTextInput
                      value={values.passportNumber}
                      onChange={handleChange}
                      name="passportNumber"
                      helperText={
                        touched.passportNumber
                          ? errors.passportNumber
                          : undefined
                      }
                      onBlur={handleBlur}
                    />
                  </AntForm.Item>
                  <AntForm.Item label="Status">
                    <Select
                      value={values.status}
                      onChange={(val) => setFieldValue("status", val)}
                      onBlur={handleBlur}
                      placeholder="Select status"
                    >
                      <Option value={UserStatus.Active}>Active</Option>
                      <Option value={UserStatus.Inactive}>Inactive</Option>
                    </Select>
                    {touched.status && errors.status && (
                      <div className="text-red-600 text-sm mt-1">
                        {errors.status}
                      </div>
                    )}
                  </AntForm.Item>
                  {!isEdit && (
                    <>
                      <AntForm.Item label="Password">
                        <CommonTextInput
                          type="password"
                          value={values.password}
                          onChange={handleChange}
                          name="password"
                          helperText={
                            touched.password ? errors.password : undefined
                          }
                          onBlur={handleBlur}
                        />
                      </AntForm.Item>
                      <AntForm.Item label="Confirm Password">
                        <CommonTextInput
                          type="password"
                          value={values.confirmPassword}
                          onChange={handleChange}
                          name="confirmPassword"
                          helperText={
                            touched.confirmPassword
                              ? errors.confirmPassword
                              : undefined
                          }
                          onBlur={handleBlur}
                        />
                      </AntForm.Item>
                    </>
                  )}
                  <div style={{ textAlign: "right" }}>
                    <Button onClick={handleClose} style={{ marginRight: 8 }}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      className="bg-primary-dark"
                      htmlType="submit"
                      loading={isSubmitting}
                    >
                      {isEdit ? "Update" : "Create"}
                    </Button>
                  </div>
                </Form>
              </Modal>
            );
          }}
        </Formik>
      )}
    </>
  );
};

export default ManageUserModal;
