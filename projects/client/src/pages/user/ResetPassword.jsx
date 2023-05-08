import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Link,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleResetPassword = async (email) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/user/reset-password`,
        email
      );
      toast({
        title: response?.data?.message,
        description: "Check your email to reset your password ",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleResetPassword(values);
    },
  });

  return (
    <Flex
      minH={"100vh"}
      w={"full"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} w={"md"}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"} fontFamily="Oswald">
            Reset Password
          </Heading>
        </Stack>
        <Box
          rounded={"none"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}>
          <Stack spacing={4}>
            <form onSubmit={formik.handleSubmit}>
              <FormControl
                fontFamily="Roboto"
                id="email"
                isRequired
                isInvalid={formik.touched.email && formik.errors.email}>
                <FormLabel>Email Address</FormLabel>
                <Input
                  id="email"
                  pl={3}
                  borderRadius="none"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>

              <Stack spacing={10} pt={2}>
                <Button
                  variant="buttonBlack"
                  isLoading={isLoading}
                  type="submit"
                  loadingText="Submitting">
                  Reset Password
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"} className="font-[Roboto]">
                  Remember your password?{" "}
                  <Link
                    as={RouterLink}
                    to="/user/login"
                    fontFamily={"Roboto"}
                    color={"gray.500"}>
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
