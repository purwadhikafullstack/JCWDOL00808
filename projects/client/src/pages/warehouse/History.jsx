import {
  Flex,
  Box,
  Card,
  CardBody,
  Text,
  Select,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  VStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Axios from "axios";
import { API_url } from "../../helper";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

import(Card);

const History = () => {
  const [sort, setSort] = useState("id");
  const [order, setOrder] = useState("ASC");
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");

  const [warehouseData, setWarehouseData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [sortProductsId, setSortProductsId] = useState(0);
  const [sortWarehouseId, setSortWarehouseId] = useState(0);
  const [sortMonth, setSortMonth] = useState(0);
  const [sortYear, setSortYear] = useState(0);

  const [stockHistories, setStockHistories] = useState([]);

  const { isOpen: isPlusOpen, onOpen: onPlusOpen, onClose: onPlusClose } = useDisclosure();
  const { isOpen: isMinOpen, onOpen: onMinOpen, onClose: onMinClose } = useDisclosure();

  const getWarehouseData = () => {
    Axios.get(API_url + `/warehouses/getAllWarehouse`)
      .then((response) => {
        console.log(response.data);
        setWarehouseData(response.data);
      })
      .catch((err) => console.log(err));
  };

  const getProductsData = () => {
    Axios.get(API_url + `/histories/getAllProducts`).then((response) => {
      console.log(response.data);
      setProductsData(response.data);
    });
  };

  const autoGetStock = () => {
    Axios.get(API_url + `/histories/autoGetStock`).then((response) => {
      console.log("autoGetStock: ", response.data);
      setStockHistories(response.data);
    });
  };

  const getStockHistories = () => {
    Axios.get(API_url + `/histories/getStockHistories?sortProductsId=${sortProductsId}&sortWarehouseId=${sortWarehouseId}&sortMonth=${sortMonth}&sortYear=${sortYear}`)
      .then((response) => {
        console.log(response.data);
        setStockHistories(response.data);
      })
      .catch((error) => console.log(error));
  };

  const getHistoryData = () => {
    Axios.get(API_url + `/histories/getHistoryData?sortProductsId=${sortProductsId}&sortWarehouseId=${sortWarehouseId}&sortMonth=${sortMonth}&sortYear=${sortYear}`)
      .then((response) => {
        console.log(response.data);
        setStockHistories(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getHistoryData();
  }, [sort, order, keyword]);

  useEffect(() => {
    // getWarehouseData();
    // getProductsData();
    // getStockHistories();
    autoGetStock();
  }, []);

  const handleFilterButton = () => {
    getStockHistories();
  };

  const showStockHistories = () => {
    return stockHistories.map((value) => {
      let difference = value.stock_after - value.stock_before;
      if (difference < 0) {
        difference = Math.abs(difference);
        return (
          <Tr key={value.id}>
            <Td>{value.product.name}</Td>
            <Td>{value.warehouse.name}</Td>
            <Td>
              <Flex>
                <AiOutlineArrowDown /> {difference}
              </Flex>
            </Td>
            <Td>
              <Button colorScheme="blue" onClick={onMinOpen}>
                View details
              </Button>
              <Modal isOpen={isMinOpen} onClose={onMinClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Stock Details</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Text>Qty out: {difference}</Text>
                    <Text>Description: {value.description}</Text>
                  </ModalBody>
                  <ModalFooter>
                    {/* <Button colorScheme="blue" mr={3} onClick={onMinClose}>
                      Close
                    </Button> */}
                    {/* <Button variant="ghost">Secondary Action</Button> */}
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Td>
          </Tr>
        );
      } else {
        return (
          <Tr key={value.id}>
            <Td>{value.product.name}</Td>
            <Td>{value.warehouse.name}</Td>
            <Td>
              <Flex>
                <AiOutlineArrowUp />
                {difference}
              </Flex>
            </Td>
            <Td>
              <Button colorScheme="blue" onClick={onPlusOpen}>
                View details
              </Button>
            </Td>
            <Modal isOpen={isPlusOpen} onClose={onPlusClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Stock Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text>Qty in: {difference}</Text>
                  <Text>Description: {value.description}</Text>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onPlusClose}>
                    Close
                  </Button>
                  {/* <Button variant="ghost">Secondary Action</Button> */}
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Tr>
        );
      }
    });
  };

  return (
    <>
      <Flex bg="gray.100">
        <Box mx="100" my="100">
          <Card maxW="xs" border="1px" borderColor="gray.200">
            <CardBody>
              <VStack>
                <FormControl>
                  <FormLabel>Sort data by:</FormLabel>
                  <Select placeholder="Select option">
                    <option value="option1">Warehouse name</option>
                    <option value="option2">Product name</option>
                    <option value="option3">Month</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Order</FormLabel>
                  <Select placeholder="Select option">
                    <option value="option1">Ascending</option>
                    <option value="option2">Descending</option>
                  </Select>
                  {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
          <Card maxW="xs" border="1px" borderColor="gray.200" mt="30">
            <CardBody>
              <VStack>
                <FormControl>
                  <FormLabel>Search:</FormLabel>
                  <Input placeholder="search" />
                  <Button colorScheme="blue" mt="25">
                    Search
                  </Button>
                  {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
        </Box>
        <Box mr="30" my="100">
          <TableContainer bg="white" border="1px" borderColor="gray.200">
            <Table variant="striped" size="md">
              <Thead>
                <Tr>
                  <Th>Product</Th>
                  <Th>Warehouse</Th>
                  <Th>Stock</Th>
                  <Th isNumeric>Action</Th>
                </Tr>
              </Thead>
              <Tbody>{showStockHistories()}</Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Flex>
    </>
  );
};

export default History;
