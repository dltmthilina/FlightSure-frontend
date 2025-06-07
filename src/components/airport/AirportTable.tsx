import React from "react";
import { Table, Dropdown, Button, Space, Menu } from "antd";
import { MoreOutlined } from "@ant-design/icons";

interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

interface Props {
  airports: Airport[];
  onView: (airport: Airport) => void;
  onEdit: (airport: Airport) => void;
  onDelete: (airport: Airport) => void;
}

const AirportsTable: React.FC<Props> = ({
  airports,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Airport) => (
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
      rowKey="code"
      dataSource={airports}
      columns={columns}
      pagination={false}
    />
  );
};

export default AirportsTable;
