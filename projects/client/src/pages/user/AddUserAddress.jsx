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
import { EditIcon, DeleteIcon, CloseIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";
const token = localStorage.getItem("token");


const AddUserAddress = () => {
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

  useEffect(() => {
      fetchAddresses();
      getProvinceData();
  }, []);

  const fetchAddresses = async () => {
    try {
      // Replace with your API endpoint to get all addresses
      const response = await axios.get("http://localhost:8000/address/get-address", 
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
      <Link to="/user/address">
        <IconButton icon={<CloseIcon />} aria-label="Back Button" colorScheme="blue" />
      </Link>
    </HStack>
      <Heading>Address List</Heading>
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={4} mt={4} mx="auto" maxW="480px">
          <FormControl
            isInvalid={formik.errors.address && formik.touched.address}
          >
            <FormLabel htmlFor="address">Address</FormLabel>
            <Input
              id="address"
              name="address"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
            />
            <FormErrorMessage>{formik.errors.address}</FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={formik.errors.province && formik.touched.province}
          >
            <FormLabel htmlFor="province">Province</FormLabel>
            <Select
              id="province"
              name="province"
              placeholder=" "
              // type="text"
              // onChange={formik.handleChange}
              onChange={(element) => {
                setProvince(element.target.value.split(",")[1]);
                onGetCity(element.target.value.split(","[0]));
                formik.handleChange(element)
              }}
              // onBlur={formik.handleBlur}
              value={formik.values.province}
            >
               {provinceData.map((value) => {
                return (
                  <option value={value.province_id + "," + value.province} key={value.province_id}>
                    {value.province}
                  </option>
                );
              })}
            </Select>
            <FormErrorMessage>{formik.errors.province}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={formik.errors.city && formik.touched.city}>
            <FormLabel htmlFor="city">City</FormLabel>
            <Select
              id="city"
              name="city"
              placeholder=" "
              // type="text"
              // onChange={formik.handleChange}
              onChange={(element) => {
                setCity(element.target.value)
                formik.handleChange(element)
              }}
              onBlur={formik.handleBlur}
              value={formik.values.city}
              
            >
              {cityData.map((value) => {
                  return (
                    <option value={`${value.type} ${value.city_name}`} key={value.city_id}>
                      {value.type} {value.city_name}
                    </option>
                  );
                })}
              </Select>
            <FormErrorMessage>{formik.errors.city}</FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={formik.errors.district && formik.touched.district}
          >
            <FormLabel htmlFor="district">District</FormLabel>
            <Input
              id="district"
              name="district"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.district}
            />
            <FormErrorMessage>{formik.errors.district}</FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={formik.errors.postal_code && formik.touched.postal_code}
          >
            <FormLabel htmlFor="postal_code">Postal Code</FormLabel>
            <Input
              id="postal_code"
              name="postal_code"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.postal_code}
            />
            <FormErrorMessage>{formik.errors.postal_code}</FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={formik.errors.recipient && formik.touched.recipient}
          >
            <FormLabel htmlFor="recipient">Recipient</FormLabel>
            <Input
              id="recipient"
              name="recipient"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.recipient}
            />
            <FormErrorMessage>{formik.errors.recipient}</FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={
              formik.errors.phone_number && formik.touched.phone_number
            }
          >
            <FormLabel htmlFor="phone_number">Phone Number</FormLabel>
            <Input
              id="phone_number"
              name="phone_number"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone_number}
            />
            <FormErrorMessage>{formik.errors.phone_number}</FormErrorMessage>
          </FormControl>
          <FormControl 
            isInvalid={
              formik.errors.is_primary && formik.touched.is_primary
            }
          >
           <FormLabel htmlFor="is_primary">Primary Address</FormLabel> 
           <Select 
           id="is_primary"
           name="is_primary"
           type="number"
           placeholder=" " 
           {...formik.getFieldProps("is_primary")}
           onChange={formik.handleChange}>
              {[
                { value: 1, label: "Yes" },
                { value: 0, label: "No" },
              ].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              
            </Select>
            <FormErrorMessage>{formik.errors.is_primary}</FormErrorMessage>
          </FormControl> 
    
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={formik.isSubmitting}
          >
            Add Address
          </Button>
        </VStack>
      </form>
      {/* <VStack mt={8} w="100%" spacing={4}>
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
      </VStack> */}
    </Box>
    {/* <Modal isOpen={isOpen} onClose={onClose}>
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
  </Modal> */}
    </>
  );
};

export default AddUserAddress;
