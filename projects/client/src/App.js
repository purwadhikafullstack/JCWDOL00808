import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route, redirect } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import { API_url } from "./helper";
import { useDispatch } from "react-redux";
import { loginAction } from "./actions/adminsAction";
import Axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/greetings`
      );
      setMessage(data?.message || "");
    })();
  }, []);

  const dispatch = useDispatch();

  const keeplogin = () => {
    let getLocalStorage = localStorage.getItem("admin_login");
    console.log("getLocalStorage: ", getLocalStorage);
    if(getLocalStorage){
      Axios.get(API_url + `/admins/keeplogin`, {
        headers: {
          Authorization: `Bearer ${getLocalStorage}` 
        }
      })
      .then((response) => {
        dispatch(loginAction(response.data));
      })
    }
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/adminlogin" element=<AdminLogin /> />
      </Routes>
    </div>
  );
}

export default App;
