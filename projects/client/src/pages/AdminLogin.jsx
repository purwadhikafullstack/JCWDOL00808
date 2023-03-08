import { Input, InputGroup, InputRightElement, Box, Spacer, Button, Text } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import Axios from "axios";
import { API_url } from "../helper";
import {useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import {loginAction} from "../actions/adminsAction"

const AdminLogin = (props) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const [inputEmail, setInputEmail] = React.useState("");
  const [inputPassword, setInputPassword] = React.useState("")

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const loginButton = () => {
    Axios.post(API_url + "/admins/login", {
      email: inputEmail,
      password: inputPassword
    })
    .then((response) => {
      console.log("response:", response.data);
      if(response.data.success){
        dispatch(loginAction(response.data.value));
        localStorage.setItem("admin_login", response.data.value.token);
        navigate("/", {replace: true});
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }

  return (
    <div>
        <Box w={[300, 400, 500]}>
          <Text fontSize="lg">e-mail</Text>
          <Input placeholder="your.email@mail.com" />
          <Text fontSize="lg">Password</Text>
          <InputGroup size="md">
            <Input pr="4.5rem" type={show ? "text" : "password"} placeholder="Enter password" />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <Button colorScheme="blackAlpha" onClick={loginButton}>Log in</Button>
        </Box>
    </div>
  );
};

export default AdminLogin;
