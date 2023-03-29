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
import Cart from "./pages/user/Cart";
import UserAddress from "./pages/user/UserAddress";
import EditUserAddress from "./pages/user/EditUserAddress";
import AddUserAddress from "./pages/user/AddUserAddress";
import StockMutations from "./pages/warehouse/RequestMutation";
import StockRequestList from "./pages/warehouse/GetRequestMutation"
import ManageMutations from "./pages/warehouse/manageMutations";

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
        <Route path="/admin/list" element={<AdminList />} />
        <Route path="/admin/assign/:id" element={<AssignAdmin />} />
        <Route path="/admin/adminuserlist" element={<UserList />} />
        <Route path="/warehouse/list" element={<WarehouseList />} />
        <Route path="/warehouse/add" element={<AddWarehouse />} />
        <Route path="/warehouse/edit" element={<EditWarehouse />} />
        <Route path="/warehouse/details/:id" element={<WarehouseDetails />} />
        <Route path="/warehouse/history" element={<StockHistory />} />
        <Route path="/warehouse/requeststockmutation" element={<StockMutations />} />
        <Route path="/warehouse/getstockmutationrequest" element={<StockRequestList />} />
        <Route path="/warehouse/getAllstockmutationrequest" element={<ManageMutations />} />
        <Route path="/admin/manageadmin" element={<ManageAdmin />} />
        <Route path="/admin/registeradmin" element={<RegisterAdmin />} />
        <Route path="/admin/manageproducts" element={<ManageProducts />} />
        <Route path="/admin/addProducts" element={<ProductForm />} />
        <Route path="/admin/patch-admin/:id" element={<PatchAdmin />} />
        <Route path="/admin/managecategory" element={<ManageCategoryProducts />} />
        <Route path="/admin/addcategory" element={<AddCategoryProduct />} />
        <Route path="/admin/patch-category/:id" element={<PatchCategoryProduct />} />
        <Route path="/admin/patch-product/:id" element={<PatchProductForm />} />
        <Route path="/user/address" element={<UserAddress />} />
        <Route path="/user/add-address" element={<AddUserAddress />} />
        <Route path="/user/address/:id" element={<EditUserAddress />} />
        <Route path="/product-details/:productId" element={<ProductDetails />} />
        <Route path="/user/cart" element={<Cart />} />

        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
