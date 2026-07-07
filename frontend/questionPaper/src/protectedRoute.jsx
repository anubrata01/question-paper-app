import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  allowedRole,
}) {
  // const user = JSON.parse(localStorage.getItem("user"));
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}