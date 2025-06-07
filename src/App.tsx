import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import Loader from "./components/common/Loader";
import { useAuth } from "./hooks/useAuth";
import { UserType } from "./types";
import AdminLayout from "./components/layout/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Lazy-loaded routes
const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage"));
const FlightDetailsPage = lazy(() => import("./pages/FlightDetailsPage"));
//const BookingPage = lazy(() => import('./pages/BookingPage'));
//const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
//const BookingConfirmationPage = lazy(() => import('./pages/BookingConfirmationPage'));
const LoginPage = lazy(() => import("./pages/LoginPage"));
//const SignupPage = lazy(() => import('./pages/SignupPage'));
//const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
//const BookingHistoryPage = lazy(() => import('./pages/BookingHistoryPage'));
//const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
//const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

/* // Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}; */

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === "ADMIN" ? (
    <>{children}</>
  ) : (
    <Navigate to="/" />
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                element={<ProtectedRoute allowedRoles={[UserType.Admin]} />}
              >
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminHomePage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route
                    path="/flight/:flightId"
                    element={<FlightDetailsPage />}
                  />
                  {/* <Route
                path="/booking/:flightId"
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                }
              /> */}
                  {/* <Route
                path="/checkout/:bookingId"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              /> */}
                  {/* <Route
                path="/confirmation/:bookingId"
                element={
                  <ProtectedRoute>
                    <BookingConfirmationPage />
                  </ProtectedRoute>
                }
              /> */}

                  {/* <Route path="/signup" element={<SignupPage />} /> */}
                  {/* <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                }
              /> */}
                  {/* <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <BookingHistoryPage />
                  </ProtectedRoute>
                }
              /> */}
                  {/* <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              /> */}
                  {/* <Route path="*" element={<NotFoundPage />} /> */}
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
