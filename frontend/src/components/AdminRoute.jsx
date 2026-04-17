import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== "Admin") {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default AdminRoute;