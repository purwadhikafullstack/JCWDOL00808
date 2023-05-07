import { Select, Button, Card, CardHeader, CardBody, Heading, Stack, StackDivider, Box, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Axios from "axios";
import { API_url } from "../../helper";
import { useLocation } from "react-router-dom";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

const StockHistory = () => {
  const [warehouseData, setWarehouseData] = useState([]);
  const [month, setMonth] = useState("");
  const [stockQuery, setStockQuery] = useState("");
  const [warehouseQuery, setWarehouseQuery] = useState("");
  const [stockHistories, setStockHistories] = useState([]);
  const [productName, setProductName] = useState("");

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
    Axios.get(API_url + `/histories/getAllProducts?id=${id}`)
      .then((response) => {
        setProductName(response.data[0].name);
      })
      .catch((err) => console.log(err));
  };

  let token = localStorage.getItem("token");
  const historyDetails = () => {
    Axios.get(API_url + `/histories/getHistoryDetails?products_id=${id}&stockQuery=${stockQuery}&warehouseQuery=${warehouseQuery}&month=${month}`, {
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
    getProductsData();
    getWarehouseData();
    historyDetails();
  }, [stockQuery, warehouseQuery, month]);

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
        <div style={{ position: "sticky", top: 50, left: 100, display: "inline-block" }}>
          <Card>
            <CardHeader>
              <Heading size="md" textTransform="uppercase">
                Stock History Details
              </Heading>
              <Text fontSize="md" pt="4">
                See a detailed analysis of all your product stocks.
              </Text>
              <Text fontSize="md">View a history of your products over the last month.</Text>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                <Text fontSize="md">Product: {productName}</Text>
                <Box>
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
                    Month:
                  </Text>
                  <Select placeholder="Select month" onChange={(element) => setMonth(element.target.value)}>
                    <option value={1}>January</option>;<option value={2}>February</option>;<option value={3}>March</option>;<option value={4}>April</option>;<option value={5}>May</option>;<option value={6}>June</option>;
                    <option value={7}>July</option>;<option value={8}>August</option>;<option value={9}>September</option>;<option value={10}>October</option>;<option value={11}>November</option>;<option value={12}>December</option>;
                  </Select>
                  {/* <Button className="mt-5" onClick={handleFilterButton}>
                  View stock history
                </Button> */}
                </Box>
              </Stack>
            </CardBody>
          </Card>
        </div>
        <div style={{ marginRight: "80px" }}>
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
        </div>
      </Flex>
    </>
  );
};

export default StockHistory;
