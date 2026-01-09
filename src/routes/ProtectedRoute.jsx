import { Navigate } from "react-router-dom";
import { useAuthSelector } from "../store/useAuthStore";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const user = useAuthSelector((state) => state.user);
  const token = useAuthSelector((state) => state.token);

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};
