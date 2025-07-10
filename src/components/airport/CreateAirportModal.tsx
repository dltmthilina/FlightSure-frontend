import React, { useState } from "react";
import { Modal, Button, Form as AntForm, message, Form, Select } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import CommonTextInput from "../common/CommonTextInput";
import useApi from "../../hooks/use-api";
import timezones from "timezones-list";

const timezoneOptions = timezones.map((tz) => ({
  label: tz.label, // e.g., "(UTC+05:30) Asia/Colombo"
  value: tz.tzCode, // e.g., "Asia/Colombo"
}));

// Validation schema
const AirportSchema = Yup.object().shape({
  code: Yup.string().required("Airport code is required"),
  name: Yup.string().required("Airport name is required"),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
  timeZone: Yup.string().required("Time zone is required"),
});

type ModalProps = {
  callback: () => void;
};

const CreateAirportModal = ({ callback }: ModalProps) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const api = useApi();

  const handleSubmit = async (values: any, { resetForm }: any) => {
    const airportId =
      "AP" + Date.now() + Math.random().toString(36).substr(2, 5);
    await api
      .post(
        "/airports",
        { ...values, airportId },
        {
          onErrorMessage: "Failed to create airport",
          onSuccessMessage: "Airport created successfully",
        }
      )
      .then(() => callback());
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
        initialValues={{
          code: "",
          name: "",
          city: "",
          country: "",
          timeZone: "",
        }}
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
          setFieldValue,
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
                <AntForm.Item label="Time zone">
                  <Select
                    value={values.timeZone}
                    onChange={(val) => setFieldValue("timeZone", val)}
                    onBlur={handleBlur}
                    placeholder="Select airport time zone"
                  >
                    {timezoneOptions.map((tz) => (
                      <Select.Option
                        key={tz.value}
                        value={tz.value}
                        label={tz.label}
                      >
                        {tz.label}
                      </Select.Option>
                    ))}
                  </Select>

                  {touched.timeZone && errors.timeZone && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.timeZone}
                    </div>
                  )}
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
