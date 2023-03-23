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
  Select
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
const token = localStorage.getItem("token");

const EditUserAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  // nampung hasil get dari raja ongkir
  const [provinceData, setProvinceData] = useState([]);
  const [cityData, setCityData] = useState([]);

  // nampung province dan city pilihan admin
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");

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
  }, []);;

  const fetchAddresses = async () => {
    try {
      // Replace with your API endpoint to get all addresses
      const response = await axios.get(`http://localhost:8000/address/get-address/${id}`, 
      {
        headers: { Authorization: token },
      });
      const addressData = response.data
      formik.setValues({
        address: addressData.address,
        district: addressData.district,
        city: addressData.city,
        province: addressData.province,
        postal_code: addressData.postal_code,
        recipient: addressData.recipient,
        phone_number: addressData.phone_number,
        is_primary: addressData.is_primary,

      })
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
    onSubmit: handleEditAddress,
  });

  return (
    <>
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
      
    </Box>
    </>
  );
};

export default EditUserAddress;
