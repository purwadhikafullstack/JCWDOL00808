import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/sidebar";
import AdminLogin from "./pages/AdminLogin";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProductDetails from "./pages/ProductDetails";
import AdminList from "./pages/admin/AdminList";
import AssignAdmin from "./pages/admin/AssignAdmin";
import ProductForm from "./pages/admin/addProduct";
import ManageAdmin from "./pages/admin/manageAdmin";
import ManageCategoryProducts from "./pages/admin/manageCategoryProduct";
import ManageProducts from "./pages/admin/manageProducts";
import PatchAdmin from "./pages/admin/patchAdmin";
import PatchCategoryProduct from "./pages/admin/patchCategory";
import PatchProductForm from "./pages/admin/patchProduct";
import RegisterAdmin from "./pages/admin/registerAdmin";
import UserList from "./pages/admin/userList";
import AddUserAddress from "./pages/user/AddUserAddress";
import Cart from "./pages/user/Cart";
import EditProfile from "./pages/user/EditProfile";
import EditUserAddress from "./pages/user/EditUserAddress";
import Login from "./pages/user/Login";
import Registration from "./pages/user/Registration";
import ResetPassword from "./pages/user/ResetPassword";
import UserAddress from "./pages/user/UserAddress";
import Verification from "./pages/user/Verification";
import VerificationNewPassword from "./pages/user/VerificationNewPassword";
import AddWarehouse from "./pages/warehouse/AddWarehouse";
import EditWarehouse from "./pages/warehouse/EditWarehouse";
import StockHistory from "./pages/warehouse/StockHistory";
import WarehouseDetails from "./pages/warehouse/WarehouseDetails";
import WarehouseList from "./pages/warehouse/WarehouseList";
import WarehouseStock from "./pages/warehouse/WarehouseStock";
// import { useSelector } from "react-redux";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import StockRequestList from "./pages/warehouse/GetRequestMutation";
import ManageMutations from "./pages/warehouse/manageMutations";

function App() {
  const location = useLocation();
  // const { user } = useSelector((state) => state.auth);

  const cleanRoute = ["/user/register", "/user/verify", "/user/verify-new-password", "/user/login", "/user/reset-password", "/admin/login"].includes(location.pathname);

  return (
    <div className="App" style={{ display: "flex", flex: 1 }}>
      {/*Admin and warehouse path will have dashboard Sidebar, user will have Navbar */}
      {cleanRoute ? null : location.pathname.startsWith("/admin") || location.pathname.startsWith("/warehouse") ? <Sidebar /> : <Navbar />}

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

        {/*Admin's path */}
        {/* <Route path="/admin" element={<Sidebar />} /> */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/list" element={<AdminList />} />
        <Route path="/admin/assign/:id" element={<AssignAdmin />} />
        <Route path="/admin/adminuserlist" element={<UserList />} />
        <Route path="/warehouse/list" element={<WarehouseList />} />
        <Route path="/warehouse/add" element={<AddWarehouse />} />
        <Route path="/warehouse/edit" element={<EditWarehouse />} />
        <Route path="/warehouse/details/:id" element={<WarehouseDetails />} />
        <Route path="/warehouse/stock/:id" element={<WarehouseStock />} />
        <Route path="/warehouse/history" element={<StockHistory />} />
        <Route path="/warehouse/getstockmutationrequest" element={<StockRequestList />} />
        <Route path="/warehouse/getAllstockmutationrequest" element={<ManageMutations />} />
        <Route path="/admin/manageadmin" element={<ManageAdmin />} />
        <Route path="/admin/registeradmin" element={<RegisterAdmin />} />
        <Route path="/admin/manageproducts" element={<ManageProducts />} />
        <Route path="/admin/addProducts" element={<ProductForm />} />
        <Route path="/admin/patch-admin/:id" element={<PatchAdmin />} />
        <Route path="/admin/managecategory" element={<ManageCategoryProducts />} />
        <Route path="/admin/patch-category/:id" element={<PatchCategoryProduct />} />
        <Route path="/admin/patch-product/:id" element={<PatchProductForm />} />
        <Route path="/user/address" element={<UserAddress />} />
        <Route path="/user/add-address" element={<AddUserAddress />} />
        <Route path="/user/address/:id" element={<EditUserAddress />} />
        <Route path="/product-details/:productId" element={<ProductDetails />} />
        <Route path="/user/cart" element={<Cart />} />

        {/* Fallback route */}
        <Route path="/*" element={<NotFound />} />
      </Routes>

      {/*User path will have footer */}
      {cleanRoute ? null : location.pathname.startsWith("/admin") || location.pathname.startsWith("/warehouse") ? null : <Footer />}
    </div>
  );
}

export default App;
