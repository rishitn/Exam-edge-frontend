import { Navigate, useLocation } from "react-router-dom";
import { useStudentAuth } from "../context/StudentAuthContext";
import { useAdminAuth } from "../context/AdminAuthContext";
import { Spinner } from "./ui";

const FullPageLoader = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Spinner size={28} />
  </div>
);

export function RequireStudent({ children }) {
  const { user, loading } = useStudentAuth();
  const location = useLocation();
  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export function RequireAdmin({ children }) {
  const { admin, loading } = useAdminAuth();
  const location = useLocation();
  if (loading) return <FullPageLoader />;
  if (!admin) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return children;
}

export function RequireSuperAdmin({ children }) {
  const { admin, isSuperAdmin, loading } = useAdminAuth();
  const location = useLocation();
  if (loading) return <FullPageLoader />;
  if (!admin) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  if (!isSuperAdmin) return <Navigate to="/admin/dashboard" replace />;
  return children;
}
