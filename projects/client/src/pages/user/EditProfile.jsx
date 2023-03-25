import {
  Avatar,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Center,
  Tooltip,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import ChangePassword from "../../components/ChangePassword";
import RemovePicConfirmation from "../../components/RemovePicConfirmation";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { isAuth } from "../../apis/userAPIs";

export default function EditProfile() {
  const [profile, setProfile] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { isOpen, onClose } = useDisclosure();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const profilePicture = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem("token");

  const handlePictureChange = async (event) => {
    try {
      const image = event.target.files[0];
      const formData = new FormData();
      formData.append("profile_picture", image);
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/user/profile/picture`,
        formData,
        {
          headers: { Authorization: token },
        }
      );
      setRefresh(!refresh);

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
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/user/profile/picture`,
        {
          headers: { Authorization: token },
        }
      );
      toast({
        title: response?.data?.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setRefresh(!refresh);
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
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/user/profile/`,
        values,
        {
          headers: { Authorization: token },
        }
      );
      setIsLoading(false);
      toast({
        title: response?.data?.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: error?.response?.data?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    isAuth(navigate, true).then((data) => setProfile(data));
  }, [refresh]);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    fullName: Yup.string()
      .min(3, "Name minimum 3 character")
      .max(30, "Name maximum 30 character")
      .required("Full name is required"),
    phoneNumber: Yup.string()
      .min(10, "Phone number minimum 10 number")
      .max(14, "Phone number maximum 14 number")
      .required("Phone number is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: profile?.full_name || "",
      email: profile?.email || "",
      phoneNumber: profile?.phone_number || "",
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
          <FormLabel>Profile Picture</FormLabel>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar
                crossOrigin="true"
                size="xl"
                src={
                  profile?.profile_picture
                    ? `${process.env.REACT_APP_API_BASE_URL}/${profile?.profile_picture}`
                    : null
                }
                border="2px"
                borderColor="papayawhip"
              >
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
                name="profile_picture"
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
        <FormControl
          id="fullName"
          isRequired
          isInvalid={formik.touched.fullName && formik.errors.fullName}
        >
          <FormLabel>Full Name</FormLabel>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.fullName}
            placeholder="Full name"
            _placeholder={{ color: "gray.500" }}
          />
          <FormErrorMessage>{formik.errors.fullName}</FormErrorMessage>
        </FormControl>
        <FormControl
          id="email"
          isInvalid={formik.touched.email && formik.errors.email}
        >
          <FormLabel>Email Address</FormLabel>
          <Tooltip
            hasArrow
            label="to change email address, please contact our customer service"
          >
            <Input
              isDisabled
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
            />
          </Tooltip>
          <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
        </FormControl>
        <FormControl
          id="phoneNumber"
          isRequired
          isInvalid={formik.touched.phoneNumber && formik.errors.phoneNumber}
        >
          <FormLabel>Phone Number</FormLabel>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.phoneNumber}
            placeholder="082123456xxx"
            _placeholder={{ color: "gray.500" }}
          />
          <FormErrorMessage>{formik.errors.phoneNumber}</FormErrorMessage>
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
            onClick={formik.handleSubmit}
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
        {showChangePassword ? (
          <></>
        ) : (
          <Button
            type="button"
            onClick={() => setShowChangePassword(true)}
            colorScheme="green"
          >
            Change Password
          </Button>
        )}

        {showChangePassword ? (
          <ChangePassword onCancel={() => setShowChangePassword(false)} />
        ) : (
          <></>
        )}
      </Stack>
    </Flex>
  );
}
