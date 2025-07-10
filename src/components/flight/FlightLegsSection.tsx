import React from "react";
import { FieldArray } from "formik";
import {
  Form,
  Button,
  DatePicker,
  Select,
  InputNumber,
  Card,
  Divider,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Airport } from "../../types";
import dayjs from "dayjs";


const { Option } = Select;

interface FlightLegsSectionProps {
  values: any;
  errors: any;
  touched: any;
  setFieldValue: (field: string, value: any) => void;
  airports: Airport[];
}

const FlightLegsSection: React.FC<FlightLegsSectionProps> = ({
  values,
  errors,
  touched,
  setFieldValue,
  airports,
}) => {
  return (
    <>
      <Divider orientation="left">
        Flight Legs (Stops/Transits)
        <div className="text-sm text-gray-500 font-normal mt-1">
          First leg must start from main origin. Last leg must end at main
          destination.
        </div>
      </Divider>

      <FieldArray name="flightLegs">
        {({ insert, remove, push }) => (
          <div>
            {values.flightLegs?.length > 0 &&
              values.flightLegs.map((leg: any, index: number) => (
                <Card
                  key={index}
                  className="mb-4"
                  size="small"
                  title={`Leg ${index + 1}`}
                  extra={
                    <Button
                      type="text"
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(index)}
                      danger
                    >
                      Remove
                    </Button>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label="Origin Airport" layout="vertical">
                      <Select
                        value={values.flightLegs[index]?.legOriginId}
                        onChange={(val) =>
                          setFieldValue(`flightLegs.${index}.legOriginId`, val)
                        }
                        placeholder="Select origin airport"
                      >
                        {airports.map((airport) => (
                          <Option key={airport.code} value={airport.airportId}>
                            {airport.name} ({airport.code})
                          </Option>
                        ))}
                      </Select>
                      {touched.flightLegs?.[index]?.legOriginId &&
                        errors.flightLegs?.[index]?.legOriginId && (
                          <div className="text-red-600 text-sm mt-1">
                            {errors.flightLegs[index].legOriginId}
                          </div>
                        )}
                    </Form.Item>

                    <Form.Item label="Destination Airport" layout="vertical">
                      <Select
                        value={values.flightLegs[index]?.legDestinationId}
                        onChange={(val) =>
                          setFieldValue(
                            `flightLegs.${index}.legDestinationId`,
                            val
                          )
                        }
                        placeholder="Select destination airport"
                      >
                        {airports.map((airport) => (
                          <Option key={airport.code} value={airport.airportId}>
                            {airport.name} ({airport.code})
                          </Option>
                        ))}
                      </Select>
                      {touched.flightLegs?.[index]?.legDestinationId &&
                        errors.flightLegs?.[index]?.legDestinationId && (
                          <div className="text-red-600 text-sm mt-1">
                            {errors.flightLegs[index].legDestinationId}
                          </div>
                        )}
                    </Form.Item>

                    <Form.Item label="Departure Time" layout="vertical">
                      <DatePicker
                        showTime
                        value={
                          values.flightLegs[index]?.legDepartureTime
                            ? dayjs(values.flightLegs[index].legDepartureTime)
                            : null
                        }
                        onChange={(_, dateString) =>
                          setFieldValue(
                            `flightLegs.${index}.legDepartureTime`,
                            dateString
                          )
                        }
                        className="w-full"
                      />
                      {touched.flightLegs?.[index]?.legDepartureTime &&
                        errors.flightLegs?.[index]?.legDepartureTime && (
                          <div className="text-red-600 text-sm mt-1">
                            {errors.flightLegs[index].legDepartureTime}
                          </div>
                        )}
                    </Form.Item>

                    <Form.Item label="Arrival Time" layout="vertical">
                      <DatePicker
                        showTime
                        value={
                          values.flightLegs[index]?.legArrivalTime
                            ? dayjs(values.flightLegs[index].legArrivalTime)
                            : null
                        }
                        onChange={(_, dateString) =>
                          setFieldValue(
                            `flightLegs.${index}.legArrivalTime`,
                            dateString
                          )
                        }
                        className="w-full"
                      />
                      {touched.flightLegs?.[index]?.legArrivalTime &&
                        errors.flightLegs?.[index]?.legArrivalTime && (
                          <div className="text-red-600 text-sm mt-1">
                            {errors.flightLegs[index].legArrivalTime}
                          </div>
                        )}
                    </Form.Item>

                    <Form.Item
                      label="Transit Duration (minutes)"
                      layout="vertical"
                    >
                      <InputNumber
                        value={values.flightLegs[index]?.legTransitDuration}
                        onChange={(val) =>
                          setFieldValue(
                            `flightLegs.${index}.legTransitDuration`,
                            val || 0
                          )
                        }
                        min={0}
                        className="w-full"
                        placeholder="0 for no transit"
                      />
                    </Form.Item>
                  </div>
                </Card>
              ))}

            <Button
              type="dashed"
              icon={<PlusOutlined />}
              className="w-full mb-4"
              onClick={() => {
                const newLeg = {
                  legOriginId:
                    values.flightLegs.length === 0
                      ? values.originId // First leg starts from main origin
                      : values.flightLegs[values.flightLegs.length - 1]
                          ?.legDestinationId || "", // Next leg starts from previous destination
                  legDestinationId:
                    values.flightLegs.length === 0
                      ? values.destinationId // If only one leg, end at main destination
                      : "",
                  legDepartureTime: "",
                  legArrivalTime: "",
                  transitDuration: 0,
                };
                push(newLeg);
              }}
            >
              Add Flight Leg
            </Button>
          </div>
        )}
      </FieldArray>
    </>
  );
};

export default FlightLegsSection;
