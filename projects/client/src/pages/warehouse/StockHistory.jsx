import {
  Select,
  Button,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Axios from "axios";
import { API_url } from "../../helper";

const StockHistory = () => {
  const [warehouseData, setWarehouseData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [sortProductsId, setSortProductsId] = useState(0);
  const [sortWarehouseId, setSortWarehouseId] = useState(0);
  const [sortMonth, setSortMonth] = useState(0);
  const [sortYear, setSortYear] = useState(0);

  const [stockHistories, setStockHistories] = useState([]);

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

  const getStockHistories = () => {
    Axios.get(
      API_url +
        `/histories/getStockHistories?sortProductsId=${sortProductsId}&sortWarehouseId=${sortWarehouseId}&sortMonth=${sortMonth}&sortYear=${sortYear}`
    )
      .then((response) => {
        console.log(response.data);
        setStockHistories(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getWarehouseData();
    getProductsData();
    getStockHistories();
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
            <Td>{value.stock_before}</Td>
            <Td>{value.stock_after}</Td>
            <Td>Berkurang sebanyak {difference}</Td>
            <Td>{value.description}</Td>
            <Td>
              <Button colorScheme="blue">Details</Button>
            </Td>
          </Tr>
        );
      } else {
        return (
          <Tr key={value.id}>
            <Td>{value.stock_before}</Td>
            <Td>{value.stock_after}</Td>
            <Td>Bertambah sebanyak {difference}</Td>
            <Td>{value.description}</Td>
            <Td>
              <Button colorScheme="blue">Details</Button>
            </Td>
          </Tr>
        );
      }
    });
  };

  return (
    <>
      <Flex
        minWidth="fit-content"
        alignItems="center"
        gap="5"
        paddingX={5}
        paddingY={10}
      >
        <Card>
          <CardHeader>
            <Heading size="md" textTransform="uppercase">
              Stock History
            </Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <Text fontSize="md">
                  View a history of your products over the last month.
                </Text>

                <Text pt="2" fontSize="md">
                  Product:
                </Text>
                <Select
                  placeholder="Select product"
                  onChange={(element) =>
                    setSortProductsId(element.target.value)
                  }
                >
                  {productsData.map((value) => {
                    return (
                      <option value={value.id}>
                        [{value.id}] {value.name}
                      </option>
                    );
                  })}
                </Select>

                <Text pt="2" fontSize="md">
                  Warehouse location:
                </Text>

                <Select
                  placeholder="Select warehouse"
                  onChange={(element) =>
                    setSortWarehouseId(element.target.value)
                  }
                >
                  {warehouseData.map((value) => {
                    return (
                      <option value={value.id}>
                        [{value.id}] {value.name}
                      </option>
                    );
                  })}
                </Select>

                <Text pt="2" fontSize="md">
                  Period:
                </Text>

                <Flex>
                  <Select
                    placeholder="Month"
                    onChange={(element) => setSortMonth(element.target.value)}
                  >
                    <option value={1}>January</option>;
                    <option value={2}>February</option>;
                    <option value={3}>March</option>;
                    <option value={4}>April</option>;
                    <option value={5}>May</option>;
                    <option value={6}>June</option>;
                    <option value={7}>July</option>;
                    <option value={8}>August</option>;
                    <option value={9}>September</option>;
                    <option value={10}>October</option>;
                    <option value={11}>November</option>;
                    <option value={12}>December</option>;
                  </Select>
                  <Select
                    placeholder="Year"
                    onChange={(element) => setSortYear(element.target.value)}
                  >
                    <option value={2021}>2021</option>;
                    <option value={2022}>2022</option>;
                    <option value={2023}>2023</option>;
                    <option value={2024}>2024</option>;
                    <option value={2025}>2025</option>;
                  </Select>
                </Flex>
                <Button className="mt-5" onClick={handleFilterButton}>
                  Filter
                </Button>
              </Box>
              <Box>
                <Heading size="md">Stock Info</Heading>
                <Text pt="2" fontSize="md">
                  See a detailed analysis of all your product stocks.
                </Text>
                <Button className="mt-5">Manage Stock</Button>
              </Box>
            </Stack>
          </CardBody>
        </Card>
        <Box rounded={"lg"}>
          <TableContainer>
            <Table variant="striped" size="md">
              <Thead>
                <Tr>
                  <Th>Qty Before</Th>
                  <Th>Qty After</Th>
                  <Th>Qty difference</Th>
                  <Th>Description</Th>
                  <Th>Action</Th>
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

export default StockHistory;
