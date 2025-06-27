import { Card, Table, Button } from "antd";

const summaryData = [
  { title: "Total Flights", value: 128, color: "bg-primary-dark" },
  { title: "Total Bookings", value: 542, color: "bg-blue-600" },
  { title: "Active Users", value: 312, color: "bg-green-600" },
  { title: "Airplanes", value: 18, color: "bg-yellow-500" },
];

const recentBookings = [
  {
    key: 1,
    passenger: "John Doe",
    flight: "AI-203",
    date: "2025-06-27",
    status: "Confirmed",
  },
  {
    key: 2,
    passenger: "Jane Smith",
    flight: "BA-101",
    date: "2025-06-26",
    status: "Pending",
  },
  {
    key: 3,
    passenger: "Alex Lee",
    flight: "UA-404",
    date: "2025-06-25",
    status: "Cancelled",
  },
];

const columns = [
  { title: "Passenger", dataIndex: "passenger", key: "passenger" },
  { title: "Flight", dataIndex: "flight", key: "flight" },
  { title: "Date", dataIndex: "date", key: "date" },
  { title: "Status", dataIndex: "status", key: "status" },
];

export default function AdminHomePage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6 text-primary-dark">
        Admin Dashboard
      </h1>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {summaryData.map((item) => (
          <Card
            key={item.title}
            className={`text-white ${item.color} shadow-lg`}
            bordered={false}
          >
            <div className="text-lg">{item.title}</div>
            <div className="text-3xl font-bold">{item.value}</div>
          </Card>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="flex gap-4 mb-8">
        <Button type="primary" className="bg-primary-dark">
          Add Flight
        </Button>
        <Button type="primary" className="bg-blue-600">
          Add Airplane
        </Button>
        <Button type="primary" className="bg-green-600">
          Manage Users
        </Button>
      </div>
      {/* Recent Bookings Table */}
      <Card title="Recent Bookings" className="shadow-lg">
        <Table
          columns={columns}
          dataSource={recentBookings}
          pagination={false}
        />
      </Card>
    </div>
  );
}
