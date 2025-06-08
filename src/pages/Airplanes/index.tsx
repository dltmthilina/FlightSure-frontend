import { useEffect, useState } from "react";
import AirplanesTable from "../../components/airplane/AirplanesTable";
import CreateAirplaneModal from "../../components/airplane/CreateAirplaneModal";
import useApi from "../../hooks/use-api";
import { Airplane } from "../../types";

const Airplanes = () => {
  const api = useApi();
  const [airPlanes, setAirPlanes] = useState<Airplane[]>([]);

  useEffect(() => {
    getAirplanes();
  }, []);

  const getAirplanes = async () => {
    const res: any = await api.get("/airplanes");
    if (Array.isArray(res.data)) {
      setAirPlanes(res.data);
    }
  };
  const handleView = (airport: any) => {
    console.log("View", airport);
  };

  const handleEdit = (airport: any) => {
    console.log("Edit", airport);
  };

  const handleDelete = (airport: any) => {
    console.log("Delete", airport);
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Airplanes</h1>
        <CreateAirplaneModal callback={getAirplanes} />
      </div>

      <AirplanesTable
        airplanes={airPlanes ?? []}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Airplanes;
