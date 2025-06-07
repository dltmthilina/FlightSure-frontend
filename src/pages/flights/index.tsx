import FlightTable from "../../components/flight/FlightTable";

const dummyFlights = [
  {
    flightId: 1,
    flightNumber: "SL101",
    origin: "Colombo",
    destination: "Dubai",
    departureTime: "2025-06-01T08:00",
    arrivalTime: "2025-06-01T12:30",
    airplaneId: 101,
  },
  {
    flightId: 2,
    flightNumber: "SL202",
    origin: "Dubai",
    destination: "London",
    departureTime: "2025-06-02T14:00",
    arrivalTime: "2025-06-02T19:45",
    airplaneId: 102,
  },
];

const Flights = () => {
  const handleView = (flight: any) => console.log("View flight", flight);
  const handleEdit = (flight: any) => console.log("Edit flight", flight);
  const handleDelete = (flight: any) => console.log("Delete flight", flight);

  return (
    <div
      style={{ padding: 24, backgroundColor: "#f9fafb", minHeight: "100vh" }}
    >
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Flights</h1>
      <FlightTable
        flights={dummyFlights}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Flights;
