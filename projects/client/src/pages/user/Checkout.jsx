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

const Checkout = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [newAddress, setNewAddress] = useState('');

    const token = localStorage.getItem("token");

    const toast = useToast();
  
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
                      <option key={address.id} value={address.id}>
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
          <Box width="100%" maxWidth="800px" mx="auto" py={8}>
            <Heading mb={6}>Checkout</Heading>
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
              <Heading size="md">Shipping Address</Heading>
              {addresses.length === 0 && (
                <Button onClick={addNewAddress} colorScheme="teal" size="sm">
                  Add New Address
                </Button>
              )}
            </Flex>
            {addresses.length !== 0 ? (
              <Box>
                <Text mb={4}>Selected Address: {selectedAddress}</Text>
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
                  
                {/* <FormControl>
                  <FormLabel>New Address</FormLabel>
                  <Input
                    type="text"
                    value={newAddress}
                    onChange={handleNewAddressChange}
                    placeholder="Enter your address"
                  />
                </FormControl>
                <Button onClick={addNewAddress} colorScheme="teal">
                  Save New Address
                </Button> */}
              </Stack>
            )}
      
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