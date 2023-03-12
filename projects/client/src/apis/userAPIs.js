import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
// import {useToast} from "@chakra-ui/react"

// // const baseURL = process.env.REACT_APP_BACKEND_BASE_URL;
// const userURL = process.env.REACT_APP_BACKEND_USER_URL;

export const loginUser = async (email, password) => {
    // const [isLoading, setIsLoading] = useState(false);
    //const toastChakra = useToast();
    try {
        // setIsLoading(true);
        let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/user/login`, {
            email: email,
            password: password
        });
        toast(response.data.message)
        // toastChakra({
        //     title: response?.data?.message,
        //     description: "Ready for shopping",
        //     status: "success",
        //     duration: 5000,
        //     isClosable: true,
        // });
        // setIsLoading(false);
        localStorage.setItem('token', response.data.data.token)

    } catch (error) {
        // setIsLoading(false);
        toast(error.response.data.message)
        // toastChakra({
        //     title: error?.response?.data?.message || error?.message,
        //     description: error?.message,
        //     status: "error",
        //     duration: 5000,
        //     isClosable: true,
        //   });

    }
}

