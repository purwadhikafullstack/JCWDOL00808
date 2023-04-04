import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
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
import AdminList from "./pages/admin/AdminList";
import WarehouseList from "./pages/warehouse/WarehouseList";
import AddWarehouse from "./pages/warehouse/AddWarehouse";
import EditWarehouse from "./pages/warehouse/EditWarehouse";
import AssignAdmin from "./pages/admin/AssignAdmin";
import ManageAdmin from "./pages/admin/manageAdmin";
import RegisterAdmin from "./pages/admin/registerAdmin";
import ManageProducts from "./pages/admin/manageProducts";
import ProductForm from "./pages/admin/addProduct";
import PatchAdmin from "./pages/admin/patchAdmin";
import ManageCategoryProducts from "./pages/admin/manageCategoryProduct";
import AddCategoryProduct from "./pages/admin/addCategoryProduct";
import PatchCategoryProduct from "./pages/admin/patchCategory";
import PatchProductForm from "./pages/admin/patchProduct";
import ProductDetails from "./pages/ProductDetails";
import WarehouseDetails from "./pages/warehouse/WarehouseDetails";
import StockHistory from "./pages/warehouse/StockHistory";
import History from "./pages/warehouse/History";
import Cart from "./pages/user/Cart";
import UserAddress from "./pages/user/UserAddress";
import EditUserAddress from "./pages/user/EditUserAddress";
import AddUserAddress from "./pages/user/AddUserAddress";
import TransactionList from "./pages/user/TransactionList";
import WarehouseStock from "./pages/warehouse/WarehouseStock";
// import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();
  // const { user } = useSelector((state) => state.auth);

  const cleanRoute = ["/user/register", "/user/verify", "/user/verify-new-password", "/user/login", "/user/reset-password", "/admin/login"].includes(location.pathname);

  return (
    <div className="App">
      {/*Admin and warehouse path will have dashboard Sidebar, user will have Navbar */}
      {cleanRoute ? null : location.pathname.startsWith("/admin" || "/warehouse") ? <Sidebar /> : <Navbar />}

      <Routes>
        {/*User's path */}
        <Route path="/" element={<Home />} />
        <Route path="/user/register" element={<Registration />} />
        <Route path="/user/verify" element={<Verification />} />
        <Route path="/user/verify-new-password" element={<VerificationNewPassword />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/profile" element={<EditProfile />} />
        <Route path="/user/reset-password" element={<ResetPassword />} />
        <Route path="/user/address" element={<UserAddress />} />
        <Route path="/user/add-address" element={<AddUserAddress />} />
        <Route path="/user/address/:id" element={<EditUserAddress />} />
        <Route path="/product-details/:productId" element={<ProductDetails />} />
        <Route path="/user/cart" element={<Cart />} />
        <Route path="/user/transaction-list" element={<TransactionList />} />

        {/*Admin's path */}
        <Route path="/admin" element={<Sidebar />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/list" element={<AdminList />} />
        <Route path="/admin/assign/:id" element={<AssignAdmin />} />
        <Route path="/admin/adminuserlist" element={<UserList />} />
        <Route path="/warehouse/list" element={<WarehouseList />} />
        <Route path="/warehouse/add" element={<AddWarehouse />} />
        <Route path="/warehouse/edit" element={<EditWarehouse />} />
        <Route path="/warehouse/details" element={<WarehouseDetails />} />
        <Route path="/warehouse/stock/:id" element={<WarehouseStock />} />
        <Route path="/warehouse/history" element={<StockHistory />} />
        <Route path="/warehouse/history2" element={<History />} />
        <Route path="/admin/manageadmin" element={<ManageAdmin />} />
        <Route path="/admin/registeradmin" element={<RegisterAdmin />} />
        <Route path="/admin/manageproducts" element={<ManageProducts />} />
        <Route path="/admin/addProducts" element={<ProductForm />} />
        <Route path="/admin/patch-admin/:id" element={<PatchAdmin />} />
        <Route path="/admin/managecategory" element={<ManageCategoryProducts />} />
        <Route path="/admin/addcategory" element={<AddCategoryProduct />} />
        <Route path="/admin/patch-category/:id" element={<PatchCategoryProduct />} />
        <Route path="/admin/patch-product/:id" element={<PatchProductForm />} />

        {/* Fallback route */}
        <Route path="/*" element={<NotFound />} />
      </Routes>

      {/*User path will have footer */}
      {cleanRoute ? null : location.pathname.startsWith("/admin" || "/warehouse") ? null : <Footer />}
    </div>
  );
}

export default App;
