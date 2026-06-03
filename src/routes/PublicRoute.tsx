import { SpinnerEmpty } from "@/components/layout/SpinnerComponent";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return <SpinnerEmpty />;
  }
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
