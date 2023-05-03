import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function ProtectedRoutes() {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("user_token");
  const location = useLocation();

  if (!user || !token) {
    setTimeout(() => {
      toast.error("Please login to continue");
    }, 500);
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
