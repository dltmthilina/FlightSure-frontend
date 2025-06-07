import AirportsTable from "../../components/airport/AirportTable";
import CreateAirportModal from "../../components/airport/CreateAirportModal";

const dummyAirports = [
  {
    code: "CMB",
    name: "Bandaranaike International",
    city: "Colombo",
    country: "Sri Lanka",
  },
  {
    code: "JFK",
    name: "John F. Kennedy International",
    city: "New York",
    country: "USA",
  },
  { code: "LHR", name: "Heathrow", city: "London", country: "UK" },
];

const Airports = () => {
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
        <CreateAirportModal />
      </div>

      <AirportsTable
        airports={dummyAirports}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Airports;
