import React, { useEffect, useState } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  InputNumber,
  Card,
} from "antd";
import useApi from "../../hooks/use-api";
import {
  calculateDuration,
  formatMinutesToHours,
  generateFlightId,
  generateFlightLegId,
} from "../../utils/common";
import { Airplane, Airport, ApiResponse } from "../../types";
import { airlines } from "../../utils/const";
import FlightLegsSection from "../../components/flight/FlightLegsSection";

const { Option } = Select;

const FlightSchema = Yup.object().shape({
  flightNumber: Yup.string().required("Flight number is required"),
  airline: Yup.string().required("Airline is required"),
  airplaneId: Yup.string().required("Airplane is required"),
  originId: Yup.string().required("Origin airport is required"),
  destinationId: Yup.string().required("Destination airport is required"),
  departureTime: Yup.string().required("Departure time is required"),
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
  flightLegs: Yup.array()
    .of(
      Yup.object().shape({
        legOriginId: Yup.string().required("Leg origin is required"), // Different field name
        legDestinationId: Yup.string().required("Leg destination is required"), // Different field name
        legDepartureTime: Yup.string().required(
          "Leg departure time is required"
        ), // Different field name
        legArrivalTime: Yup.string().required("Leg arrival time is required"), // Different field name
        transitDuration: Yup.number().min(0, "Must be positive or zero"),
      })
    )
    .test(
      "flight-legs-consistency",
      "Flight legs validation failed",
      function (flightLegs) {
        const { originId, destinationId } = this.parent;
        if (!flightLegs || flightLegs.length === 0) {
          return true; // No legs to validate (direct flight)
        }

        // 1. First leg origin must match main flight origin

        if (flightLegs[0]?.legOriginId !== originId) {
          return this.createError({
            path: "flightLegs[0].legOriginId",
            message: "First leg origin must match main flight origin",
          });
        }

        // 2. Last leg destination must match main flight destination
        const lastLeg = flightLegs[flightLegs.length - 1];
        if (lastLeg?.legDestinationId !== destinationId) {
          return this.createError({
            path: `flightLegs[${flightLegs.length - 1}].legDestinationId`,
            message: "Last leg destination must match main flight destination",
          });
        }

        // 3. Each leg destination must match next leg origin (for connecting flights)
        for (let i = 0; i < flightLegs.length - 1; i++) {
          if (
            flightLegs[i]?.legDestinationId !== flightLegs[i + 1]?.legOriginId
          ) {
            return this.createError({
              path: `flightLegs[${i + 1}].legOriginId`,
              message: `Leg ${i + 2} origin must match leg ${
                i + 1
              } destination`,
            });
          }
        }

        return true; // All checks passed
      }
    ),
});

const CreateFlightPage = () => {
  const api = useApi();
  const [airports, setAirports] = useState<Airport[]>([]);
  const [airplanes, setAirplanes] = useState<Airplane[]>([]);
  const [selectedTimezones, setSelectedTimeZones] = useState({
    originTimezone: "",
    destinationTimezone: "",
  });

  useEffect(() => {
    getAirPlanes();
    getAirports();
  }, []);

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
            airline: "",
            flightNumber: "",
            airplaneId: "",
            originId: "",
            destinationId: "",
            departureTime: "",
            arrivalTime: "",
            duration: 0,
            status: "SCHEDULED",
            economySeats: 0,
            businessSeats: 0,
            firstSeats: 0,
            economyPrice: 0,
            businessPrice: 0,
            firstPrice: 0,
            flightLegs: [],
          }}
          validationSchema={FlightSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const flightId = generateFlightId(values.airline);
            const flightData = {
              ...values,
              flightId,
              flightLegs: values.flightLegs.map((leg: any, index: number) => ({
                legId: generateFlightLegId(values.airline),
                flightId,
                originId: leg.legOriginId, // Map back to backend field names
                destinationId: leg.legDestinationId, // Map back to backend field names
                departureTime: leg.legDepartureTime, // Map back to backend field names
                arrivalTime: leg.legArrivalTime, // Map back to backend field names
                legOrder: index + 1,
                transitDuration: leg.legTransitDuration,
              })),
            };
            await api.post("/flights", flightData, {
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
            setStatus,
            status,
          }) => (
            <FormikForm>
              <Form.Item label="Airline" layout="vertical">
                <Select
                  value={values.airline}
                  onChange={(val) => {
                    setFieldValue("airline", val);
                  }}
                  onBlur={handleBlur}
                  placeholder="Select airline"
                >
                  {airlines.map((airline) => (
                    <Option key={airline.code} value={airline.code}>
                      {airline.name} ({airline.code})
                    </Option>
                  ))}
                </Select>
                {touched.airline && errors.airline && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.airline}
                  </div>
                )}
              </Form.Item>

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
                  value={values.originId}
                  onChange={(val) => {
                    const selectedAirport = airports.find(
                      (a) => a.airportId === val
                    );
                    setSelectedTimeZones((pre) => ({
                      ...pre,
                      originTimezone: selectedAirport?.timeZone ?? "",
                    }));
                    setFieldValue("originId", val);
                  }}
                  onBlur={handleBlur}
                  placeholder="Select origin airport"
                >
                  {airports
                    .filter((airport) => airport.code !== values.destinationId)
                    .map((airport) => (
                      <Option key={airport.code} value={airport.airportId}>
                        {airport.name} - {airport.code}
                      </Option>
                    ))}
                </Select>
                {touched.originId && errors.originId && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.originId}
                  </div>
                )}
              </Form.Item>

              <Form.Item label="Destination" layout="vertical">
                <Select
                  value={values.destinationId}
                  onChange={(val) => {
                    const selectedAirport = airports.find(
                      (a) => a.airportId === val
                    );
                    setSelectedTimeZones((pre) => ({
                      ...pre,
                      destinationTimezone: selectedAirport?.timeZone ?? "",
                    }));
                    setFieldValue("destinationId", val);
                  }}
                  onBlur={handleBlur}
                  placeholder="Select destination airport"
                >
                  {airports
                    .filter((airport) => airport.code !== values.originId)
                    .map((airport) => (
                      <Option key={airport.code} value={airport.airportId}>
                        {airport.name} - {airport.code}
                      </Option>
                    ))}
                </Select>
                {touched.destinationId && errors.destinationId && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.destinationId}
                  </div>
                )}
              </Form.Item>

              <Form.Item label="Departure Date & Time" layout="vertical">
                <DatePicker
                  showTime
                  className="mr-2"
                  onChange={(_, dateString) => {
                    setFieldValue("departureTime", dateString);
                    if (dateString && values.arrivalTime) {
                      setFieldValue(
                        "duration",
                        calculateDuration(
                          Array.isArray(dateString)
                            ? dateString[0] ?? ""
                            : dateString,
                          values.arrivalTime
                        )
                      );
                    }
                  }}
                />
                {touched.departureTime && errors.departureTime && (
                  <div className="text-red-500 text-xs">
                    {errors.departureTime}
                  </div>
                )}
              </Form.Item>
              <Form.Item label="Arrival Date & Time" layout="vertical">
                <DatePicker
                  showTime
                  className="mr-2"
                  onChange={(_, dateString) => {
                    setFieldValue("arrivalTime", dateString);
                    const arrivalStr = Array.isArray(dateString)
                      ? dateString[0]
                      : dateString;
                    if (arrivalStr && values.departureTime) {
                      console.log(arrivalStr, values.departureTime);
                      setFieldValue(
                        "duration",
                        calculateDuration(values.departureTime, arrivalStr)
                      );
                    }
                  }}
                />
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
                    setFieldValue("airplaneId", val.toString());
                    const res = await api.get<ApiResponse<string>>(
                      `/flights/${val}/current-location?departureTime=${values.departureTime}`
                    );

                    if (res?.data) {
                      console.log(res.data, typeof values.originId);
                      if (res.data !== values.originId.toString()) {
                        setStatus({
                          airplaneId:
                            "Selected airplane is not at the flight origin.",
                        });
                      } else {
                        setStatus("");
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
                {status?.airplaneId && (
                  <div className="text-red-600 text-sm mt-1">
                    {status.airplaneId}
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
              <FlightLegsSection
                values={values}
                errors={errors}
                touched={touched}
                setFieldValue={setFieldValue}
                airports={airports}
              />
              <Form.Item>
                <Button
                  onClick={() => console.log(errors)}
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
