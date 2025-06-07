import React, { useState } from "react";
import { Modal, Button, Form as AntForm, message, Form } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import CommonTextInput from "../common/CommonTextInput";
import useApi from "../../hooks/use-api";

// Validation schema
const AirportSchema = Yup.object().shape({
  code: Yup.string().required("Airport code is required"),
  name: Yup.string().required("Airport name is required"),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
});

const CreateAirportModal: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const api = useApi();

  const handleSubmit = async (values: any, { resetForm }: any) => {
    console.log("Submitted Airport:", values);
    await api.post("/airports", values, {
      onErrorMessage: "Failed to create airport",
      onSuccessMessage: "Airport created successfully",
    });
    resetForm();
    setVisible(false);
  };

  return (
    <>
      <Button
        type="primary"
        className="bg-primary-dark"
        onClick={() => setVisible(true)}
      >
        Add New Airport
      </Button>

      <Formik
        initialValues={{ code: "", name: "", city: "", country: "" }}
        validationSchema={AirportSchema}
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
        }) => {
          const handleClose = () => {
            resetForm(); // Reset Formik state
            form.resetFields(); // Optional: reset AntD form fields if needed
            setVisible(false); // Close modal
          };
          return (
            <Modal
              title="Create New Airport"
              open={visible}
              onCancel={handleClose}
              footer={null}
            >
              <Form
                onSubmitCapture={handleSubmit}
                form={form}
                layout="vertical"
              >
                <AntForm.Item label="Airport Code">
                  <CommonTextInput
                    value={values.code}
                    onChange={handleChange}
                    name="code"
                    helperText={touched.code ? errors.code : undefined}
                    onBlur={handleBlur}
                  />
                </AntForm.Item>

                <AntForm.Item label="Airport Name">
                  <CommonTextInput
                    value={values.name}
                    onChange={handleChange}
                    name="name"
                    helperText={touched.name ? errors.name : undefined}
                    onBlur={handleBlur}
                  />
                </AntForm.Item>

                <AntForm.Item label="City">
                  <CommonTextInput
                    value={values.city}
                    onChange={handleChange}
                    name="city"
                    helperText={touched.city ? errors.city : undefined}
                    onBlur={handleBlur}
                  />
                </AntForm.Item>

                <AntForm.Item label="Country">
                  <CommonTextInput
                    value={values.country}
                    onChange={handleChange}
                    name="country"
                    helperText={touched.country ? errors.country : undefined}
                    onBlur={handleBlur}
                  />
                </AntForm.Item>

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
                    Create
                  </Button>
                </div>
              </Form>
            </Modal>
          );
        }}
      </Formik>
    </>
  );
};

export default CreateAirportModal;
