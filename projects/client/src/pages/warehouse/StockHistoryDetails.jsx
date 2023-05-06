import { Select, Button, Card, CardHeader, CardBody, Heading, Stack, StackDivider, Box, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Axios from "axios";
import { API_url } from "../../helper";
import { useLocation } from "react-router-dom";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

const StockHistory = () => {
  const [warehouseData, setWarehouseData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [sortProductsId, setSortProductsId] = useState(0);
  const [sortWarehouseId, setSortWarehouseId] = useState(0);
  const [sortMonth, setSortMonth] = useState(0);
  const [sortYear, setSortYear] = useState(0);
  const [stockQuery, setStockQuery] = useState("");
  const [warehouseQuery, setWarehouseQuery] = useState("");

  const [stockHistories, setStockHistories] = useState([]);

  const { search } = useLocation();
  const id = search.split("=")[1];

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

  let token = localStorage.getItem("token");
  const historyDetails = () => {
    Axios.get(API_url + `/histories/test2?products_id=${id}&stockQuery=${stockQuery}&warehouseQuery=${warehouseQuery}`, {
      headers: { Authorization: token },
    })
      .then((response) => {
        setStockHistories(response.data.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    getWarehouseData();
    getProductsData();
    historyDetails();
  }, [stockQuery, warehouseQuery]);

  const handleFilterButton = () => {
    // getStockHistories();
  };

  const showStockHistories = () => {
    return stockHistories.map((value) => {
      return (
        <Tr key={value.id}>
          <Td>{value.time}</Td>
          <Td>{value.description}</Td>
          <Td>
            <Flex>
              <AiOutlineArrowUp style={{ marginTop: 1, marginRight: 10 }} />
              {value.stockOut}
            </Flex>
          </Td>
          <Td>
            <Flex>
              <AiOutlineArrowDown style={{ marginTop: 1, marginRight: 10 }} />
              {value.stockIn}
            </Flex>
          </Td>
        </Tr>
      );
    });
  };

  return (
    <>
      <Flex minWidth="fit-content" alignItems="center" gap="5" paddingX={5} paddingY={10}>
        <Card>
          <CardHeader>
            <Heading size="md" textTransform="uppercase">
              Stock History
            </Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <Text fontSize="md">View a history of your products over the last month.</Text>
                <Text pt="2" fontSize="md">
                  Filter data by:
                </Text>
                <Select placeholder="Stock in / stock out" onChange={(element) => setStockQuery(element.target.value)}>
                  <option value="stockIn">Stock In</option>
                  <option value="stockOut">Stock Out</option>
                </Select>

                <Text pt="2" fontSize="md">
                  Warehouse location:
                </Text>

                <Select placeholder="Select warehouse" onChange={(element) => setWarehouseQuery(element.target.value)}>
                  {warehouseData.map((value) => {
                    return <option value={value.name}>{value.name}</option>;
                  })}
                </Select>

                <Text pt="2" fontSize="md">
                  Period:
                </Text>

                <Flex>
                  <Select placeholder="Month" onChange={(element) => setSortMonth(element.target.value)}>
                    <option value={1}>January</option>;<option value={2}>February</option>;<option value={3}>March</option>;<option value={4}>April</option>;<option value={5}>May</option>;<option value={6}>June</option>;
                    <option value={7}>July</option>;<option value={8}>August</option>;<option value={9}>September</option>;<option value={10}>October</option>;<option value={11}>November</option>;<option value={12}>December</option>;
                  </Select>
                  <Select placeholder="Year" onChange={(element) => setSortYear(element.target.value)}>
                    <option value={2021}>2021</option>;<option value={2022}>2022</option>;<option value={2023}>2023</option>;<option value={2024}>2024</option>;<option value={2025}>2025</option>;
                  </Select>
                </Flex>
                <Button className="mt-5" onClick={handleFilterButton}>
                  View stock history
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
                  <Th>Date & Time</Th>
                  <Th>Description</Th>
                  <Th>Stock Out</Th>
                  <Th>Stock In</Th>
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
