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
  Label
} from '@chakra-ui/react';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import {
  cartSelector,
  deleteProduct,
  getCarts,
  getTotalPriceInCart,
  getTotalProductsInCart,
  updateCarts,
} from "../../reducers/cartSlice";
import ScrollToTopButton from "../../components/ScrollToTopButton";

import { Link, useNavigate } from "react-router-dom";

const Checkout = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState({});
    const [newAddress, setNewAddress] = useState('');

    const token = localStorage.getItem("token");

    const carts = useSelector(cartSelector.selectAll);
    const subtotal = useSelector(getTotalPriceInCart);
    const totalProductsInCart = useSelector(getTotalProductsInCart);

    const dispatch = useDispatch();

    const toast = useToast();

    const navigate = useNavigate();
  
    useEffect(() => {
      fetchAddresses();
    }, []);
  
    const fetchAddresses = async () => {
      try {
        // Replace with your API endpoint to get all addresses
        const response = await axios.get(`http://localhost:8000/address/get-address?`, 
        {
          headers: { Authorization: token },
        });
        setAddresses(response.data.result);
        console.log(response.data.result);
        // console.log(addresses);
        
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
      const setSelectedAddressId = e.target.value;
      const selectedAddress = addresses.find(address => address.id === setSelectedAddressId )
      setSelectedAddress(selectedAddress);
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
      setSelectedAddress(e.target.value);
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
                      <option key={address.id} value={address}>
                        {address.recipient}
                      </option>
                    ))}
                  </Select>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onNewAddressOpen}>
                    Add New Address
                  </Button>
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
          <Box width="100%" maxWidth="1000px" mx="auto" py={8}>
            <Heading mb={6}>Checkout</Heading>
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
              <Heading size="md">Shipping Address</Heading>
              {addresses.length === 0 && (
                <Link to="/user/add-address">
                <Button onClick={addNewAddress} colorScheme="teal" size="sm">
                  Add New Address
                </Button>
                </Link>
              )}
            </Flex>
            {addresses.length !== 0 ? (
              <Box>
                <Text mb={4}>
                  {selectedAddress.recipient} - {selectedAddress.address} - {selectedAddress.id}
                  </Text>
                <Button onClick={onOpen} colorScheme="blue" size="sm">
                  Change Address
                </Button>
              </Box>
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

<div className="flex flex-col justify-between w-full">
        <div className="bg-white py-5">
          <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
            <div className="rounded-lg md:w-2/3">
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
              <hr className="my-4" />
              <div className="flex justify-between">
                <p className="text-lg font-bold">Subtotal</p>
                <div className="">
                  <p className="mb-1 text-lg font-bold">
                    {subtotal.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </p>
                </div>
              </div>
              <Link to="/user/checkout">
                <button className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">
                  Check out
                </button>
              </Link>
            </div>
          </div>
        </div>
        <ScrollToTopButton />
      </div>

            <div className="flex justify-between">
                <p className="text-lg font-bold">Subtotal</p>
                <div className="">
                  <p className="mb-1 text-lg font-bold">
                    {subtotal.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <p className="text-lg font-bold">Shipping Fee</p>
                <div className="">
                  <p className="mb-1 text-lg font-bold">
                    Rp. 10.000,00
                    {/* {subtotal.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })} */}
                  </p>
                </div>
              </div>
      
              <div className="flex justify-between mt-5">
                <p className="text-3xl font-bold text-red-500">Grand Total</p>
                <div className="">
                  <p className="mb-1 text-3xl font-bold text-red-500">
                    {(subtotal + 10000).toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </p>
                </div>
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