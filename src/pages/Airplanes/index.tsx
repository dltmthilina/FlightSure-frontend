import { useEffect, useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import CreateAirplaneModal from "../../components/airplane/ManageAirplaneModal";
import useApi from "../../hooks/use-api";
import { AirplaneWithLocation } from "../../types";
import ManageAirplaneModal from "../../components/airplane/ManageAirplaneModal";
import { Button, Dropdown, Table } from "antd";

const Airplanes = () => {
  const api = useApi();
  const [airPlanes, setAirPlanes] = useState<AirplaneWithLocation[]>([]);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [airplaneIdToEdit, setAirplaneIdToEdit] = useState<number | string>();

  useEffect(() => {
    getAirplanes();
  }, []);

  const getAirplanes = async () => {
    const res: any = await api.get("/airplanes");
    if (Array.isArray(res.data)) {
      setAirPlanes(res.data);
    }
  };


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
      render: (_: any, record: AirplaneWithLocation) => record.initialLocation?.name || "-",
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
      render: (_: any, record: AirplaneWithLocation) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: "Update",
                onClick: () => {
                  setVisibleEdit(true);
                  setAirplaneIdToEdit(record.airplaneId);
                },
              },
              {
                key: "delete",
                label: "Delete",
                danger: true,
                onClick: () => { },
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Airplanes</h1>
        <CreateAirplaneModal
          isEdit={false}
          callback={getAirplanes}
          visible={visibleCreate}
          setVisible={setVisibleCreate}
        />
      </div>
      <div>
        <Table
          rowKey="model"
          dataSource={airPlanes}
          columns={columns}
          pagination={false}
        />
      </div>

      <ManageAirplaneModal
        callback={getAirplanes}
        isEdit={true}
        visible={visibleEdit}
        setVisible={setVisibleEdit}
        airplaneIdToEdit={airplaneIdToEdit}
      />
    </div>
  );
};

export default Airplanes;
