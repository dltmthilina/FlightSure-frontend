import React from "react";
import { Table, Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";

interface Airplane {
  model: string;
  category: string;
  capacity_first: number;
  capacity_business: number;
  capacity_economy: number;
  manufacturer: string;
}

interface Props {
  airplanes: Airplane[];
  onView: (airplane: Airplane) => void;
  onEdit: (airplane: Airplane) => void;
  onDelete: (airplane: Airplane) => void;
}

const AirplanesTable: React.FC<Props> = ({ airplanes, onView, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "First Class",
      dataIndex: "capacity_first",
      key: "capacity_first",
      align: "right" as const,
    },
    {
      title: "Business",
      dataIndex: "capacity_business",
      key: "capacity_business",
      align: "right" as const,
    },
    {
      title: "Economy",
      dataIndex: "capacity_economy",
      key: "capacity_economy",
      align: "right" as const,
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturer",
      key: "manufacturer",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Airplane) => (
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
      rowKey="model"
      dataSource={airplanes}
      columns={columns}
      pagination={false}
    />
  );
};

export default AirplanesTable;
