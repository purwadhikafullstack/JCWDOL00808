import { Box, FormControl, FormLabel, Input, Select, Text, VStack, useDisclosure, useToast, FormErrorMessage } from "@chakra-ui/react";
import axios from "axios";
import AddAdminConfirmation from "../../components/AddAdminConfirmation";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const RegisterAdmin = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      password: "",
      phone_number: "",
      role: "",
      image: null,
    },
    validationSchema: Yup.object({
      full_name: Yup.string().required("Full Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(8, "Password must have 8 character").required("Password is required"),
      phone_number: Yup.string().required("Phone Number is required"),
      role: Yup.string().required("Role is required"),
      image: Yup.mixed().required("Profile Image is required"),
    }),
    onSubmit: async (values) => {
      try {
        await registerUser(values);
      } catch (error) {
        toast({
          title: `${error.message}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });

  // function validateFormikValues(values) {
  //   const errors = {};
  //   if (!values.full_name) {
  //     errors.full_name = "Full Name is required";
  //   }
  //   if (!values.email) {
  //     errors.email = "Email is required";
  //   } else if (!/\S+@\S+\.\S+/.test(values.email)) {
  //     errors.email = "Invalid email address";
  //   }
  //   if (!values.password) {
  //     errors.password = "Password is required";
  //   } else if (values.password.length < 8) {
  //     errors.password = "Password must have 8 characters";
  //   }
  //   if (!values.phone_number) {
  //     errors.phone_number = "Phone Number is required";
  //   }
  //   if (!values.role) {
  //     errors.role = "Role is required";
  //   }
  //   if (!values.image) {
  //     errors.image = "Profile Image is required";
  //   }
  //   return errors;
  // }

  // function handleSubmitWithConfirmation() {
  //   // Lakukan validasi
  //   const errors = validateFormikValues(formik.values);

  //   // Jika ada error, munculkan error message di formik
  //   if (Object.keys(errors).length > 0) {
  //     formik.setErrors(errors);
  //     return;
  //   }

  //   // Buka dialog alert
  //   onOpen();
  // }

  const registerUser = async (values) => {
    try {
      const formData = new FormData();
      formData.append("full_name", values.full_name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("phone_number", values.phone_number);
      formData.append("role", values.role);
      formData.append("profile_picture", values.image);

      await axios.post("http://localhost:8000/admin/registerAdmin", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/admin/ManageAdmin");
    } catch (error) {
      toast({
        title: `${error.response.data.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="100%" maxW="600px" mx="auto" my="auto" mt="3" mb="10">
      <Text fontSize="xl" fontWeight="bold" mb="4">
        Register Admin
      </Text>
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing="1" align="stretch">
          <FormControl id="fullName" isRequired isInvalid={formik.touched.full_name && formik.errors.full_name}>
            <FormLabel>Full Name</FormLabel>
            <Input type="text" {...formik.getFieldProps("full_name")} placeholder="Input Admin Full Name" />
            <FormErrorMessage>{formik.errors.full_name}</FormErrorMessage>
          </FormControl>

          <FormControl id="email" isRequired isInvalid={formik.touched.email && formik.errors.email}>
            <FormLabel>Email</FormLabel>
            <Input type="email" {...formik.getFieldProps("email")} placeholder="Input Admin Email" />
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl id="password" isRequired isInvalid={formik.touched.password && formik.errors.password}>
            <FormLabel>Password</FormLabel>
            <Input type="password" {...formik.getFieldProps("password")} placeholder="Input Admin Password" />
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          </FormControl>

          <FormControl id="phoneNumber" isRequired isInvalid={formik.touched.phone_number && formik.errors.phone_number}>
            <FormLabel>Phone Number</FormLabel>
            <Input type="tel" {...formik.getFieldProps("phone_number")} placeholder="Input Phone Number" />
            <FormErrorMessage>{formik.errors.phone_number}</FormErrorMessage>
          </FormControl>

          <FormControl id="role" isRequired isInvalid={formik.touched.role && formik.errors.role}>
            <FormLabel>Role</FormLabel>
            <Select placeholder="Choose Admin Role" {...formik.getFieldProps("role")}>
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

          <FormControl id="image" isRequired isInvalid={formik.touched.image && formik.errors.image}>
            <FormLabel>Profile Image</FormLabel>
            <Input type="file" onChange={(event) => formik.setFieldValue("image", event.target.files[0])} />
            <FormErrorMessage>{formik.errors.image}</FormErrorMessage>
          </FormControl>

          <AddAdminConfirmation isOpen={isOpen} onClose={onClose} onSave={formik.handleSubmit} />
        </VStack>
      </form>
    </Box>
  );
};

export default RegisterAdmin;
