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
  VStack,
  IconButton,
  Heading,
  Input,
  Text,
  Tooltip,
  FormErrorMessage,
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
import { useFormik } from "formik";
import * as Yup from "yup";

const WarehouseStock = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [warehouseName, setWarehouseName] = useState("");

  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { isOpen: isEditStockOpen, onOpen: onEditStockOpen, onClose: onEditStockClose } = useDisclosure();
  const { isOpen: isAddStockOpen, onOpen: onAddStockOpen, onClose: onAddStockClose } = useDisclosure();
  const { isOpen: isDeleteProductOpen, onOpen: onDeleteProductOpen, onClose: onDeleteProductClose } = useDisclosure();

  const [addressToDelete, setAddressToDelete] = React.useState(null);
  const [updatedStock, setUpdatedStock] = useState();

  const { id } = useParams();

  // Fetch products from the server (replace the URL with your API endpoint)
  useEffect(() => {
    fetchProducts();
    getSpecificWarehouse()
}, [searchTerm]);

//   const handleDeleteModal = (id) => {
  //BUKA MODAL DELETE
  const handleDeleteModal = () => {
    // Handle deleting the product with the given ID
    onDeleteProductOpen()
  };

  //API DELETE STOCK
  const handleConfirmDelete = () => {
    // await handleDeleteAddress(addressToDelete);
    // setAddressToDelete(null);
    onDeleteProductClose();
  };

  //API UPDATE STOCK
  const handleConfirmUpdateStock = () => {
    // Handle updating stock for the selected product
    onEditStockClose();
  };

  // const handleEditStock = (id) => {
  // BUKA MODAL UPDATE
  const handleUpdateModal = () => {
    // const product = products.find((p) => p.id === id);
    // setSelectedProduct(product);
    setSelectedProduct();
    onEditStockOpen();
  };

  // BUKA MODAL CREATE
  const handleCreateModal = () => {
    // const product = products.find((p) => p.id === id);
    // setSelectedProduct(product);
    setSelectedProduct();
    onAddStockOpen();
  };

  //API CREATE STOCK
  const handleCreateStock = () => {
    // const product = products.find((p) => p.id === id);
    // setSelectedProduct(product);
    // setSelectedProduct();
    onAddStockClose();
  };

  const getSpecificWarehouse = () => {
    axios.get(`http://localhost:8000/warehouses/getWarehouseDetails/${id}`)
      .then((response) => {
        setWarehouseName(response.data.name);
        
      })
      .catch((error) => console.log(error));
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/warehouses/get-warehouse-product/${id}?search_query=${searchTerm}`)
      // setWarehouseName(response?.[0].warehouse?.name)
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

  const formik = useFormik({
    initialValues: {
      stock: "",
      products_id: "",
      
    },
    validationSchema: Yup.object({
      stock: Yup.number().required("Required"),
      products_id: Yup.string().required("Required"),
      
    }),
    onSubmit: handleCreateStock,
  });

  return (
    <>
    <Box width="100%" overflowX="auto">
        <HStack mb={4} mt= {2} mr={4} justify="flex-end">
      <Link to="/">
        <IconButton icon={<CloseIcon />} aria-label="Back Button" colorScheme="blue" />
      </Link>
    </HStack>
    <Heading >Stock List</Heading>
    <Text fontSize="xl" mb={10}> {warehouseName}</Text>
    <HStack mb={4} mt={2} mr={4} justify="center">
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            maxW="200px"
          />
          {/* <IconButton icon={<SearchIcon />} aria-label="Search" colorScheme="blue" /> */}
          
          <Tooltip hasArrow label='Add Product to Warehouse'>
            <IconButton icon={<AddIcon />} aria-label="Add Address" colorScheme="blue" onClick={() => handleCreateModal()}/>
          </Tooltip>
          
        </HStack>
      <Table variant="striped" colorScheme="twitter">
        <Thead>
          <Tr>
            <Th>Product Name</Th>
            <Th>Product Categories</Th>
            <Th>Total Stock</Th>
            <Th>Warehouse Name</Th>
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
              <Td isNumeric>
                <Button onClick={() => handleUpdateModal(product.id)} mr={2}>
                  Edit Stock
                </Button>
                <Button onClick={() => handleDeleteModal(product.id)}>
                  Delete
                </Button>
              </Td>
            </Tr>
          )})}
          
        </Tbody>
      </Table>
    </Box>

    <Modal isOpen={isAddStockOpen} onClose={onAddStockClose}>
          <ModalOverlay />
          <ModalContent>
            {/* <ModalHeader>Update Stock for {selectedProduct.product_name}</ModalHeader> */}
            <ModalHeader>Add Stock</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <form onSubmit={formik.handleSubmit}>
            <VStack spacing={4} mt={4} mx="auto" maxW="480px">
              <FormControl isInvalid={formik.errors.address && formik.touched.address}>
              <FormLabel htmlFor="address">Product Category</FormLabel>
              <Input
                id="products_category"
                name="products_category"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.products_id}
                />
                  <FormErrorMessage>{formik.errors.address}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.address && formik.touched.address}>
              <FormLabel htmlFor="address">Product ID</FormLabel>
              <Input
                id="products_id"
                name="products_id"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.products_id}
                />
                  <FormErrorMessage>{formik.errors.address}</FormErrorMessage>
              </FormControl>
              
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
          </VStack>
              </form>
        </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleCreateStock}>
                Add Stock
              </Button>
              <Button onClick={onAddStockClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    
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
              <Button colorScheme="blue" mr={3} onClick={handleConfirmUpdateStock}>
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