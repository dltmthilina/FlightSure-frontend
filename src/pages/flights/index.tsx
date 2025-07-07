import { useEffect, useState } from "react";
import CreateFlightModal from "../../components/flight/CreateFlightModal";
import FlightTable from "../../components/flight/FlightTable";
import useApi from "../../hooks/use-api";
import { Airplane, Airport, Flight } from "../../types";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";

const Flights = () => {
  const api = useApi();
  const [flights, setFlights] = useState<Flight[]>([]);
 
  const navigate = useNavigate();

  useEffect(() => {
    getFlights();
  }, []);

  const getFlights = async () => {
    const res: any = await api.get("/flights");
    if (res && Array.isArray(res.data)) {
      setFlights(res.data);
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
        <Button
          className="bg-primary-dark"
          onClick={() => navigate("create-new")}
        >
          Add New Flight
        </Button>
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
