import React from "react";
import { Table, Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { Flight } from "../../types";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
      render: (_: any, record: Flight) => record.origin.name || "-",
    },
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
      render: (_: any, record: Flight) => record.destination.name || "-",
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
      title: "Airplane Register Number",
      dataIndex: "regNumber",
      key: "regNumber",
      render: (_: any, record: Flight) => record.airplane?.regNumber || "-",
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
                onClick: () => navigate(`${record.flightId}`),
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
