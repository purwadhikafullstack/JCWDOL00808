import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  Button,
  HStack,
  Switch,
  Text,
  Flex,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  useToast
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, CloseIcon, SearchIcon, AddIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";
const token = localStorage.getItem("token");


const UserAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const toast = useToast();

   // nampung hasil get dari raja ongkir
   const [provinceData, setProvinceData] = useState([]);
   const [cityData, setCityData] = useState([]);
 
   // nampung province dan city pilihan admin
   const [province, setProvince] = useState("");
   const [city, setCity] = useState("");

   //modal delete address
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [addressToDelete, setAddressToDelete] = React.useState(null);

   const handleDeleteButtonClick = (addressId) => {
    setAddressToDelete(addressId);
    onOpen();
  };

  // search state
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAddresses();
    getProvinceData();
}, [searchTerm]);

  const handleConfirmDelete = async () => {
    await handleDeleteAddress(addressToDelete);
    setAddressToDelete(null);
    onClose();
  };

   const getProvinceData = () => {
    axios.get(`http://localhost:8000/warehouses/getProvinceData`)
      .then((response) => {
        setProvinceData(response.data);
      })
      .catch((error) => {
        toast({
          title: "Error fetching data.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const onGetCity = (province_id) => {
    // console.log("province_id:", province_id)
    axios.get(`http://localhost:8000/warehouses/getCityData?province_id=${province_id}`)
      .then((response) => {
        
        setCityData(response.data);
      })
      .catch((error) => {
        toast({
          title: "Error fetching data.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // useEffect(() => {
  //     fetchAddresses();
  //     getProvinceData();
  // }, []);

  const fetchAddresses = async () => {
    try {
      // Replace with your API endpoint to get all addresses
      const response = await axios.get(`http://localhost:8000/address/get-address?search_query=${searchTerm}`, 
      {
        headers: { Authorization: token },
      });
      setAddresses(response.data.result);
      
    } catch (error) {
      toast({
        title: "Error fetching addresses.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddAddress = async (values, { setSubmitting, resetForm }) => {
    try {
      
      // Replace with your API endpoint to add an address
      const response = await axios.post("http://localhost:8000/address/add-address", values,
      {
        headers: { Authorization: token },
      });
      setAddresses([...addresses, response.data]);
      fetchAddresses()
      toast({
        title: "Address added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      resetForm();
    } catch (error) {
      toast({
        title: "Error adding address.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditAddress = async (id, values) => {
    try {
      // Replace with your API endpoint to update an address
      await axios.put(`http://localhost:8000/address/edit-address/${id}`, values);
      toast({
        title: "Address updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchAddresses();
    } catch (error) {
      toast({
        title: "Error updating address.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      // Replace with your API endpoint to delete an address
      await axios.delete(`http://localhost:8000/address/delete-address/${id}`);
      toast({
        title: "Address deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchAddresses();
    } catch (error) {
      toast({
        title: "Error deleting address.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      address: "",
      district: "",
      city: "",
      province: "",
      postal_code: "",
      recipient: "",
      phone_number: "",
      is_primary: "",
    },
    validationSchema: Yup.object({
      address: Yup.string().required("Required"),
      district: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      province: Yup.string().required("Required"),
      postal_code: Yup.string().required("Required"),
      recipient: Yup.string().required("Required"),
      phone_number: Yup.string().required("Required"),
      is_primary: Yup.number().required("Required"),
    }),
    onSubmit: handleAddAddress,
  });

  return (
    <>
    <Box>
    <HStack mb={4} mt= {2} mr={4} justify="flex-end">
      <Link to="/">
        <IconButton icon={<CloseIcon />} aria-label="Back Button" colorScheme="blue" />
      </Link>
    </HStack>
    <Heading mb={10}>Address List</Heading>
    <HStack mb={4} mt={2} mr={4} justify="center">
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            maxW="200px"
          />
          {/* <IconButton icon={<SearchIcon />} aria-label="Search" colorScheme="blue" /> */}
          <Link to="/user/add-address">
            <IconButton icon={<AddIcon />} aria-label="Add Address" colorScheme="blue" />
          </Link>
        </HStack>
      <VStack mt={8} w="100%" spacing={4}>
        {addresses.map((address) => (
          <Box
            key={address.id}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            w="100%"
          >
            <Text>
              {address.recipient} - {address.phone_number}
            </Text>
            <Text>
              {address.address}, {address.district}, {address.city},{" "}
              {address.province}, {address.postal_code}
            </Text>
            <Flex justify="flex-end">
              <Link to={`/user/address/${address.id}`}>
              <IconButton
                // onClick={() => handleEditAddress(address.id, formik.values)}
                icon={<EditIcon />}
                colorScheme="blue"
                aria-label="Edit Address"
                isRound
                mr={2}
                />
              </Link>
              <IconButton
                onClick={() => handleDeleteButtonClick(address.id)}
                icon={<DeleteIcon />}
                colorScheme="red"
                aria-label="Delete Address"
                isRound
              />
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Delete Address</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        Are you sure you want to delete this address? This action cannot be undone.
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="red" mr={3} onClick={handleConfirmDelete}>
          Delete
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
    </>
  );
};

export default UserAddress;
