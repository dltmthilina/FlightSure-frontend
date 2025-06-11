import React, { useState } from "react";
import {
  Modal,
  Button,
  Form as AntForm,
  DatePicker,
  Select,
  message,
  Form,
} from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import CommonTextInput from "../common/CommonTextInput";
import useApi from "../../hooks/use-api";
import { Airplane, Airport } from "../../types";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;

const FlightSchema = Yup.object().shape({
  flightNumber: Yup.string().required("Flight No is required"),
  origin: Yup.string().required("Origin is required"),
  destination: Yup.string().required("Destination is required"),
  departureTime: Yup.date().required("Departure time is required"),
  arrivalTime: Yup.date().required("Arrival time is required"),
  airplaneId: Yup.string().required("Airplane Registration Number is required"),
});

type Props = {
  airplaneList: Airplane[];
  airportList: Airport[]; // pass a list of regNumbers from parent
  callback: () => void;
};

const CreateFlightModal = ({ airportList, callback, airplaneList }: Props) => {
  const [visible, setVisible] = useState(false);
  const [selectedTimezones, setSelectedTimeZones] = useState({
    originTimezone: "",
    destinationTimezone: "",
  });
  const [form] = Form.useForm();
  const api = useApi();

  const handleSubmit = async (values: any, { resetForm }: any) => {
    await api
      .post("/flights", values, {
        onErrorMessage: "Failed to create flight",
        onSuccessMessage: "Flight created successfully",
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
        Add New Flight
      </Button>

      <Formik
        initialValues={{
          flightNumber: "",
          origin: "",
          destination: "",
          departureTime: "",
          arrivalTime: "",
          airplaneId: "",
        }}
        validationSchema={FlightSchema}
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
              title="Create New Flight"
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
                <AntForm.Item label="Flight No">
                  <CommonTextInput
                    placeholder="Enter flight number"
                    name="flightNumber"
                    value={values.flightNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={
                      touched.flightNumber ? errors.flightNumber : undefined
                    }
                  />
                </AntForm.Item>

                <AntForm.Item label="Origin">
                  <Select
                    value={values.origin}
                    onChange={(val) => {
                      const selectedAirport = airportList.find(
                        (a) => a.code === val
                      );
                      setSelectedTimeZones((pre) => ({
                        ...pre,
                        originTimezone: selectedAirport?.timeZone ?? "",
                      }));
                      setFieldValue("origin", val);
                    }}
                    onBlur={handleBlur}
                    placeholder="Select origin airport"
                  >
                    {airportList
                      .filter((airport) => airport.code !== values.destination)
                      .map((airport) => (
                        <Option key={airport.code} value={airport.code}>
                          {airport.name}
                        </Option>
                      ))}
                  </Select>
                  {touched.origin && errors.origin && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.origin}
                    </div>
                  )}
                </AntForm.Item>

                <AntForm.Item label="Destination">
                  <Select
                    value={values.destination}
                    onChange={(val) => {
                      const selectedAirport = airportList.find(
                        (a) => a.code === val
                      );
                      setSelectedTimeZones((pre) => ({
                        ...pre,
                        destinationTimezone: selectedAirport?.timeZone ?? "",
                      }));
                      setFieldValue("destination", val);
                    }}
                    onBlur={handleBlur}
                    placeholder="Select destination airport"
                  >
                    {airportList
                      .filter((airport) => airport.code !== values.origin)
                      .map((airport) => (
                        <Option key={airport.code} value={airport.code}>
                          {airport.name}
                        </Option>
                      ))}
                  </Select>
                  {touched.destination && errors.destination && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.destination}
                    </div>
                  )}
                </AntForm.Item>

                <AntForm.Item label="Departure Time">
                  <DatePicker
                    placeholder="Select departure date and time"
                    showTime
                    style={{ width: "100%" }}
                    value={
                      values.departureTime
                        ? dayjs
                            .utc(values.departureTime)
                            .tz(selectedTimezones.originTimezone)
                            .local()
                        : null
                    }
                    onChange={(val) =>
                      setFieldValue(
                        "departureTime",
                        dayjs
                          .tz(val, selectedTimezones.originTimezone)
                          .utc()
                          .format()
                      )
                    }
                    onBlur={handleBlur}
                  />
                  {touched.departureTime && errors.departureTime && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.departureTime}
                    </div>
                  )}
                </AntForm.Item>

                <AntForm.Item label="Arrival Time">
                  <DatePicker
                    placeholder="Select arraival date and time"
                    showTime
                    style={{ width: "100%" }}
                    value={
                      values.arrivalTime
                        ? dayjs
                            .utc(values.arrivalTime)
                            .tz(selectedTimezones.destinationTimezone)
                            .local()
                        : null
                    }
                    onChange={(val) => {
                      if (val) {
                        const utcTime = dayjs
                          .tz(val, selectedTimezones.destinationTimezone)
                          .utc()
                          .toISOString();
                        setFieldValue("arrivalTime", utcTime);
                      } else {
                        setFieldValue("arrivalTime", "");
                      }
                    }}
                    onBlur={handleBlur}
                  />
                  {touched.arrivalTime && errors.arrivalTime && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.arrivalTime}
                    </div>
                  )}
                </AntForm.Item>

                <AntForm.Item label="Airplane Registration Number">
                  <Select
                    value={values.airplaneId}
                    onChange={(val) => setFieldValue("airplaneId", val)}
                    onBlur={handleBlur}
                    placeholder="Select Airplane"
                  >
                    {airplaneList.map((airplane) => (
                      <Option
                        key={airplane.regNumber}
                        value={airplane.airplaneId}
                      >
                        {airplane.regNumber}
                      </Option>
                    ))}
                  </Select>
                  {touched.airplaneId && errors.airplaneId && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.airplaneId}
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

export default CreateFlightModal;
