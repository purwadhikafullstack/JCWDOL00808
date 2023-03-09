import "./App.css";
import { Routes, Route } from "react-router-dom";
import Registration from "./pages/user/Registration";
import Home from "./pages/Home";
import Verification from "./pages/user/Verification";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/sidebar";
import Login from "./pages/user/Login";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/register" element={<Registration />} />
        <Route path="/user/verify" element={<Verification />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/admin" element={<Sidebar />} />
        <Route path="/admin/login" element=<AdminLogin /> />

        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
