import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Sidebar from "./components/sidebar";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/admin/dashboard";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AdminWarehouseNotFound from "./pages/AdminWarehouseNotFound";
import ProductDetails from "./pages/ProductDetails";
import AdminList from "./pages/admin/AdminList";
import AssignAdmin from "./pages/admin/AssignAdmin";
import ManageAdmin from "./pages/admin/manageAdmin";
import ManageCategoryProducts from "./pages/admin/manageCategoryProduct";
import ManageProducts from "./pages/admin/manageProducts";
import PatchAdmin from "./pages/admin/patchAdmin";
import UserList from "./pages/admin/userList";
import AddUserAddress from "./pages/user/AddUserAddress";
import StockHistory from "./pages/warehouse/StockHistory";
import Cart from "./pages/user/Cart";
import EditProfile from "./pages/user/EditProfile";
import EditUserAddress from "./pages/user/EditUserAddress";
import Login from "./pages/user/Login";
import Registration from "./pages/user/Registration";
import ResetPassword from "./pages/user/ResetPassword";
import UserAddress from "./pages/user/UserAddress";
import Verification from "./pages/user/Verification";
import VerificationNewPassword from "./pages/user/VerificationNewPassword";
import StockHistoryDetails from "./pages/warehouse/StockHistoryDetails";
import WarehouseDetails from "./pages/warehouse/WarehouseDetails";
import WarehouseList from "./pages/warehouse/WarehouseList";
import WarehouseStock from "./pages/warehouse/WarehouseStock";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import StockRequestList from "./pages/warehouse/GetRequestMutation";
import ManageMutations from "./pages/warehouse/manageMutations";
import Checkout from "./pages/user/Checkout";
import SalesReport from "./pages/admin/salesReport";
//Protected route function
import ProtectedRoutes from "./utils/ProtectedRoutes";
import SuperAdminRoutes from "./utils/SuperAdminRoutes";
import WarehouseAdminRoutes from "./utils/WarehouseAdminRoutes";
import ListOrders from "./pages/admin/listOrders";
import OrderList from "./pages/user/OrderList";
import UploadPaymentProof from "./pages/user/UploadPaymentProof";
import "@fontsource/oswald/500.css";
import "@fontsource/roboto/400.css";

function App() {
  const location = useLocation();

  const cleanRoute = ["/user/register", "/user/verify", "/user/verify-new-password", "/user/login", "/user/reset-password", "/admin/login"].includes(location.pathname);

  return (
    <div className="App">
      {/*Admin and warehouse path will have dashboard Sidebar, user will have Navbar */}
      {cleanRoute ? null : location.pathname.startsWith("/admin") || location.pathname.startsWith("/warehouse") ? null : <Navbar />}
      <div className="flex justify-between">
        {cleanRoute ? null : location.pathname.startsWith("/admin") || location.pathname.startsWith("/warehouse") ? <Sidebar /> : null}

        <Routes>
          {/*Public user's route */}
          <Route path="/" element={<Home />} />
          <Route path="/product-details/:productId" element={<ProductDetails />} />
          <Route path="/user/register" element={<Registration />} />
          <Route path="/user/verify" element={<Verification />} />
          <Route path="/user/verify-new-password" element={<VerificationNewPassword />} />
          <Route path="/user/login" element={<Login />} />
          <Route path="/user/reset-password" element={<ResetPassword />} />

          {/*Protected user's route */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/user/profile" element={<EditProfile />} />
            <Route path="/user/address" element={<UserAddress />} />
            <Route path="/user/add-address" element={<AddUserAddress />} />
            <Route path="/user/add-address/checkout" element={<AddUserAddress />} />
            <Route path="/user/address/:id" element={<EditUserAddress />} />
            <Route path="/user/cart" element={<Cart />} />
            <Route path="/user/checkout" element={<Checkout />} />
            <Route path="/user/order-list" element={<OrderList />} />
            <Route path="/user/upload-payment-proof" element={<UploadPaymentProof />} />
          </Route>

          {/*Public admin's route */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />

          {/*Super admin's route */}
          <Route element={<SuperAdminRoutes />}>
            <Route path="/admin/list" element={<AdminList />} />
            <Route path="/admin/assign/:id" element={<AssignAdmin />} />
            <Route path="/admin/adminuserlist" element={<UserList />} />
            <Route path="/admin/manageadmin" element={<ManageAdmin />} />
            <Route path="/admin/patch-admin/:id" element={<PatchAdmin />} />
            {/* <Route path="/admin/addcategory" element={<AddCategoryProduct />} /> */}

            <Route path="/warehouse/list" element={<WarehouseList />} />

            <Route path="/warehouse/getAllstockmutationrequest" element={<ManageMutations />} />
            <Route path="/warehouse/details" element={<WarehouseDetails />} />
          </Route>

          {/*Super admin & Warehouse admin's route */}
          <Route element={<WarehouseAdminRoutes />}>
            <Route path="/admin/manageproducts" element={<ManageProducts />} />
            <Route path="/admin/list-orders" element={<ListOrders />} />
            <Route path="/warehouse/stock/:id" element={<WarehouseStock />} />
            <Route path="/warehouse/stock/0" element={<AdminWarehouseNotFound />} />
            <Route path="/warehouse/history" element={<StockHistory />} />
            <Route path="/warehouse/history-details" element={<StockHistoryDetails />} />
            <Route path="/warehouse/getstockmutationrequest" element={<StockRequestList />} />
            <Route path="/warehouse/getAllstockmutationrequest" element={<ManageMutations />} />
            <Route path="/warehouse/list" element={<WarehouseList />} />
            <Route path="/warehouse/getstockmutationrequest" element={<StockRequestList />} />
            <Route path="/warehouse/getAllstockmutationrequest" element={<ManageMutations />} />
            <Route path="/admin/managecategory" element={<ManageCategoryProducts />} />
            <Route path="/admin/sales-report" element={<SalesReport />} />
            <Route path="/warehouse/details/:id" element={<WarehouseDetails />} />
          </Route>

          {/* Fallback route */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>

      {/*User path will have footer */}
      {cleanRoute ? null : location.pathname.startsWith("/admin") || location.pathname.startsWith("/warehouse") ? null : <Footer />}
      <Toaster />
    </div>
  );
}

export default App;
