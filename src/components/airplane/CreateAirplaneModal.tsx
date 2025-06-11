import React, { useEffect, useState } from "react";
import { Modal, Button, Form as AntForm, Select, message, Form } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import CommonTextInput from "../common/CommonTextInput";
import useApi from "../../hooks/use-api";
import { Airport } from "../../types";

const { Option } = Select;

const AirplaneSchema = Yup.object().shape({
  model: Yup.string().required("Model is required"),
  category: Yup.string().required("Category is required"),
  capacityBusiness: Yup.number()
    .typeError("Must be a number")
    .min(0)
    .required("Business capacity is required"),
  capacityFirst: Yup.number()
    .typeError("Must be a number")
    .min(0)
    .required("First class capacity is required"),
  capacityEconomy: Yup.number()
    .typeError("Must be a number")
    .min(0)
    .required("Economy capacity is required"),
  initialLocation: Yup.string().required("Initial location is required"),
  manufacturer: Yup.string().required("Manufacturer is required"),
});

type ModalProps = {
  callback: () => void;
};

const CreateAirplaneModal = ({ callback }: ModalProps) => {
  const [visible, setVisible] = useState(false);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [form] = Form.useForm();
  const api = useApi();

  useEffect(() => {
    getAirports();
  }, []);

  const getAirports = async () => {
    const res = await api.get(`/airports`);
    if (Array.isArray(res)) {
      setAirports(res);
    }
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    console.log(values);
    await api
      .post("/airplanes", values, {
        onErrorMessage: "Failed to create airplane",
        onSuccessMessage: "Airplane created successfully",
      })
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
        Add New Airplane
      </Button>

      <Formik
        initialValues={{
          regNumber: "",
          model: "",
          category: "",
          capacityBusiness: "",
          capacityFirst: "",
          capacityEconomy: "",
          initialLocation: "",
          manufacturer: "",
        }}
        validationSchema={AirplaneSchema}
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
              title="Create New Airplane"
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
                <AntForm.Item label="Registration Number">
                  <CommonTextInput
                    value={values.regNumber}
                    onChange={handleChange}
                    name="regNumber"
                    helperText={
                      touched.regNumber ? errors.regNumber : undefined
                    }
                    onBlur={handleBlur}
                  />
                </AntForm.Item>
                <AntForm.Item label="Model">
                  <CommonTextInput
                    value={values.model}
                    onChange={handleChange}
                    name="model"
                    helperText={touched.model ? errors.model : undefined}
                    onBlur={handleBlur}
                  />
                </AntForm.Item>

                <AntForm.Item label="Category">
                  <CommonTextInput
                    value={values.category}
                    onChange={handleChange}
                    name="category"
                    helperText={touched.category ? errors.category : undefined}
                    onBlur={handleBlur}
                  />
                </AntForm.Item>

                <AntForm.Item label="Business Class Capacity">
                  <CommonTextInput
                    type="number"
                    value={values.capacityBusiness}
                    onChange={handleChange}
                    name="capacityBusiness"
                    helperText={
                      touched.capacityBusiness
                        ? errors.capacityBusiness
                        : undefined
                    }
                    onBlur={handleBlur}
                  />
                </AntForm.Item>

                <AntForm.Item label="First Class Capacity">
                  <CommonTextInput
                    type="number"
                    value={values.capacityFirst}
                    onChange={handleChange}
                    name="capacityFirst"
                    helperText={
                      touched.capacityFirst ? errors.capacityFirst : undefined
                    }
                    onBlur={handleBlur}
                  />
                </AntForm.Item>

                <AntForm.Item label="Economy Class Capacity">
                  <CommonTextInput
                    type="number"
                    value={values.capacityEconomy}
                    onChange={handleChange}
                    name="capacityEconomy"
                    helperText={
                      touched.capacityEconomy
                        ? errors.capacityEconomy
                        : undefined
                    }
                    onBlur={handleBlur}
                  />
                </AntForm.Item>

                <AntForm.Item label="Initial Location">
                  <Select
                    value={values.initialLocation}
                    onChange={(val) => {
                      setFieldValue("initialLocation", val);
                    }}
                    onBlur={handleBlur}
                    placeholder="Select airplane initial location"
                  >
                    {airports.map((airport) => (
                      <Option key={airport.code} value={airport.airportId}>
                        {airport.name}
                      </Option>
                    ))}
                  </Select>
                  {touched.initialLocation && errors.initialLocation && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.initialLocation}
                    </div>
                  )}
                </AntForm.Item>

                <AntForm.Item label="Manufacturer">
                  <Select
                    value={values.manufacturer}
                    onChange={(val) => setFieldValue("manufacturer", val)}
                    onBlur={handleBlur}
                    placeholder="Select manufacturer"
                  >
                    <Option value="Airbus">Airbus</Option>
                    <Option value="Boeing">Boeing</Option>
                    <Option value="Embraer">Embraer</Option>
                    <Option value="Bombardier">Bombardier</Option>
                  </Select>
                  {touched.manufacturer && errors.manufacturer && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.manufacturer}
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

export default CreateAirplaneModal;
