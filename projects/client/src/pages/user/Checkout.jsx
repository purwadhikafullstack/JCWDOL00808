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
} from '@chakra-ui/react';
import axios from 'axios';

const Checkout = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [newAddress, setNewAddress] = useState('');
  
    useEffect(() => {
      fetchAddresses();
    }, []);
  
    const fetchAddresses = async () => {
      try {
        const response = await axios.get('/api/addresses');
        setAddresses(response.data);
        if (response.data.length > 0) {
          setSelectedAddress(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
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
        {addresses.length > 0 ? (
        <FormControl>
        <FormLabel>Select your address</FormLabel>
        <Select value={selectedAddress} onChange={handleAddressChange}>
        {addresses.map((address) => (
        <option key={address.id} value={address.id}>
        {address.text}
        </option>
        ))}
        </Select>
        </FormControl>
        ) : (
        <Stack spacing={4}>
        <FormControl>
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
      </Button>
    </Stack>
  )}

  <Box mt={6}>
    <Button colorScheme="blue" width="100%">
      Proceed to Payment
    </Button>
  </Box>
</Box>
);
};