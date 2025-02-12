import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
