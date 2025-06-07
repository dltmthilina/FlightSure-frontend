import React from "react";
import { Table, Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";

interface Flight {
  flightId: number;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  airplaneId: number;
}

interface Props {
  flights: Flight[];
  onView: (flight: Flight) => void;
  onEdit: (flight: Flight) => void;
  onDelete: (flight: Flight) => void;
}

const FlightTable: React.FC<Props> = ({
  flights,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: "Flight No",
      dataIndex: "flightNumber",
      key: "flightNumber",
    },
    {
      title: "Origin",
      dataIndex: "origin",
      key: "origin",
    },
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Departure",
      dataIndex: "departureTime",
      key: "departureTime",
    },
    {
      title: "Arrival",
      dataIndex: "arrivalTime",
      key: "arrivalTime",
    },
    {
      title: "Airplane ID",
      dataIndex: "airplaneId",
      key: "airplaneId",
      align: "right" as const,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Flight) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: "View",
                onClick: () => onView(record),
              },
              {
                key: "edit",
                label: "Update",
                onClick: () => onEdit(record),
              },
              {
                key: "delete",
                label: "Delete",
                danger: true,
                onClick: () => onDelete(record),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <Table
      rowKey="flightId"
      dataSource={flights}
      columns={columns}
      pagination={false}
    />
  );
};

export default FlightTable;
