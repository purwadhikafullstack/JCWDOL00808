import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import big4Logo from "../../assets/Big4Logo.svg";

export default function Registration() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = async (email) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/user/register`,
        email
      );
      toast({
        title: response?.data?.message,
        description: "Check your email to continue registration",
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
      handleRegister(values);
    },
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Flex
      minH={"100vh"}
      w={"full"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}>
      <HStack>
        <img src={big4Logo} className="h-60" alt="Big4Commerce Logo" />

        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} w={"md"}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"} fontFamily="Oswald">
              Sign Up
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
                    Sign Up
                  </Button>
                </Stack>
                <Stack pt={6}>
                  <Text align={"center"} className="font-[Roboto]">
                    Already a user?{" "}
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
      </HStack>
    </Flex>
  );
}
