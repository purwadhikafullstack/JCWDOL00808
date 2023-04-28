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
  const [month, setMonth] = useState(0);

  // const [warehouseData, setWarehouseData] = useState([]);
  // const [productsData, setProductsData] = useState([]);
  // const [sortProductsId, setSortProductsId] = useState(0);
  // const [sortWarehouseId, setSortWarehouseId] = useState(0);
  // const [sortYear, setSortYear] = useState(0);

  const [stockHistories, setStockHistories] = useState([]);

  const { isOpen: isPlusOpen, onOpen: onPlusOpen, onClose: onPlusClose } = useDisclosure();
  const { isOpen: isMinOpen, onOpen: onMinOpen, onClose: onMinClose } = useDisclosure();

  const getHistoryData = () => {
    Axios.get(API_url + `/histories/getHistoryData?sort=${sort}&order=${order}&keyword=${keyword}&month=${month}`)
      .then((response) => {
        console.log(response.data);
        setStockHistories(response.data.rows);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    // getStockHistories();
    getHistoryData();
  }, [sort, month, order, keyword]);

  const handleSearchButton = () => {
    setKeyword(search);
  };

  const handleResetButton = () => {
    setKeyword("");
  };

  // const getStockHistories = () => {
  //   Axios.get(API_url + `/histories/getStockHistories?sortMonth=${sortMonth}`)
  //     .then((response) => {
  //       console.log(response.data);
  //     })
  //     .catch((error) => console.log(error));
  // };

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
      <Flex bg="gray.100" px="0">
        <Box mx="100" mt="100">
          <Card maxW="xs" border="1px" borderColor="gray.200">
            <CardBody>
              <VStack>
                <FormControl>
                  <FormLabel>Sort data by:</FormLabel>
                  <Select placeholder="Select option" onChange={(element) => setSort(element.target.value)}>
                    <option value="id">ID</option>
                    <option value="product">Product name</option>
                    <option value="warehouse">Warehouse name</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Order</FormLabel>
                  <Select placeholder="Select option" onChange={(element) => setOrder(element.target.value)}>
                    <option value="ASC">Ascending</option>
                    <option value="DESC">Descending</option>
                  </Select>
                  {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
          <Card maxW="xs" border="1px" borderColor="gray.200" mt="30">
            <CardBody>
              <FormControl>
                <FormLabel>Filter data by month:</FormLabel>
                <Select placeholder="Select month" onChange={(element) => setMonth(element.target.value)}>
                  <option value={1}>January</option>
                  <option value={2}>February</option>
                  <option value={3}>March</option>
                  <option value={4}>April</option>
                  <option value={5}>Mei</option>
                  <option value={6}>June</option>
                  <option value={7}>July</option>
                  <option value={8}>August</option>
                  <option value={9}>September</option>
                  <option value={10}>October</option>
                  <option value={11}>November</option>
                  <option value={12}>December</option>
                </Select>
              </FormControl>
            </CardBody>
          </Card>
          <Card maxW="xs" border="1px" borderColor="gray.200" mt="30">
            <CardBody>
              <VStack>
                <FormControl>
                  <FormLabel>Search:</FormLabel>
                  <Input placeholder="type warehouse or product name..." onChange={(element) => setSearch(element.target.value)} />
                  <Button colorScheme="blue" mt="25" mr="25" onClick={handleResetButton}>
                    Reset
                  </Button>
                  <Button colorScheme="blue" mt="25" onClick={handleSearchButton}>
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
