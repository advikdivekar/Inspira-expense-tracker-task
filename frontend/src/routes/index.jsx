import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import EmployeeDashboard from "../pages/EmployeeDashboard";
import ManagerLogin from "../pages/ManagerLogin";
import ManagerDashboard from "../pages/ManagerDashboard";


// wrapper that redirects to login if manager is not authenticated
const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/manager/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EmployeeDashboard />} />

      <Route path="/manager/login" element={<ManagerLogin />} />

      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      {/* catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;