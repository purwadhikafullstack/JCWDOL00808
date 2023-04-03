import { Navigate, useLocation, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

export default function WarehouseAdminRoutes() {
  const token = localStorage.getItem("token");
  const role = parseInt(localStorage.getItem("role"));
  const location = useLocation();

  if (!token && !role) {
    setTimeout(() => {
      toast.error("Please login as admin to continue");
    }, 500);
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
