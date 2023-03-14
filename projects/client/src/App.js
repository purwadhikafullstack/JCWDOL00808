import "./App.css";
import { Routes, Route } from "react-router-dom";
import Registration from "./pages/user/Registration";
import Home from "./pages/Home";
import Verification from "./pages/user/Verification";
import NotFound from "./pages/NotFound";
import Login from "./pages/user/Login";
import EditProfile from "./pages/user/EditProfile";
import AdminLogin from "./pages/AdminLogin";
import ResetPassword from "./pages/user/ResetPassword";
import VerificationNewPassword from "./pages/user/VerificationNewPassword";
import Sidebar from "./components/sidebar";
import UserList from "./pages/admin/userList";
import ManageAdmin from "./pages/admin/manageAdmin";
import RegisterAdmin from "./pages/admin/registerAdmin";
import ManageProducts from "./pages/admin/manageProducts";
import ProductForm from "./pages/admin/addProduct";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/register" element={<Registration />} />
        <Route path="/user/verify" element={<Verification />} />
        <Route path="/user/verify-new-password" element={<VerificationNewPassword />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/profile" element={<EditProfile />} />
        <Route path="/user/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<Sidebar />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Sidebar />} />
        <Route path="/admin/adminuserlist" element={<UserList />} />
        <Route path="/admin/manageadmin" element={<ManageAdmin />} />
        <Route path="/admin/registeradmin" element={<RegisterAdmin />} />
        <Route path="/admin/manageproducts" element={<ManageProducts />} />
        <Route path="/admin/addProducts" element={<ProductForm />} />


        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
