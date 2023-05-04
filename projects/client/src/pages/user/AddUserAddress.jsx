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
  IconButton,
  Select,
  useToast,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
const token = localStorage.getItem("user_token");

const AddUserAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const toast = useToast();

  // nampung hasil get dari raja ongkir
  const [provinceData, setProvinceData] = useState([]);
  const [cityData, setCityData] = useState([]);

  // nampung province dan city pilihan
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");

  const location = useLocation();

  const getProvinceData = () => {
    axios
      .get(`http://localhost:8000/warehouses/getProvinceData`)
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
    axios
      .get(
        `http://localhost:8000/warehouses/getCityData?province_id=${province_id}`
      )
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
    getProvinceData();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/address/get-address`,
        {
          headers: { Authorization: token },
        }
      );
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
      const response = await axios.post(
        `http://localhost:8000/address/add-address`,
        values,
        {
          headers: { Authorization: token },
        }
      );
      setAddresses([...addresses, response.data]);
      fetchAddresses();
      toast({
        title: "Address added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      resetForm();

      if (location.pathname === "/user/add-address/checkout") {
        window.location.href = "/user/checkout";
      }
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

  const phoneRegExp =
    /^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/;
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
      phone_number: Yup.string()
        .matches(phoneRegExp, "Phone number is not valid")
        .required("Required"),
      is_primary: Yup.number().required("Required"),
    }),
    onSubmit: handleAddAddress,
  });

  return (
    <>
      <Box mb={4} w={"full"}>
        <HStack mb={-2} mt={2} mr={4} justify="flex-end">
          <Link
            to={
              location.pathname === "/user/add-address/checkout"
                ? "/user/checkout"
                : "/user/address"
            }>
            <IconButton
              icon={<CloseIcon />}
              aria-label="Back Button"
              variant="buttonBlack"
            />
          </Link>
        </HStack>
        <Heading fontFamily="Oswald">Add Address</Heading>
        <form onSubmit={formik.handleSubmit}>
          <VStack spacing={2} mt={4} mx="auto" maxW="480px">
            <FormControl
              isInvalid={formik.errors.address && formik.touched.address}>
              <FormLabel htmlFor="address" fontFamily="Oswald" fontSize="lg">
                Address
              </FormLabel>
              <Input
                id="address"
                name="address"
                type="text"
                fontFamily="Roboto"
                borderRadius={0}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
              />
              <FormErrorMessage>{formik.errors.address}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={formik.errors.province && formik.touched.province}>
              <FormLabel htmlFor="province" fontFamily="Oswald" fontSize="lg">
                Province
              </FormLabel>
              <Select
                id="province"
                name="province"
                placeholder=" "
                fontFamily="Roboto"
                borderRadius={0}
                onChange={(element) => {
                  setProvince(element.target.value.split(",")[1]);
                  onGetCity(element.target.value.split(","[0]));
                  formik.handleChange(element);
                }}
                value={formik.values.province}>
                {provinceData.map((value) => {
                  return (
                    <option
                      value={value.province_id + "," + value.province}
                      key={value.province_id}>
                      {value.province}
                    </option>
                  );
                })}
              </Select>
              <FormErrorMessage>{formik.errors.province}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={formik.errors.city && formik.touched.city}>
              <FormLabel htmlFor="city" fontFamily="Oswald" fontSize="lg">
                City
              </FormLabel>
              <Select
                id="city"
                name="city"
                placeholder=" "
                fontFamily="Roboto"
                borderRadius={0}
                onChange={(element) => {
                  setCity(element.target.value);
                  formik.handleChange(element);
                }}
                onBlur={formik.handleBlur}
                value={formik.values.city}>
                {cityData.map((value) => {
                  return (
                    <option
                      value={`${value.type} ${value.city_name}`}
                      key={value.city_id}>
                      {value.type} {value.city_name}
                    </option>
                  );
                })}
              </Select>
              <FormErrorMessage>{formik.errors.city}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={formik.errors.district && formik.touched.district}>
              <FormLabel htmlFor="district" fontFamily="Oswald" fontSize="lg">
                District
              </FormLabel>
              <Input
                id="district"
                name="district"
                type="text"
                fontFamily="Roboto"
                borderRadius={0}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.district}
              />
              <FormErrorMessage>{formik.errors.district}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={
                formik.errors.postal_code && formik.touched.postal_code
              }>
              <FormLabel
                htmlFor="postal_code"
                fontFamily="Oswald"
                fontSize="lg">
                Postal Code
              </FormLabel>
              <Input
                id="postal_code"
                name="postal_code"
                type="text"
                fontFamily="Roboto"
                borderRadius={0}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.postal_code}
              />
              <FormErrorMessage>{formik.errors.postal_code}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={formik.errors.recipient && formik.touched.recipient}>
              <FormLabel htmlFor="recipient" fontFamily="Oswald" fontSize="lg">
                Recipient
              </FormLabel>
              <Input
                id="recipient"
                name="recipient"
                type="text"
                fontFamily="Roboto"
                borderRadius={0}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.recipient}
              />
              <FormErrorMessage>{formik.errors.recipient}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={
                formik.errors.phone_number && formik.touched.phone_number
              }>
              <FormLabel
                htmlFor="phone_number"
                fontFamily="Oswald"
                fontSize="lg">
                Phone Number
              </FormLabel>
              <Input
                id="phone_number"
                name="phone_number"
                type="text"
                fontFamily="Roboto"
                borderRadius={0}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone_number}
              />
              <FormErrorMessage>{formik.errors.phone_number}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={formik.errors.is_primary && formik.touched.is_primary}>
              <FormLabel htmlFor="is_primary" fontFamily="Oswald" fontSize="lg">
                Primary Address
              </FormLabel>
              <Select
                id="is_primary"
                name="is_primary"
                type="number"
                fontFamily="Roboto"
                borderRadius={0}
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
              variant="buttonBlack"
              isLoading={formik.isSubmitting}>
              Add Address
            </Button>
          </VStack>
        </form>
      </Box>
    </>
  );
};

export default AddUserAddress;
