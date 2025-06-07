import AirplanesTable from "../../components/airplane/AirplanesTable";

const sampleAirplanes = [
  {
    model: "A380",
    category: "Large",
    capacity_first: 14,
    capacity_business: 76,
    capacity_economy: 400,
    manufacturer: "Airbus",
  },
  {
    model: "Boeing 777",
    category: "Medium",
    capacity_first: 8,
    capacity_business: 48,
    capacity_economy: 300,
    manufacturer: "Boeing",
  },
];

const Airplanes = () => {
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
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Airplanes</h1>
      <AirplanesTable
        airplanes={sampleAirplanes}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Airplanes;
