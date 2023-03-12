import "./App.css";
import { Routes, Route } from "react-router-dom";
import Registration from "./pages/user/Registration";
import Home from "./pages/Home";
import Verification from "./pages/user/Verification";
import NotFound from "./pages/NotFound";
import Login from "./pages/user/Login";
import AdminLogin from "./pages/AdminLogin";
import Sidebar from "./components/sidebar";
import UserList from "./pages/admin/userList";
import ManageAdmin from "./pages/admin/manageAdmin";
import RegisterAdmin from "./pages/admin/registerAdmin";
import ManageProducts from "./pages/admin/manageProducts";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/register" element={<Registration />} />
        <Route path="/user/verify" element={<Verification />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Sidebar />} />
        <Route path="/admin/adminuserlist" element={<UserList />} />
        <Route path="/admin/manageadmin" element={<ManageAdmin />} />
        <Route path="/admin/registeradmin" element={<RegisterAdmin />} />
        <Route path="/admin/manageProducts" element={<ManageProducts />} />

        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
