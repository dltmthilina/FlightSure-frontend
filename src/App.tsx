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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route element={<GuestOnly />}>
                <Route path="/" element={<LoginPage />} />
              </Route>

              <Route
                element={<ProtectedRoute allowedRoles={[UserType.Admin]} />}
              >
                <Route element={<AdminLayout />}>
                  <Route path="admin">
                    <Route index element={<AdminHomePage />} />
                  </Route>
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route
                    path="/flight/:flightId"
                    element={<FlightDetailsPage />}
                  />
                  <Route path="/airports" element={<Airports />} />
                  <Route path="/airplanes" element={<Airplanes />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
