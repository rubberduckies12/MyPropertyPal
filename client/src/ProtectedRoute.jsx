import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem("role");
  if (!allowedRoles.includes(role)) {
    // Redirect to the correct home page
    return <Navigate to={role === "tenant" ? "/tenant-home" : "/dashboard"} />;
  }
  return children;
}