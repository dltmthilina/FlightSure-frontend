import React from "react";
import { Table, Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { Airplane } from "../../types";

interface Props {
  airplanes: Airplane[];
  onView: (airplane: Airplane) => void;
  onEdit: (airplane: Airplane) => void;
  onDelete: (airplane: Airplane) => void;
}

const AirplanesTable: React.FC<Props> = ({
  airplanes,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: "Register Number",
      dataIndex: "regNumber",
      key: "regNumber",
    },
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
      dataIndex: "capacityFirst",
      key: "capacityFirst",
      align: "right" as const,
    },
    {
      title: "Business",
      dataIndex: "capacityBusiness",
      key: "capacityBusiness",
      align: "right" as const,
    },
    {
      title: "Economy",
      dataIndex: "capacityEconomy",
      key: "capacityEconomy",
      align: "right" as const,
    },
    {
      title: "Initial Location",
      dataIndex: "initialLocation",
      key: "initialLocation",
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
