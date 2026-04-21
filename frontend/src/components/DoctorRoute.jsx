import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function DoctorRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "doctor") return <Navigate to="/403" replace />;

  return children;
}
