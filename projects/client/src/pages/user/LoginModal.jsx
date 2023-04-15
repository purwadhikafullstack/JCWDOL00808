import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin, clearState } from "../../reducers/authSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const LoginModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { user, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );
  const toast = useToast();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setLoginData((prevValues) => {
      return { ...prevValues, [e.target.name]: e.target.value };
    });
  };

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown(!passwordShown);

  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate("/");
        dispatch(clearState());
        onClose();
      }, 1000);
      toast({
        title: "Logged in successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else if (isError) {
      toast({
        title: message || "Login failed.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      dispatch(clearState());
    } else if (user) {
      navigate("/");
    }
  }, [user, isSuccess, isError, message, navigate, dispatch, toast, onClose]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .required("Required"),
    }),
    onSubmit: (values) => {
      dispatch(userLogin(values));
    },
  });

  return (
    <div className="flex justify-start items-center flex-col">
      <Flex
        w={"full"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("white", "gray.800")}>
        <Stack spacing={8} mx={"auto"}>
          <Stack align={"center"}>
            <Heading
              fontFamily="Roboto"
              pt={8}
              fontSize={"4xl"}
              textAlign={"center"}>
              Login
            </Heading>
          </Stack>
          <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} p={8}>
            <Stack spacing={4}>
              <form onSubmit={formik.handleSubmit}>
                <FormControl
                  fontFamily="Roboto"
                  id="email"
                  isRequired
                  isInvalid={formik.touched.email && formik.errors.email}>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    pl={3}
                    borderRadius="none"
                    id="email"
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                  <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl
                  fontFamily="Roboto"
                  id="password"
                  isRequired
                  isInvalid={formik.touched.password && formik.errors.password}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup size="md">
                    <Input
                      pl={3}
                      borderRadius="none"
                      id="password"
                      name="password"
                      type={passwordShown ? "text" : "password"}
                      onChange={formik.handleChange}
                      value={formik.values.password}
                    />
                    <InputRightElement width="3rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={togglePasswordVisiblity}>
                        {passwordShown ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                </FormControl>

                <Stack spacing={10} pt={2} mt={10}>
                  <Button
                    variant="buttonBlack"
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Submitting">
                    Login
                  </Button>
                </Stack>
                <Stack>
                  <Link as={RouterLink} to="/user/register" width="full" mt={2}>
                    <Button variant="buttonWhite" width="full">
                      Sign Up
                    </Button>
                  </Link>
                </Stack>
                <Stack pt={6}>
                  <Text align={"center"}>
                    <Link
                      fontFamily="Roboto"
                      className="text-gray-600 dark:text-gray-400"
                      width="full"
                      as={RouterLink}
                      to="/user/reset-password">
                      Forget Password?
                    </Link>
                  </Text>
                </Stack>
              </form>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </div>
  );
};

export default LoginModal;
