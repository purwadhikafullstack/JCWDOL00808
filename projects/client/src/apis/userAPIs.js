import { useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const baseURL = process.env.REACT_APP_BACKEND_BASE_URL;
const userURL = process.env.REACT_APP_BACKEND_USER_URL;

export const loginUser = async (email, password) => {
  try {
    let response = await axios.post(`${baseURL}${userURL}/login`, {
      email: email,
      password: password,
    });
    toast(response.data.message);
    localStorage.setItem("token", response.data.data.token);
  } catch (error) {
    toast(error.response.data.message);
  }
};

export const isAuth = async (navigate) => {
  try {
    if (!localStorage.getItem("token")) {
      navigate("/user/login");
    } else {
      const token = localStorage.getItem("token");
      const userData = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/auth`,
        { headers: { Authorization: token } }
      );
      return userData?.data?.data;
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
