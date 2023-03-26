import { Select, Button, Card, CardHeader, CardBody, CardFooter, Heading, Stack, StackDivider, Box, Text, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Flex, Spacer, Square, Center } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import Axios from "axios";
import { API_url } from "../../helper";

const StockHistory = () => {
  const [warehouseData, setWarehouseData] = useState([]);
  const [productsData, setProductsData] = useState([]);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [sortProductsId, setSortProductsId] = useState(0);
  const [sortWarehouseId, setSortWarehouseId] = useState(0);
  // const [sortPeriod, setSortPeriod] = useState("");

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
    Axios.get(API_url + `/histories/getStockHistories?sortProductsId=${sortProductsId}&sortWarehouseId=${sortWarehouseId}`)
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
      let difference = Math.abs(value.stock_after - value.stock_before);
      return (
        <Tr key={value.id}>
          <Td>{value.description}</Td>
          <Td>{value.stock_before}</Td>
          <Td>{value.stock_after}</Td>
          <Td isNumeric>{difference}</Td>
        </Tr>
      );
    });
  };

  return (
    <>
      <Flex minWidth="max-content" alignItems="center" gap="2">
        <Card>
          <CardHeader>
            <Heading size="md" textTransform="uppercase">
              Stock History
            </Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <Text pt="2" fontSize="md">
                  View a history of your products over the last month.
                </Text>

                <Text pt="2" fontSize="md">
                  Product:
                </Text>
                <Select placeholder="Select product" onChange={(element) => setSortProductsId(element.target.value)}>
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

                <Select placeholder="Select warehouse" onChange={(element) => setSortWarehouseId(element.target.value)}>
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

                <Select
                  placeholder="Select period"
                  // onChange={(element) => setSortPeriod(element.target.value)}
                >
                  <option value="all">All</option>
                  {months.map((month) => {
                    return <option value={month}>{month}</option>;
                  })}
                </Select>
                <Button className="mt-5" onClick={handleFilterButton}>
                  Filter
                </Button>
              </Box>
              {/* <Box>
            <Heading size="xs" textTransform="uppercase">
              Overview
            </Heading>
            <Text pt="2" fontSize="sm">
              Check out the overview of your products.
            </Text>
          </Box> */}
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
        <Box>
          <TableContainer>
            <Table size="lg">
              <Thead>
                <Tr>
                  <Th>Description</Th>
                  <Th>Qty In</Th>
                  <Th>Qty Out</Th>
                  <Th isNumeric>Qty difference</Th>
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
