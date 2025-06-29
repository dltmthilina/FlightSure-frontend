import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/layout/Layout";
import Loader from "./components/common/Loader";
import { UserType } from "./types";
import AdminLayout from "./components/layout/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Airports from "./pages/Airports";
import Airplanes from "./pages/Airplanes";
import { GuestOnly } from "./components/auth/GuestOnly";
import Flights from "./pages/flights";
import Users from "./pages/users/Users";
import RegisterPage from "./pages/RegisterPage";
import UserDetail from "./pages/users/UserDetails";
import OperatorLayout from "./components/layout/OperatorLayout";
import CustomerLayout from "./components/layout/CustomerLayout";

const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage"));
const FlightDetailsPage = lazy(() => import("./pages/FlightDetailsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[UserType.Admin]} />}>
        <Route element={<AdminLayout />}>
          <Route path="admin">
            <Route index element={<AdminHomePage />} />
            <Route path="search" element={<SearchResultsPage />} />
            <Route path="flight/:flightId" element={<FlightDetailsPage />} />
            <Route path="airports" element={<Airports />} />
            <Route path="airplanes" element={<Airplanes />} />
            <Route path="flights" element={<Flights />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:userId" element={<UserDetail />} />
          </Route>
        </Route>
      </Route>

      {/* Operator routes */}
      <Route element={<ProtectedRoute allowedRoles={[UserType.Operator]} />}>
        <Route element={<OperatorLayout />}>
          <Route path="operator">
            <Route path="flights" element={<Flights />} />
            {/* <Route path="bookings" element={<OperatorBookings />} /> */}
            {/* Add more operator-only routes here */}
          </Route>
        </Route>
      </Route>

      {/* Customer routes */}
      <Route element={<ProtectedRoute allowedRoles={[UserType.Customer]} />}>
        <Route element={<CustomerLayout />}>
          <Route path="search" element={<SearchResultsPage />} />
          <Route path="flight/:flightId" element={<FlightDetailsPage />} />
          {/* <Route path="bookings" element={<CustomerBookings />} /> */}
          {/* Add more customer-only routes here */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
