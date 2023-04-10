import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Text,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  cartSelector,
  getCarts,
  getTotalPriceInCart,
  getTotalProductsInCart,
  getTotalWeightInCart,
} from "../../reducers/cartSlice";
import ScrollToTopButton from "../../components/ScrollToTopButton";

import { Link, useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";

const Checkout = () => {
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [warehouseAddresses, setWarehouseAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedAddressID, setSelectedAddressId] = useState("");
  const [newAddress, setNewAddress] = useState("");
  // const [shippingCost, setShippingCost] = useState(null);
  const [courierSelect, setCourierSelect] = useState(null);
  const [shippingMethod, setShippingMethod] = useState(null);
  const [finalCost, setFinalCost] = useState(null);
  const [shippingCosts, setShippingCosts] = useState([]);
  const [nearestWarehouse, setNearestWarehouse] = useState(null);

  const courierRef = useRef(null);
  const costRef = useRef(null);

  const token = localStorage.getItem("token");

  const carts = useSelector(cartSelector.selectAll);
  const subtotal = useSelector(getTotalPriceInCart);
  const totalProductsInCart = useSelector(getTotalProductsInCart);
  const totalWeightInCart = useSelector(getTotalWeightInCart);

  const dispatch = useDispatch();

  const toast = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
    fetchWarehouseData();
  }, []);

  function haversineDistance(lat1, lon1, lat2, lon2) {
    function toRad(x) {
      return (x * Math.PI) / 180;
    }

    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  function findShortestDistance(baseLat, baseLon, locations) {
    let shortestDistance = Infinity;
    let nearestLocation;

    for (const location of locations) {
      const distance = haversineDistance(
        baseLat,
        baseLon,
        location.latitude,
        location.longitude
      );

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestLocation = location;
      }
    }

    return nearestLocation;
  }

  function extractCityTypeAndName(fullName) {
    const match = fullName.match(/(Kabupaten|Kota) (.+)/i);
    if (match) {
      return [match[1], match[2]];
    }
    return [null, null];
  }

  const fetchShippingCost = async (
    originName,
    destinationName,
    totalWeight,
    courier
  ) => {
    try {
      const citiesResponse = await axios.get(
        `http://localhost:8000/warehouses/getCityData?province_id=`
      );
      const cities = citiesResponse.data;

      // console.log(cities)

      const [originType, originCityName] = extractCityTypeAndName(originName);
      const [destinationType, destinationCityName] =
        extractCityTypeAndName(destinationName);

      const originId = cities.find(
        (city) =>
          city.type.toLowerCase() === originType.toLowerCase() &&
          city.city_name.toLowerCase() === originCityName.toLowerCase()
      ).city_id;
      const destinationId = cities.find(
        (city) =>
          city.type.toLowerCase() === destinationType.toLowerCase() &&
          city.city_name.toLowerCase() === destinationCityName.toLowerCase()
      ).city_id;

      // Calculate shipping cost
      const costUrl = `http://localhost:8000/warehouses/getCostData?originName=${originId}&destinationName=${destinationId}&totalWeight=${totalWeight}&courier=${courier}`;
      const costResponse = await axios.get(costUrl);

      const shippingInfoResponse = costResponse.data[0]?.costs;

      setShippingCosts(shippingInfoResponse);

      // shippingInfo.forEach((cost) => {
      //   console.log(`Service: ${cost.service} - Cost: ${cost.cost[0].value} - Estimated days: ${cost.cost[0].etd}`);
      // });
    } catch (error) {
      console.error("Error fetching shipping cost:", error);
    }
  };

  // fetchShippingCost(originName, destinationName);

  const fetchWarehouseData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/warehouses/getAllWarehouse`
      );

      setWarehouseAddresses(response.data);
      // console.log(response.data);
    } catch (error) {
      toast({
        title: "Error fetching addresses.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchAddresses = async () => {
    try {
      // Replace with your API endpoint to get all addresses
      const response = await axios.get(
        `http://localhost:8000/address/get-address?`,
        {
          headers: { Authorization: token },
        }
      );
      setAddresses(response.data.result);
      // console.log("log dari address" + response.data.result);
      // console.log(response.data.result);
    } catch (error) {
      toast({
        title: "Error fetching addresses.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };

  const handleNewAddressChange = (e) => {
    setNewAddress(e.target.value);
  };

  const addNewAddress = async () => {
    try {
      // const response = await axios.post('/api/addresses', { address: newAddress });
      // setAddresses([...addresses, response.data]);
      // setSelectedAddress(response.data.id);
      // setNewAddress('');
    } catch (error) {
      console.error("Error adding new address:", error);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAddressSelect = (e) => {
    const selected = JSON.parse(e.target.value);
    const selectedAddressID = JSON.parse(e.target.value).id;
    setSelectedAddress(selected);
    setSelectedAddressId(selectedAddressID);
    const nearest = findShortestDistance(
      selected.latitude,
      selected.longitude,
      warehouseAddresses
    );
    setNearestWarehouse(nearest);

    formik.values.user_addresses_id = selectedAddressID;
    formik.values.warehouses_id = nearest.id;

    if (courierRef.current) {
      courierRef.current.value = "";
    }
    if (costRef.current) {
      costRef.current.value = "";
    }

    // const shippingCost = fetchShippingCost(selected.city, nearest.city)
    // fetchShippingCost(selected.city, nearest.city, totalWeightInCart)
    setFinalCost(null);
    onClose();
  };

  const handleCostSelect = (e) => {
    const selectedCost = JSON.parse(e.target.value).cost[0].value;
    const selectedService = JSON.parse(e.target.value).service;

    setShippingMethod(`${courierSelect} - ${selectedService}`);
    setFinalCost(selectedCost);

    formik.values.total_price = subtotal;
    formik.values.shipping_method = `${courierSelect} - ${selectedService}`;
    formik.values.shipping_cost = selectedCost;
  };

  const handleCourierSelect = (e) => {
    const selectedCourier = e.target.value;

    setCourierSelect(selectedCourier);

    fetchShippingCost(
      selectedAddress?.city,
      nearestWarehouse?.city,
      totalWeightInCart,
      selectedCourier
    );
    setFinalCost(null);

    if (costRef.current) {
      costRef.current.value = "";
    }

    onClose();
  };

  const handleNewAddressSubmit = async (newAddress) => {
    try {
      const response = await axios.post("/api/addresses", {
        address: newAddress,
      });
      setAddresses([...addresses, response.data]);
    } catch (error) {
      console.error("Error adding new address:", error);
    }
  };

  const handleAddOrder = async (values, { setSubmitting, resetForm }) => {
    try {
      // Replace with your API endpoint to add an address
      const response = await axios.post(
        "http://localhost:8000/orders/add-order",
        values,
        {
          headers: { Authorization: token },
        }
      );
      setOrders([...orders, response.data]);

      toast({
        title: "Orders added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      resetForm();
    } catch (error) {
      toast({
        title: "Error adding order.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      total_price: "",
      status: "Waiting for payment",
      shipping_method: "",
      shipping_cost: "",
      user_addresses_id: "",
      warehouses_id: "",
    },
    validationSchema: Yup.object({
      shipping_method: Yup.string().required(
        "Courier or/and shipping method required"
      ),
      user_addresses_id: Yup.number().required("Shipping Address required"),
    }),
    onSubmit: handleAddOrder,
  });

  const ModalAddress = ({
    isOpen,
    onClose,
    addresses,
    handleAddressSelect,
    handleNewAddressSubmit,
  }) => {
    const {
      isOpen: isNewAddressOpen,
      onOpen: onNewAddressOpen,
      onClose: onNewAddressClose,
    } = useDisclosure();

    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Select an Address</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Select
                placeholder="Select address"
                onChange={handleAddressSelect}>
                {addresses.map((address) => (
                  <option
                    key={address.id}
                    value={JSON.stringify(
                      // {[address.address, address.recipient, address.phone_number]}>
                      address
                    )}>
                    {address.recipient}
                  </option>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Link to="/user/add-address/checkout">
                <Button colorScheme="blue" mr={3} onClick={onNewAddressOpen}>
                  Add New Address
                </Button>
              </Link>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <NewAddressModal
          isOpen={isNewAddressOpen}
          onClose={onNewAddressClose}
          handleNewAddressSubmit={handleNewAddressSubmit}
        />
      </>
    );
  };

  const NewAddressModal = ({ isOpen, onClose, handleNewAddressSubmit }) => {
    const [newAddress, setNewAddress] = useState("");

    const handleNewAddressChange = (e) => {
      setNewAddress(e.target.value);
    };

    const handleSubmit = () => {
      handleNewAddressSubmit(newAddress);
      onClose();
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>New Address</FormLabel>
              <Input
                type="text"
                value={newAddress}
                onChange={handleNewAddressChange}
                placeholder="Enter your address"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box width="100%" maxWidth="1000px" mx="auto" py={5}>
        <h1 className="mb-10 text-center text-2xl font-bold">Checkout</h1>
        <div className="flex flex-col justify-between w-full">
          <div className="bg-white py-5">
            <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
              <div className="rounded-lg md:w-2/3">
                <Flex justifyContent="space-between" alignItems="center">
                  <Heading size="md">Shipping Address</Heading>
                  {addresses.length === 0 && (
                    <Link to="/user/add-address/checkout">
                      <Button
                        onClick={addNewAddress}
                        colorScheme="teal"
                        size="sm">
                        Add New Address
                      </Button>
                    </Link>
                  )}
                </Flex>
                <hr className="my-4" />
                {addresses.length !== 0 ? (
                  <Flex>
                    <Box textAlign={"left"}>
                      <Text justifyContent="space-between">
                        {selectedAddress.recipient}
                      </Text>
                      <Text>
                        {selectedAddress.address} {selectedAddress.district}{" "}
                        {selectedAddress.city} {selectedAddress.province}
                      </Text>
                      <Text mb={4}>{selectedAddress.phone_number}</Text>
                      <div className="flex items-center">
                        <Link>
                          <FormControl
                            isInvalid={
                              formik.errors.user_addresses_id &&
                              formik.touched.user_addresses_id
                            }>
                            <Button
                              onClick={onOpen}
                              colorScheme="blue"
                              ml={1}
                              mr={4}
                              size="sm">
                              Change Address
                            </Button>
                            <FormErrorMessage>
                              {formik.errors.user_addresses_id}
                            </FormErrorMessage>
                          </FormControl>
                        </Link>
                        <div className="w-auto mr-4">
                          {selectedAddress && (
                            <FormControl
                              isInvalid={
                                formik.errors.shipping_method &&
                                formik.touched.shipping_method
                              }>
                              <Select
                                size="sm"
                                id="courier"
                                name="courirer"
                                type="text"
                                placeholder="Select Courier"
                                ref={courierRef}
                                onChange={handleCourierSelect}>
                                {[
                                  { value: "jne", label: "JNE" },
                                  { value: "tiki", label: "Tiki" },
                                  { value: "pos", label: "POS Indonesia" },
                                ].map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </Select>
                              <FormErrorMessage>
                                {formik.errors.shipping_method}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </div>

                        <div className="w-auto">
                          {courierSelect && (
                            <FormControl
                              isInvalid={
                                formik.errors.shipping_method &&
                                formik.touched.shipping_method
                              }>
                              <Select
                                size="sm"
                                id="cost"
                                name="cost"
                                type="text"
                                placeholder="Select Cost"
                                onChange={handleCostSelect}
                                ref={costRef}
                                // className='w-80'
                              >
                                {shippingCosts.map((shippingCost, index) => (
                                  <option
                                    key={index}
                                    value={JSON.stringify(shippingCost)}>
                                    {shippingCost.description} -{" "}
                                    {shippingCost.cost[0].value.toLocaleString(
                                      "id-ID",
                                      {
                                        style: "currency",
                                        currency: "IDR",
                                      }
                                    )}
                                  </option>
                                ))}
                              </Select>
                              <FormErrorMessage>
                                {formik.errors.shipping_method}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </div>
                      </div>
                      {/* <Link to="/user/add-address/checkout">
                    <Button colorScheme="blue" mr={4} mt={2} size="sm" >
                      Add New Address
                    </Button>
                  </Link> */}
                    </Box>
                  </Flex>
                ) : (
                  <Stack spacing={4} mb={4}>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      No address founded.
                    </h1>
                    <p className="text-gray-700 text-lg mb-8">
                      Please add new address for process your order.
                    </p>
                  </Stack>
                )}
                <hr className="my-4" />
                {carts.length !== 0 ? (
                  carts.map((cart, index) => {
                    return (
                      <div
                        key={index}
                        className="justify-between border border-gray-200 mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
                        <img
                          onClick={() =>
                            navigate(`/product-details/${cart.product.id}`)
                          }
                          src={`${process.env.REACT_APP_API_BASE_URL}/${cart.product.imageUrl}`}
                          alt={cart.product.name}
                          className="w-full rounded-lg sm:w-40"
                        />
                        <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                          <div className="mt-5 sm:mt-0">
                            <h2
                              onClick={() =>
                                navigate(`/product-details/${cart.product.id}`)
                              }
                              className="text-lg font-bold text-gray-900">
                              {cart.product?.name}
                            </h2>
                            <p className="mt-1 text-xs text-gray-700 text-left">
                              Weight:{" "}
                              {(
                                cart.quantity * cart.product.weight
                              ).toLocaleString("ID")}{" "}
                              grams
                            </p>
                            <p className="mt-1 text-xs text-gray-700 text-left">
                              Qty: {cart.quantity} Pcs
                            </p>
                          </div>
                          <div className="mt-4 flex justify-end sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                            <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                              <div className="flex md:flex-col items-center space-x-4 mt-2">
                                <p className="text-sm">
                                  {(
                                    cart.product.price * cart.quantity
                                  ).toLocaleString("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col col-span-4 justify-center items-center my-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      No product in your cart
                    </h1>
                    <p className="text-gray-700 text-lg mb-8">
                      Continue shopping and add some product to cart
                    </p>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => navigate("/")}>
                      Go Shopping
                    </button>
                  </div>
                )}
              </div>
              <div
                className={`sticky top-[5.7rem] mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3 ${
                  carts.length === 0 ? "hidden" : null
                }`}>
                <div className="mb-2 flex justify-between">
                  <p className="text-gray-700">
                    Subtotal ({totalProductsInCart} items)
                  </p>
                  <p className="text-gray-700">
                    {subtotal.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </p>
                </div>

                {finalCost && (
                  <div className="mb-2 flex justify-between">
                    <p className="text-gray-700">Shipping Fee</p>
                    <div className="">
                      <p className="text-gray-700">
                        {finalCost.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {/* {nearestWarehouse && (
                <div className="mb-2 flex justify-between">
                  <p className="text-gray-700">Nearest Warehouse</p>
                  <div className="">
                    <p className="text-gray-700">{nearestWarehouse.id}</p>
                  </div>
                </div>
              )} */}

                <hr className="my-4" />
                <div className="flex justify-between">
                  <p className="text-lg font-bold">Grand Total</p>
                  <div className="">
                    <p className="mb-1 text-lg font-bold">
                      {(subtotal + finalCost).toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ScrollToTopButton />
        </div>

        <ModalAddress
          isOpen={isOpen}
          onClose={onClose}
          addresses={addresses}
          handleAddressSelect={handleAddressSelect}
          handleNewAddressSubmit={handleNewAddressSubmit}
        />

        <Box mt={6}>
          <Button
            type="submit"
            colorScheme="blue"
            width="100%"
            isLoading={formik.isSubmitting}>
            Proceed to Payment
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default Checkout;