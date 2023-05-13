import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Flex,
  VStack,
  useToast,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  Button,
  Checkbox,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import AddAdminConfirmation from "./AddConfirmation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

const RegisterAdminModal = ({ isOpen, onClose, onAdminPatch }) => {
  const toast = useToast();
  const [image, setImage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      password: "",
      confirmed_password: "",
      phone_number: "",
      role: "",
      profile_picture: null,
    },
    validationSchema: Yup.object({
      full_name: Yup.string().required("Full Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must have 8 character")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
        )
        .required("Password is required"),
      confirmed_password: Yup.string() //  validasi untuk confirmed_password
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
      phone_number: Yup.string().required("Phone Number is required"),
      role: Yup.string().required("Role is required"),
      profile_picture: Yup.mixed()
        .test("fileType", "Invalid image format", (value) => {
          if (value && value.length) {
            const fileType = value[0].type;
            return (
              fileType === "image/png" ||
              fileType === "image/jpg" ||
              fileType === "image/jpeg"
            );
          }
          return true;
        })
        .required("Image is required"),
    }),
    onSubmit: async (values) => {
      try {
        await registerUser(values);
      } catch (error) {
        toast({
          title: `${error.response.data.message}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });

  const registerUser = async (values) => {
    try {
      const formData = new FormData();
      formData.append("full_name", values.full_name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("phone_number", values.phone_number);
      formData.append("role", values.role);
      formData.append("profile_picture", values.profile_picture[0]);

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/admin/registerAdmin`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onClose();
      onAdminPatch();
      formik.resetForm();
      setImage("");
      toast({
        title: `Add Admin Success`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: `${error.response.data.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setImage(e.target.result);
    };

    reader.readAsDataURL(file);
    formik.setFieldValue("profile_picture", event.currentTarget.files);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Register Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" maxW="600px" mx="auto" my="auto" mt="3" mb="10">
              <form
                onSubmit={formik.handleSubmit}
                style={{ margin: "auto", width: "100%" }}
              >
                <VStack spacing="1" align="stretch">
                  <FormControl
                    id="fullName"
                    isRequired
                    isInvalid={
                      formik.touched.full_name && formik.errors.full_name
                    }
                  >
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      type="text"
                      {...formik.getFieldProps("full_name")}
                      placeholder="Input Admin Full Name"
                    />
                    <FormErrorMessage>
                      {formik.errors.full_name}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    id="email"
                    isRequired
                    isInvalid={formik.touched.email && formik.errors.email}
                  >
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      {...formik.getFieldProps("email")}
                      placeholder="Input Admin Email"
                    />
                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    id="password"
                    isRequired
                    isInvalid={
                      formik.touched.password && formik.errors.password
                    }
                  >
                    <FormLabel>Password</FormLabel>
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...formik.getFieldProps("password")}
                      placeholder="Input Admin Password"
                    />
                    <FormErrorMessage>
                      {formik.errors.password}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    id="confirmed_password"
                    isRequired
                    isInvalid={
                      formik.touched.confirmed_password &&
                      formik.errors.confirmed_password
                    }
                  >
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...formik.getFieldProps("confirmed_password")}
                      placeholder="Confirm Admin Password"
                    />
                    <FormErrorMessage>
                      {formik.errors.confirmed_password}
                    </FormErrorMessage>
                  </FormControl>

                  {/*  Checkbox untuk menampilkan password */}
                  <Stack>
                    <Checkbox
                      onChange={(e) => setShowPassword(e.target.checked)}
                      isChecked={showPassword}
                    >
                      Show Password
                    </Checkbox>
                  </Stack>

                  <FormControl
                    id="phoneNumber"
                    isRequired
                    isInvalid={
                      formik.touched.phone_number && formik.errors.phone_number
                    }
                  >
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      type="tel"
                      {...formik.getFieldProps("phone_number")}
                      placeholder="Input Phone Number"
                    />
                    <FormErrorMessage>
                      {formik.errors.phone_number}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    id="role"
                    isRequired
                    isInvalid={formik.touched.role && formik.errors.role}
                  >
                    <FormLabel>Role</FormLabel>
                    <Select
                      placeholder="Choose Admin Role"
                      {...formik.getFieldProps("role")}
                    >
                      {[
                        { value: "1", label: "Admin" },
                        { value: "2", label: "Admin Warehouse" },
                      ].map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>{formik.errors.role}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    mb={2}
                    id="profile_picture"
                    isInvalid={
                      formik.touched.profile_picture &&
                      formik.errors.profile_picture
                    }
                  >
                    <FormLabel>Profile Picture</FormLabel>
                    <Flex>
                      <Box w={16} h={16} mr={4}>
                        {image && <Image src={image} alt="Produk" />}
                      </Box>
                      <Box>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <FormErrorMessage>
                          {formik.errors.profile_picture}
                        </FormErrorMessage>
                      </Box>
                    </Flex>
                  </FormControl>

                  {/* button for cancel and submit */}
                  <Flex justifyContent="flex-end">
                    <Button
                      variant="ghost"
                      mr={1}
                      onClick={() => {
                        onClose();
                        formik.resetForm();
                        setImage("");
                      }}
                    >
                      Cancel
                    </Button>
                    <AddAdminConfirmation onSave={formik.handleSubmit} />
                  </Flex>
                </VStack>
              </form>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RegisterAdminModal;
