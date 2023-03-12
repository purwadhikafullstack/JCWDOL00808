import { useRef } from "react";
import { Box, FormControl, FormLabel, Input, Select, Text, VStack, useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import AddAdminConfirmation from "../../components/AddAdminConfirmation";
import { useNavigate } from "react-router-dom";

const RegisterAdmin = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const navigate = useNavigate();

  let full_name = useRef();
  let email = useRef();
  let password = useRef();
  let phone_number = useRef();
  let role = useRef();
  let image = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      //   await registerUser();
    } catch (error) {
      toast({
        title: `${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const registerUser = async () => {
    try {
      let inputFullName = full_name.current.value;
      let inputEmail = email.current.value;
      let inputPassword = password.current.value;
      let inputPhoneNumber = phone_number.current.value;
      let inputRole = role.current.value;
      let inputImage = image.current.files[0];

      const formData = new FormData();
      formData.append("full_name", inputFullName);
      formData.append("email", inputEmail);
      formData.append("password", inputPassword);
      formData.append("phone_number", inputPhoneNumber);
      formData.append("role", inputRole);
      formData.append("profile_picture", inputImage);

      await axios.post("http://localhost:8000/admin/registerAdmin", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/admin/ManageAdmin");
    } catch (error) {
      //   throw new Error(error.response.data.message);
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
      <form onSubmit={handleSubmit}>
        <VStack spacing="1" align="stretch">
          <FormControl id="fullName" isRequired>
            <FormLabel>Full Name</FormLabel>
            <Input type="text" ref={full_name} placeholder="Input Admin Full Name" />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" ref={email} placeholder="Input Admin Email" />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" ref={password} placeholder="Input Admin Password" />
          </FormControl>
          <FormControl id="phoneNumber" isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input type="tel" ref={phone_number} placeholder="Input Phone Number" />
          </FormControl>
          <FormControl id="role" isRequired>
            <FormLabel>Role</FormLabel>
            <Select placeholder="Choose Admin Role" ref={role}>
              <option value="1">Admin</option>
              <option value="2">Admin Warehouse</option>
            </Select>
          </FormControl>
          <FormControl id="image" isRequired>
            <FormLabel>Profile Image</FormLabel>
            <Input type="file" ref={image} />
          </FormControl>
          <AddAdminConfirmation isOpen={isOpen} onClose={onClose} onSave={registerUser} />
        </VStack>
      </form>
    </Box>
  );
};

export default RegisterAdmin;
