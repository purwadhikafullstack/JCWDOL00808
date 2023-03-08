import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";

export default function Verification() {
  const queryParams = new URLSearchParams(window.location.search);
  const email = queryParams.get("email");
  const token = queryParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleCreatePassword = async (values) => {
    try {
      setIsLoading(true);
      const password = values.password;
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/user/verify`,
        { email, password, token }
      );
      toast({
        title: response?.data?.message,
        description: "You can continue login now",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast({
        title: error?.response?.data?.message || error?.message,
        description: error?.message ? "" : "Use another email address",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase")
      .matches(/^(?=.*[a-z])/, "Must contain at least one lowercase")
      .matches(/^(?=.*[0-9])/, "Must contain at least one number")
      .matches(
        /^(?=.*[!@#$%^&*])/,
        "Must contain at least one special character"
      )
      .min(8, "Password minimum 8 character")
      .required("Password is required!"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  const formik = useFormik({
    initialValues: {
      email,
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleCreatePassword(values);
    },
  });

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Create password
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <form onSubmit={formik.handleSubmit}>
              <FormControl
                id="email"
                isReadOnly
                isInvalid={formik.touched.email && formik.errors.email}
              >
                <FormLabel>Email address</FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl
                id="password"
                isRequired
                isInvalid={formik.touched.password && formik.errors.password}
              >
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              </FormControl>
              <FormControl
                id="confirmPassword"
                isRequired
                isInvalid={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
              >
                <FormLabel>Confirm password</FormLabel>
                <InputGroup>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowConfirmPassword(
                          (showConfirmPassword) => !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {formik.errors.confirmPassword}
                </FormErrorMessage>
              </FormControl>

              <Stack spacing={10} pt={2}>
                <Button
                  isLoading={isLoading}
                  type="submit"
                  loadingText="Submitting"
                  size="md"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Create password
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <Link as={RouterLink} to="/user/login" color={"blue.400"}>
                    Login
                  </Link>
                </Text>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
