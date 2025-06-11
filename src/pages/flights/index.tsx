import { useEffect, useState } from "react";
import CreateFlightModal from "../../components/flight/CreateFlightModal";
import FlightTable from "../../components/flight/FlightTable";
import useApi from "../../hooks/use-api";
import { Airplane, Airport, Flight } from "../../types";

const Flights = () => {
  const api = useApi();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [airplanes, setAirplanes] = useState<Airplane[]>([]);

  useEffect(() => {
    getFlights();
    getAirports();
    getAirPlanes();
  }, []);

  const getFlights = async () => {
    const res: any = await api.get("/flights");
    if (res && Array.isArray(res.data)) {
      setFlights(res.data);
    }
  };

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
  const handleView = (flight: any) => console.log("View flight", flight);
  const handleEdit = (flight: any) => console.log("Edit flight", flight);
  const handleDelete = (flight: any) => console.log("Delete flight", flight);

  return (
    <div
      style={{ padding: 24, backgroundColor: "#f9fafb", minHeight: "100vh" }}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Flights</h1>
        <CreateFlightModal
          callback={getFlights}
          airplaneList={airplanes}
          airportList={airports}
        />
      </div>

      <FlightTable
        flights={flights ?? []}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Flights;
