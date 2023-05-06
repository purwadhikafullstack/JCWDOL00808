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
  Spinner,
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
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";

const History = () => {
  let role = localStorage.getItem("role");
  let token = localStorage.getItem("token");

  const [sort, setSort] = useState("id");
  const [order, setOrder] = useState("ASC");
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [stockHistories, setStockHistories] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const navigate = useNavigate();

  const getHistoryData = () => {
    Axios.post(
      API_url + `/histories/test?page=${page}`,
      {
        warehouse: selectedWarehouse,
        month: month,
        year: year,
      },
      {
        headers: { Authorization: token },
      }
    )
      .then((response) => {
        setStockHistories(response.data.data);
        setWarehouseData(response.data.warehouse);
        setTotalPage(response.data.totalPage);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getHistoryData();
  }, [selectedWarehouse, page, month, year]);

  // const handleSearchButton = () => {
  //   setKeyword(search);
  // };

  // const handleResetButton = () => {
  //   setKeyword("");
  // };

  const showStockHistories = () => {
    return stockHistories.map((value) => {
      return (
        <Tr key={value.id}>
          <Td>{value.name}</Td>
          <Td>
            <Flex>
              <AiOutlineArrowDown />
              {value.stockIn}
            </Flex>
          </Td>
          <Td>{value.stockOut}</Td>
          <Td>{value.latestStock}</Td>
          <Td>
            {role == 1 ? (
              <>
                <Button colorScheme="blue" onClick={() => navigate(`/warehouse/history-details?id=${value.products_id}`)}>
                  View details
                </Button>
              </>
            ) : null}
          </Td>
        </Tr>
      );
    });
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  return (
    <>
      <Flex flexDirection="column">
        <Flex px="0">
          <Box id="sort filter and search" mx="100" mt="100">
            <Card maxW="xs" border="1px" borderColor="gray.200">
              <CardBody>
                <VStack>
                  <FormControl>
                    <FormLabel>Warehouse:</FormLabel>
                    <Select onChange={(element) => setSelectedWarehouse(element.target.value)}>
                      <option value="">All Warehouse</option>
                      {warehouseData?.map((value) => {
                        return <option value={value.id}>{value.name}</option>;
                      })}
                    </Select>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
            <Card maxW="xs" border="1px" borderColor="gray.200" mt="30">
              <CardBody>
                <FormControl>
                  <FormLabel>Month:</FormLabel>
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
                    <FormLabel>Year:</FormLabel>
                    <Select placeholder="Select year" onChange={(element) => setYear(element.target.value)}>
                      <option value={2022}>2022</option>
                      <option value={2023}>2023</option>
                      <option value={2024}>2024</option>
                    </Select>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* <Card maxW="xs" border="1px" borderColor="gray.200" mt="30">
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
                  </FormControl>
                </VStack>
              </CardBody>
            </Card> */}
          </Box>
          {stockHistories.length == 0 ? (
            <Spinner color="red.500" />
          ) : (
            <Box id="tabel stock histories" mr="30" my="100">
              <TableContainer bg="white" border="1px" borderColor="gray.200">
                <Table variant="striped" size="md">
                  <Thead>
                    <Tr>
                      <Th>Product Name</Th>
                      <Th>Stock In</Th>
                      <Th>Stock Out</Th>
                      <Th>Latest Stock</Th>
                      {role == 1 ? <Th isNumeric>Action</Th> : null}
                    </Tr>
                  </Thead>
                  <Tbody>{showStockHistories()}</Tbody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Flex>
        <Box id="pagination" className="mt-5 flex items-center justify-center">
          <ReactPaginate
            previousLabel={"< Previous"}
            nextLabel={"Next >"}
            breakLabel={"..."}
            pageCount={totalPage}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={"flex"}
            pageClassName={"page-item"}
            pageLinkClassName={"mx-2 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"}
            previousLinkClassName={"mx-2 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"}
            nextLinkClassName={"mx-2 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"}
          />
        </Box>
      </Flex>
    </>
  );
};

export default History;
