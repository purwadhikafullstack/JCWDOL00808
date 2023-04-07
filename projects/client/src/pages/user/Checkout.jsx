import React, { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import {
  cartSelector,
  getCarts,
  getTotalPriceInCart,
  getTotalProductsInCart,
  getTotalWeightInCart
} from "../../reducers/cartSlice";
import ScrollToTopButton from "../../components/ScrollToTopButton";

import { Link, useNavigate } from "react-router-dom";

const Checkout = () => {
    const [addresses, setAddresses] = useState([]);
    const [warehouseAddresses, setWarehouseAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [shippingCost, setShippingCost] = useState('');
    const [nearestWarehouse, setNearestWarehouse] = useState(null);
    const [provinceData, setProvinceData] = useState([]);
    const [cityData, setCityData] = useState([]);

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

    const fetchShippingCost = async (originName, destinationName, totalWeight) => {
      try {

        const headers = { key: "ad56687941df3108ced06eb27098deea" };
        const citiesResponse = await axios.get(`http://localhost:8000/warehouses/getCityData?province_id=`);
        const cities = citiesResponse.data

        // console.log(cities)
    
        const [originType, originCityName] = extractCityTypeAndName(originName);
        const [destinationType, destinationCityName] = extractCityTypeAndName(destinationName);
    
        const originId = cities.find((city) => city.type.toLowerCase() === originType.toLowerCase() && city.city_name.toLowerCase() === originCityName.toLowerCase()).city_id;
        const destinationId = cities.find((city) => city.type.toLowerCase() === destinationType.toLowerCase() && city.city_name.toLowerCase() === destinationCityName.toLowerCase()).city_id;
    
        // Calculate shipping cost
        const costUrl = `http://localhost:8000/warehouses/getCostData?originName=${originId}&destinationName=${destinationId}&totalWeight=${totalWeight}`;
        const costResponse = await axios.get(costUrl)
        // const costResponse = await axios.get(costUrl, new URLSearchParams({
        //   origin: originId,
        //   destination: destinationId,
        //   weight : totalWeight,
        //   courier: 'jne'
        // }), { headers, 'content-type': 'application/x-www-form-urlencoded' });
    
        const shippingInfo = costResponse.data[0].costs[0].cost[0]?.value
        console.log(costResponse.data[0]);
        console.log(shippingInfo);

        setShippingCost(shippingInfo)
    
        // shippingInfo.forEach((cost) => {
        //   console.log(`Service: ${cost.service} - Cost: ${cost.cost[0].value} - Estimated days: ${cost.cost[0].etd}`);
        // });
    
      } catch (error) {
        console.error('Error fetching shipping cost:', error);
      }
    };
    
    // fetchShippingCost(originName, destinationName);
    

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

    const fetchWarehouseData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/warehouses/getAllWarehouse`)
        
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
        const response = await axios.get(`http://localhost:8000/address/get-address?`, 
        {
          headers: { Authorization: token },
        });
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
    const response = await axios.post('/api/addresses', { address: newAddress });
    setAddresses([...addresses, response.data]);
    setSelectedAddress(response.data.id);
    setNewAddress('');
    } catch (error) {
    console.error('Error adding new address:', error);
    }
    };

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleAddressSelect = (e) => {
      const selected = JSON.parse(e.target.value);
      setSelectedAddress(selected);
      const nearest = findShortestDistance(
        selected.latitude,
        selected.longitude,
        warehouseAddresses
      );
      setNearestWarehouse(nearest);
      // const shippingCost = fetchShippingCost(selected.city, nearest.city)
      fetchShippingCost(selected.city, nearest.city, totalWeightInCart)
      // setShippingCost(shippingCost)

      // console.log(e.target.value);
      onClose();
      };

      const handleNewAddressSubmit = async (newAddress) => {
        try {
          const response = await axios.post('/api/addresses', { address: newAddress });
          setAddresses([...addresses, response.data]);
        } catch (error) {
          console.error('Error adding new address:', error);
        }
      };

      const ModalAddress = ({
        isOpen,
        onClose,
        addresses,
        handleAddressSelect,
        handleNewAddressSubmit,
      }) => {
        const { isOpen: isNewAddressOpen, onOpen: onNewAddressOpen, onClose: onNewAddressClose } = useDisclosure();
      
        return (
          <>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Select an Address</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Select placeholder="Select address" onChange={handleAddressSelect}>
                    {addresses.map((address) => (
                      <option key={address.id} value=
                      // {[address.address, address.recipient, address.phone_number]}>
                      {JSON.stringify(address)}>
                        {address.recipient}
                      </option>
                    ))}
                  </Select>
                </ModalBody>
                <ModalFooter>
                  <Link to="/user/add-address/checkout">
                  <Button colorScheme="blue" mr={3} onClick={(onNewAddressOpen)}>
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
          const [newAddress, setNewAddress] = useState('');
        
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
          <Box width="100%" maxWidth="1000px" mx="auto" py={5}>
            <h1 className="mb-10 text-center text-2xl font-bold">Checkout</h1>
            <div className="flex flex-col justify-between w-full">
            <div className="bg-white py-5">
           <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
            <div className="rounded-lg md:w-2/3">
            <Flex justifyContent="space-between" alignItems="center" >
              <Heading size="md">Shipping Address</Heading>
              
              {addresses.length === 0 && (
                <Link to="/user/add-address/checkout">
                <Button onClick={addNewAddress} colorScheme="teal" size="sm">
                  Add New Address
                </Button>
                </Link>
              )}
            </Flex>
            <hr className="my-4" />
            {addresses.length !== 0 ? (
              <Flex>
              <Box textAlign={'left'}>
                <Text justifyContent="space-between">{selectedAddress.recipient}</Text>
                <Text >{selectedAddress.address} {selectedAddress.district} {selectedAddress.city} {selectedAddress.province}   </Text>
                <Text mb={4}>{selectedAddress.phone_number}</Text>
                <Button onClick={onOpen} colorScheme="blue" size="sm" >
                  Change Address
                </Button>
                <Link to="/user/add-address/checkout">
                  <Button colorScheme="blue" ml={3} size="sm" >
                    Add New Address
                  </Button>
                  </Link>
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
                      className="justify-between border border-gray-200 mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
                    >
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
                            className="text-lg font-bold text-gray-900"
                          >
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
                    onClick={() => navigate("/")}
                  >
                    Go Shopping
                  </button>
                </div>
              )}
            </div>
            <div
              className={`sticky top-[5.7rem] mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3 ${
                carts.length === 0 ? "hidden" : null
              }`}
            >
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

              <div className="mb-2 flex justify-between">
                <p className="text-gray-700">Shipping Fee</p>
                <div className="">
                  <p className="text-gray-700">
                    {(shippingCost).toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </p>
                </div>
              </div>

              {nearestWarehouse && (
                <div className="mb-2 flex justify-between">
                  <p className="text-gray-700">Nearest Warehouse</p>
                  <div className="">
                    <p className="text-gray-700">{nearestWarehouse.name}</p>
                  </div>
                </div>
              )}

              <hr className="my-4" />
              <div className="flex justify-between">
                <p className="text-lg font-bold">Subtotal</p>
                <div className="">
                  <p className="mb-1 text-lg font-bold">
                    {(subtotal + shippingCost).toLocaleString("id-ID", {
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
              <Button colorScheme="blue" width="100%">
                Proceed to Payment
              </Button>
            </Box>
          </Box>
        );
      };

export default Checkout;