import React, { useEffect, useState } from "react";
import { Modal, Button, Form as AntForm, Select, message, Form } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import CommonTextInput from "../common/CommonTextInput";
import useApi from "../../hooks/use-api";
import { Airplane, Airport, ApiResponse } from "../../types";
import Loader from "../common/Loader";

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
  initialLocationId: Yup.string().required("Initial location is required"),
  manufacturer: Yup.string().required("Manufacturer is required"),
});

type ModalProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  callback: () => void;
  isEdit: boolean;
  airplaneIdToEdit?: number | string;
};

const ManageAirplaneModal = ({
  airplaneIdToEdit,
  callback,
  isEdit,
  visible,
  setVisible,
}: ModalProps) => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [airplaneData, setAirplaneData] = useState<Airplane>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getAirports();
      if (isEdit && airplaneIdToEdit) {
        await getSelectedAirplaneDate();
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, [airplaneIdToEdit]);

  const getSelectedAirplaneDate = async () => {

    const res = await api.get<ApiResponse<Airplane>>(
      `/airplanes/${airplaneIdToEdit}`
    );
    if (res) {
      setAirplaneData(res.data);
    }
  };

  const getAirports = async () => {
    const res = await api.get(`/airports`);
    if (Array.isArray(res)) {
      setAirports(res);
    }
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    if (isEdit && airplaneIdToEdit) {
      await api
        .put(`/airplanes/${airplaneIdToEdit}`, values, {
          onErrorMessage: "Failed to update airplane",
          onSuccessMessage: "Airplane updated successfully",
        })
        .then(() => callback());
      resetForm();
      setVisible(false);
      return;
    }
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
      {!isEdit && (
        <Button
          type="primary"
          className="bg-primary-dark"
          onClick={() => setVisible(true)}
        >
          Add New Airplane
        </Button>
      )}
      {loading ? <Loader /> : (
        <Formik
          enableReinitialize
          initialValues={{
            regNumber: airplaneData?.regNumber ?? "",
            model: airplaneData?.model ?? "",
            category: airplaneData?.category ?? "",
            capacityBusiness: airplaneData?.capacityBusiness ?? "",
            capacityFirst: airplaneData?.capacityFirst ?? "",
            capacityEconomy: airplaneData?.capacityEconomy ?? "",
            initialLocationId: airplaneData?.initialLocationId ?? "",
            manufacturer: airplaneData?.manufacturer ?? "",
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
                title={isEdit ? "Update airplane" : "Create New Airplane"}
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
                      value={parseInt(values.initialLocationId) || undefined}
                      onChange={(val) => {
                        setFieldValue("initialLocationId", val);
                      }}
                      onBlur={handleBlur}
                      placeholder="Select airplane initial location"
                      options={airports.map((airport) => ({
                        label: airport.name,
                        value: airport.airportId,
                      }))}
                    />
                    {touched.initialLocationId && errors.initialLocationId && (
                      <div className="text-red-600 text-sm mt-1">
                        {errors.initialLocationId}
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
                      {isEdit ? "Update" : " Create"}
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

export default ManageAirplaneModal;
