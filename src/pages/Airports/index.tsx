import { useEffect, useState } from "react";
import AirportsTable from "../../components/airport/AirportTable";
import CreateAirportModal from "../../components/airport/CreateAirportModal";
import useApi from "../../hooks/use-api";
import { Airport } from "../../types";

const Airports = () => {
  const api = useApi();
  const [airPorts, setAirports] = useState<Airport[]>();

  useEffect(() => {
    getAirports();
  }, []);

  const getAirports = async () => {
    const res = await api.get(`/airports`);
    if (Array.isArray(res)) {
      setAirports(res);
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
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Airports</h1>
        <CreateAirportModal callback={getAirports} />
      </div>

      <AirportsTable
        airports={airPorts ?? []}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Airports;
