import axios from "axios";
// import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import Sidebar from "../src/components/sidebar";
// import { Routes, Route, redirect } from "react-router-dom";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/greetings`);
      setMessage(data?.message || "");
    })();
  }, []);
  return (
    <div>
      <Sidebar />
      
    </div>
  );
}

export default App;
