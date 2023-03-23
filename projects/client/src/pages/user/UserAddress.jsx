import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  useToast,
  Switch,
  HStack,
  Text,
  IconButton,
  Flex,
  Select,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
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

   const getProvinceData = () => {
    axios.get(`http://localhost:8000/warehouses/getProvinceData`)
      .then((response) => {
        console.log(response.data);
        setProvinceData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  

  const onGetCity = (province_id) => {
    // console.log("province_id:", province_id)
    axios.get(`http://localhost:8000/warehouses/getCityData?province_id=${province_id}`)
      .then((response) => {
        console.log("dari onGetCity: ", response.data);
        setCityData(response.data);

        // setProvince("");
        // setCity("");
      })
      .catch((err) => {
        console.log(err);
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
      await axios.put(`http://localhost:8000/address/edit-address${id}`, values);
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
      await axios.delete(`/api/addresses/${id}`);
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
    <Box>
      <Heading>User Addresses</Heading>
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
           <Select  {...formik.getFieldProps("is_primary")}
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
              <IconButton
                onClick={() => handleEditAddress(address.id, formik.values)}
                icon={<EditIcon />}
                colorScheme="blue"
                aria-label="Edit Address"
                isRound
                mr={2}
              />
              <IconButton
                onClick={() => handleDeleteAddress(address.id)}
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
  );
};

export default UserAddress;
