import { Input, InputGroup, InputRightElement, Box, Spacer, Button, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import Axios from "axios";
import { API_url } from "../helper";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAction } from "../actions/adminsAction";
import { useFormik } from "formik";

const AdminLogin = (props) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const [inputEmail, setInputEmail] = React.useState("");
  const [inputPassword, setInputPassword] = React.useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toast = useToast();

  const loginButton = () => {
    Axios.post(API_url + "/admins/login", {
      email: inputEmail,
      password: inputPassword,
    })
      .then((response) => {
        console.log("response:", response.data);
        if (response.data.success) {
          dispatch(loginAction(response.data));

          let a = JSON.stringify(response?.data?.data);
          let b = JSON.parse(a);

          localStorage.setItem("token", b.token);
          localStorage.setItem("role", b.role);

          toast({
            title: `${response.data.message}`,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          setTimeout(() => (navigate("/admin/dashboard", { replace: true }), 2000));
        } else {
          toast({
            title: `${response.data.message}`,
            duration: 9000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: `${error.message}`,
          duration: 9000,
          isClosable: true,
        });
      });
  };

  // const formik = useFormik({
  //   initialValues: {
  //     email: "",
  //   }
  // })

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <Box w={[300, 400, 500]} className="shadow p-5">
          <Text className="font-bold" fontSize="4xl">
            Login as admin
          </Text>
          <Text className="mt-3" fontSize="lg">
            e-mail
          </Text>
          <Input
            placeholder="Enter your.email@mail.com"
            // value={formik.values.email}
            // onChange={formik.handleChange}
            onChange={(element) => setInputEmail(element.target.value)}
          />
          <Text fontSize="lg">Password</Text>
          <InputGroup size="md">
            <Input pr="4.5rem" type={show ? "text" : "password"} placeholder="Enter password" onChange={(element) => setInputPassword(element.target.value)} />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <Button className="mt-5" colorScheme="twitter" onClick={loginButton}>
            Login
          </Button>
        </Box>
      </div>
    </>
  );
};

export default AdminLogin;
