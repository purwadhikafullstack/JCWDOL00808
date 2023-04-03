// import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { userLogout } from "../reducers/authSlice";

// // const baseURL = process.env.REACT_APP_BACKEND_BASE_URL;
// const userURL = process.env.REACT_APP_BACKEND_USER_URL;

// export const loginUser = async (email, password) => {
//   // const [isLoading, setIsLoading] = useState(false);
//   //const toastChakra = useToast();
//   try {
//     // setIsLoading(true);
//     let response = await axios.post(
//       `${process.env.REACT_APP_API_BASE_URL}/user/login`,
//       {
//         email: email,
//         password: password,
//       }
//     );
//     window.location.reload();
//     toast(response.data.message);
//     // toastChakra({
//     //     title: response?.data?.message,
//     //     description: "Ready for shopping",
//     //     status: "success",
//     //     duration: 5000,
//     //     isClosable: true,
//     // });
//     // setIsLoading(false);
//     localStorage.setItem("token", response.data.data.token);
//   } catch (error) {
//     // setIsLoading(false);
//     toast(error.response.data.message);
//     // toastChakra({
//     //     title: error?.response?.data?.message || error?.message,
//     //     description: error?.message,
//     //     status: "error",
//     //     duration: 5000,
//     //     isClosable: true,
//     //   });
//   }
// };
export const isAuth = async () => {
  try {
    const token = localStorage.getItem("token");
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
  navigate("/user/login");
};

export const sessionExpired = () => {
  localStorage.clear();
  window.location.assign("/user/login");
};
