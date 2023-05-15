// import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { userLogout } from "../reducers/authSlice";

export const isAuth = async () => {
  try {
    const token = localStorage.getItem("user_token");
    const userData = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/auth`,
      { headers: { Authorization: token } }
    );
    localStorage.setItem("user", JSON.stringify(userData?.data?.data));
    return userData?.data?.data;
  } catch (error) {
    if (error.response.status === 401) {
      toast.error(error?.response?.data?.message || error?.message);
      setTimeout(() => {
        sessionExpired();
      }, 1000);
    } else {
      toast.error(error?.response?.data?.message || error?.message);
    }
  }
};

export const logout = (navigate, dispatch) => {
  dispatch(userLogout());
  navigate("/");
  // window.location.reload();
};

export const sessionExpired = () => {
  localStorage.clear();
  window.location.assign("/");
};
