import {
  Avatar,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Center,
  Text,
  Tooltip,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import RemovePicConfirmation from "../../components/RemovePicConfirmation";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState, useEffect, useRef } from "react";

export default function EditProfile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const profilePicture = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  const handlePictureChange = async (event) => {
    try {
      const image = event.target.files[0];
      const formData = new FormData();
      formData.append("images", image);
      //dummy axios, id still hardcoded
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/user/profile/75c451bb-c187-4bfe-baa4-c783e761a5f0/picture`,
        formData
      );
      toast({
        title: response?.data?.message,
        description: "Refresh page if picture not available",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: error?.response?.data?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRemovePicture = async () => {
    try {
      //dummy axios, id still hardcoded
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/user/profile/75c451bb-c187-4bfe-baa4-c783e761a5f0/picture`
      );
      onClose();
      toast({
        title: response?.data?.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: error?.response?.data?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditProfile = async (values) => {
    try {
      setIsLoading(true);
      const { fullName, phoneNumber } = values;
      console.log(fullName, phoneNumber);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    fullName: Yup.string(),
    phoneNumber: Yup.string(),
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
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleEditProfile(values);
    },
  });

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          Edit profile
        </Heading>
        <FormControl id="profile_picture">
          <FormLabel>Profile picture</FormLabel>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar size="xl" src="https://bit.ly/sage-adebayo">
                <RemovePicConfirmation
                  isOpen={isOpen}
                  onClose={onClose}
                  onDelete={handleRemovePicture}
                />
              </Avatar>
            </Center>

            <Center w="full">
              <Input
                type="file"
                name="images"
                accept="image/*"
                ref={profilePicture}
                onChange={handlePictureChange}
                style={{ display: "none" }}
              />
              <Tooltip hasArrow label="(jpg / jpeg / png) not bigger than 5 MB">
                <Button
                  onClick={() => {
                    profilePicture.current.click();
                  }}
                  w="full"
                >
                  Change picture
                </Button>
              </Tooltip>
            </Center>
          </Stack>
        </FormControl>
        <FormControl id="fullName" isRequired>
          <FormLabel>Full name</FormLabel>
          <Input
            placeholder="Full name"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl id="email" isDisabled>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            type="email"
          />
        </FormControl>
        <FormControl id="phone" isRequired>
          <FormLabel>Phone number</FormLabel>
          <Input
            placeholder="08123456789"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="Password"
            _placeholder={{ color: "gray.500" }}
            type="password"
          />
        </FormControl>
        <FormControl id="confirmPassword" isRequired>
          <FormLabel>Confirm password</FormLabel>
          <Input
            placeholder="Confirm password"
            _placeholder={{ color: "gray.500" }}
            type="password"
          />
        </FormControl>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            onClick={() => navigate("/")}
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
          >
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            type="submit"
            loadingText="Saving"
            bg={"blue.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "blue.500",
            }}
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
