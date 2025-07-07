import React, { useEffect, useState } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Select,
  InputNumber,
  Card,
} from "antd";
import useApi from "../../hooks/use-api";
import { useNavigate } from "react-router-dom";
import { calculateDuration, formatMinutesToHours } from "../../utils/common";
import { Airplane, Airport, ApiResponse } from "../../types";

const { Option } = Select;

const FlightSchema = Yup.object().shape({
  flightNumber: Yup.string().required("Flight number is required"),
  airline: Yup.string().required("Airline is required"),
  airplane: Yup.string().required("Airplane is required"),
  origin: Yup.string().required("Origin airport is required"),
  destination: Yup.string().required("Destination airport is required"),
  departureDate: Yup.string().required("Departure date is required"),
  departureTime: Yup.string().required("Departure time is required"),
  arrivalDate: Yup.string().required("Arrival date is required"),
  arrivalTime: Yup.string().required("Arrival time is required"),
  duration: Yup.number()
    .required("Duration is required")
    .min(1, "Must be positive"),
  status: Yup.string().required("Status is required"),
  economySeats: Yup.number().required().min(0),
  businessSeats: Yup.number().required().min(0),
  firstSeats: Yup.number().required().min(0),
  economyPrice: Yup.number().required().min(0),
  businessPrice: Yup.number().required().min(0),
  firstPrice: Yup.number().required().min(0),
});

const CreateFlightPage = () => {
    const api = useApi();
    const navigate = useNavigate();
    const [airports, setAirports] = useState<Airport[]>([]);
    const [airplanes, setAirplanes] = useState<Airplane[]>([]);
     const [selectedTimezones, setSelectedTimeZones] = useState({
        originTimezone: "",
        destinationTimezone: "",
      });

    useEffect(() => {
        getAirPlanes();
        getAirports();
     },[]);
    

    const getAirports = async () => {
      const res: any = await api.get("/airports");
      if (res && Array.isArray(res)) {
        setAirports(res);
      }
    };

    const getAirPlanes = async () => {
      const res: any = await api.get("airplanes");
      if (res && Array.isArray(res.data)) {
        setAirplanes(res.data);
      }
    };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-10">
      <Card className="w-full max-w-2xl shadow-xl rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create New Flight
        </h2>
        <Formik
          initialValues={{
            flightNumber: "",
            airplaneId: "",
            origin: "",
            destination: "",
            departureDate: "",
            departureTime: "",
            arrivalDate: "",
            arrivalTime: "",
            duration: 0,
            status: "SCHEDULED",
            economySeats: 0,
            businessSeats: 0,
            firstSeats: 0,
            economyPrice: 0,
            businessPrice: 0,
            firstPrice: 0,
          }}
          validationSchema={FlightSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await api.post("/flights", values, {
              onErrorMessage: "Failed to create flight",
              onSuccessMessage: "Flight created successfully",
            });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            isSubmitting,
            setFieldError,
          }) => (
            <FormikForm>
              <Form.Item
                layout="vertical"
                label="Flight Number"
                validateStatus={
                  touched.flightNumber && errors.flightNumber ? "error" : ""
                }
                help={touched.flightNumber && errors.flightNumber}
              >
                <Input
                  name="flightNumber"
                  value={values.flightNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>
              <Form.Item label="Origin" layout="vertical">
                <Select
                  value={values.origin}
                  onChange={(val) => {
                    const selectedAirport = airports.find(
                      (a) => a.airportId === val
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
                  {airports
                    .filter((airport) => airport.code !== values.destination)
                    .map((airport) => (
                      <Option key={airport.code} value={airport.airportId}>
                        {airport.name}
                      </Option>
                    ))}
                </Select>
                {touched.origin && errors.origin && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.origin}
                  </div>
                )}
              </Form.Item>

              <Form.Item label="Destination" layout="vertical">
                <Select
                  value={values.destination}
                  onChange={(val) => {
                    const selectedAirport = airports.find(
                      (a) => a.airportId === val
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
                  {airports
                    .filter((airport) => airport.code !== values.origin)
                    .map((airport) => (
                      <Option key={airport.code} value={airport.airportId}>
                        {airport.name}
                      </Option>
                    ))}
                </Select>
                {touched.destination && errors.destination && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.destination}
                  </div>
                )}
              </Form.Item>

              <Form.Item label="Departure Date & Time" layout="vertical">
                <DatePicker
                  className="mr-2"
                  onChange={(_, dateString) => {
                    setFieldValue("departureDate", dateString);
                    if (
                      dateString &&
                      values.departureTime &&
                      values.arrivalDate &&
                      values.arrivalTime
                    ) {
                      const dep = `${dateString}T${values.departureTime}`;
                      const arr = `${values.arrivalDate}T${values.arrivalTime}`;
                      setFieldValue("duration", calculateDuration(dep, arr));
                    }
                  }}
                />
                <TimePicker
                  onChange={(_, timeString) => {
                    setFieldValue("departureTime", timeString);
                    if (
                      values.departureDate &&
                      timeString &&
                      values.arrivalDate &&
                      values.arrivalTime
                    ) {
                      const dep = `${values.departureDate}T${timeString}`;
                      const arr = `${values.arrivalDate}T${values.arrivalTime}`;
                      setFieldValue("duration", calculateDuration(dep, arr));
                    }
                  }}
                />
                {touched.departureDate && errors.departureDate && (
                  <div className="text-red-500 text-xs">
                    {errors.departureDate}
                  </div>
                )}
                {touched.departureTime && errors.departureTime && (
                  <div className="text-red-500 text-xs">
                    {errors.departureTime}
                  </div>
                )}
              </Form.Item>
              <Form.Item label="Arrival Date & Time" layout="vertical">
                <DatePicker
                  className="mr-2"
                  onChange={(_, dateString) =>
                    setFieldValue("arrivalDate", dateString)
                  }
                />
                <TimePicker
                  onChange={(_, timeString) =>
                    setFieldValue("arrivalTime", timeString)
                  }
                />
                {touched.arrivalDate && errors.arrivalDate && (
                  <div className="text-red-500 text-xs">
                    {errors.arrivalDate}
                  </div>
                )}
                {touched.arrivalTime && errors.arrivalTime && (
                  <div className="text-red-500 text-xs">
                    {errors.arrivalTime}
                  </div>
                )}
              </Form.Item>
              <Form.Item
                layout="vertical"
                label="Duration"
                validateStatus={
                  touched.duration && errors.duration ? "error" : ""
                }
                help={touched.duration && errors.duration}
              >
                <InputNumber
                  name="duration"
                  value={formatMinutesToHours(values.duration)}
                  onChange={(val) => setFieldValue("duration", val)}
                />
              </Form.Item>
              <Form.Item label="Airplane Registration Number" layout="vertical">
                <Select
                  value={values.airplaneId}
                  onChange={async (val) => {
                    setFieldValue("airplaneId", val);
                    const res = await api.get<
                      ApiResponse<{ currentLocationId: String }>
                    >(`/${val}/current-location?airplaneId=${val}&departureTime=${values.departureTime}`);
                    if (res?.data.currentLocationId) {
                      if (res.data.currentLocationId !== val) {
                        setFieldValue("airplaneId", ""); // Optionally reset selection
                        // Set error using Formik's setFieldError
                        if (typeof setFieldError === "function") {
                          setFieldError(
                            "airplaneId",
                            "Selected airplane is not at the flight origin."
                          );
                        }
                      } else {
                        // Clear error if locations match
                        if (typeof setFieldError === "function") {
                          setFieldError("airplaneId", undefined);
                        }
                      }
                    }
                  }}
                  onBlur={handleBlur}
                  placeholder="Select Airplane"
                >
                  {airplanes.map((airplane) => (
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
              </Form.Item>
              <Form.Item label="Status" layout="vertical">
                <Select
                  value={values.status}
                  onChange={(val) => setFieldValue("status", val)}
                >
                  <Option value="SCHEDULED">Scheduled</Option>
                  <Option value="DELAYED">Delayed</Option>
                  <Option value="CANCELLED">Cancelled</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Seats & Prices" layout="vertical">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label>Economy Seats</label>
                    <InputNumber
                      name="economySeats"
                      value={values.economySeats}
                      onChange={(val) => setFieldValue("economySeats", val)}
                      min={0}
                      className="w-full"
                    />
                    <label>Economy Price</label>
                    <InputNumber
                      name="economyPrice"
                      value={values.economyPrice}
                      onChange={(val) => setFieldValue("economyPrice", val)}
                      min={0}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label>Business Seats</label>
                    <InputNumber
                      name="businessSeats"
                      value={values.businessSeats}
                      onChange={(val) => setFieldValue("businessSeats", val)}
                      min={0}
                      className="w-full"
                    />
                    <label>Business Price</label>
                    <InputNumber
                      name="businessPrice"
                      value={values.businessPrice}
                      onChange={(val) => setFieldValue("businessPrice", val)}
                      min={0}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label>First Seats</label>
                    <InputNumber
                      name="firstSeats"
                      value={values.firstSeats}
                      onChange={(val) => setFieldValue("firstSeats", val)}
                      min={0}
                      className="w-full"
                    />
                    <label>First Price</label>
                    <InputNumber
                      name="firstPrice"
                      value={values.firstPrice}
                      onChange={(val) => setFieldValue("firstPrice", val)}
                      min={0}
                      className="w-full"
                    />
                  </div>
                </div>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  className="bg-primary-dark w-full"
                >
                  Create Flight
                </Button>
              </Form.Item>
            </FormikForm>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default CreateFlightPage;
