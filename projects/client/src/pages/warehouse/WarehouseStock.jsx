// components/ProductTable.js
import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Box,
  HStack,
  IconButton,
  Heading,
  Input,
  Text,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useToast,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper
} from "@chakra-ui/react";

import { EditIcon, DeleteIcon, CloseIcon, SearchIcon, AddIcon } from "@chakra-ui/icons";
import { Link, useParams } from "react-router-dom";

import axios from "axios";

const WarehouseStock = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { isOpen: isEditStockOpen, onOpen: onEditStockOpen, onClose: onEditStockClose } = useDisclosure();
  const { isOpen: isDeleteProductOpen, onOpen: onDeleteProductOpen, onClose: onDeleteProductClose } = useDisclosure();

  const [addressToDelete, setAddressToDelete] = React.useState(null);
  const [updatedStock, setUpdatedStock] = useState();

  const { id } = useParams();

  // Fetch products from the server (replace the URL with your API endpoint)
  useEffect(() => {
    fetchProducts();
}, [searchTerm]);

//   const handleDeleteProduct = (id) => {
  const handleDeleteProduct = () => {
    // Handle deleting the product with the given ID
    onDeleteProductOpen()
  };

  const handleConfirmDelete = () => {
    // await handleDeleteAddress(addressToDelete);
    // setAddressToDelete(null);
    onDeleteProductClose();
  };

  const handleUpdateStock = () => {
    // Handle updating stock for the selected product
    onEditStockClose();
  };

//   const handleEditStock = (id) => {
  const handleEditStock = () => {
    // const product = products.find((p) => p.id === id);
    // setSelectedProduct(product);
    setSelectedProduct();
    onEditStockOpen();
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/warehouses/get-warehouse-product/${id}?search_query=${searchTerm}`)

      setProducts(response?.data?.data)
    } catch (error) {
      toast({
        title: "Error fetching addresses.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <>
    <Box width="100%" overflowX="auto">
        <HStack mb={4} mt= {2} mr={4} justify="flex-end">
      <Link to="/">
        <IconButton icon={<CloseIcon />} aria-label="Back Button" colorScheme="blue" />
      </Link>
    </HStack>
    <Heading >Stock List</Heading>
    <Text fontSize="xl" mb={10}> Warehouse Bandung</Text>
    <HStack mb={4} mt={2} mr={4} justify="center">
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            maxW="200px"
          />
          {/* <IconButton icon={<SearchIcon />} aria-label="Search" colorScheme="blue" /> */}
          <Link to={`/warehouse/stock/${1}/add-product`}>
          <Tooltip hasArrow label='Add Product to Warehouse'>
            <IconButton icon={<AddIcon />} aria-label="Add Address" colorScheme="blue" />
          </Tooltip>
          </Link>
        </HStack>
      <Table variant="striped" colorScheme="twitter">
        <Thead>
          <Tr>
            <Th>Product Name</Th>
            <Th>Product Categories</Th>
            <Th>Total Stock</Th>
            <Th>Warehouse ID</Th>
            <Th isNumeric>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => {
            return(
            <Tr key={product?.id}>
              <Td>{product?.product.name}</Td>
              <Td>{product?.product.product_category.name}</Td>
              <Td>{product?.stock}</Td>
              <Td>{product?.warehouse.name}</Td>
              <Td>
                <Button onClick={() => handleEditStock(product.id)}>
                  Edit Stock
                </Button>
                <Button onClick={() => handleDeleteProduct(product.id)}>
                  Delete
                </Button>
              </Td>
            </Tr>
          )})}
          
        </Tbody>
      </Table>
    </Box>
    
        <Modal isOpen={isEditStockOpen} onClose={onEditStockClose}>
          <ModalOverlay />
          <ModalContent>
            {/* <ModalHeader>Update Stock for {selectedProduct.product_name}</ModalHeader> */}
            <ModalHeader>Update Stock for Celana</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
          <FormControl>
            <FormLabel>Total Stock</FormLabel>
            <NumberInput
              min={0}
              value={updatedStock}
              onChange={(value) => setUpdatedStock(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleUpdateStock}>
                Update Stock
              </Button>
              <Button onClick={onEditStockClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      

<Modal isOpen={isDeleteProductOpen} onClose={onDeleteProductClose}>
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
        <Button variant="ghost" onClick={onDeleteProductClose}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>

      </>
  );
};

export default WarehouseStock;