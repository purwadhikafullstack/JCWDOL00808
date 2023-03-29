import { Table, Thead, Tbody, Tr, Th, Td, IconButton, Flex, Box, Input, Button, Menu, Select, MenuButton, MenuList, MenuItem, Icon, Text, TableCaption, useToast } from "@chakra-ui/react";
import { EditIcon, DeleteIcon, ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { FaSort, FaFilter, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import RequestMutationModal from "../../components/RequestMutationModal";

function ManageMutations() {
  const [mutation, setMutation] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("quantity");
  const [sortText, setSortText] = useState("quantity");
  const [order, setOrder] = useState("DESC");
  const toast = useToast();
  const token = localStorage.getItem("token");

  useEffect(() => {
    getListMutations();
  }, [page, keyword, sort, order]);

  const getListMutations = async () => {
    const response = await axios.get(`http://localhost:8000/mutations/getAllRequestMutation?search_query=${keyword}&page=${page}&limit=${limit}`, {
      params: {
        sort,
        order,
      },
    });
    setMutation(response.data.result);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:8000/mutations/confirm-mutation/${id}`,
        { status },
        {
          headers: { Authorization: token },
        }
      );
      getListMutations();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setKeyword(query);
  };

  const handleSort = (value) => {
    setSort(value);
    setPage(0);
    // add switch case to convert value to readable text
    switch (value) {
      case "product_id":
        setSortText("Product");
        break;
      case "quantity":
        setSortText("Quantity");
        break;
      case "from_warehouse_id":
        setSortText("From Warehouse");
        break;
      case "to_warehouse_id":
        setSortText("To Warehouse");
        break;
      default:
        setSortText(value);
    }
  };

  const handleOrder = (value) => {
    setOrder(value);
    setPage(0);
  };

  return (
    <div style={{ margin: "auto", width: "70%" }}>
      {/* fitur search */}

      <form onSubmit={searchData}>
        <Flex mt="2" size="sm">
          <Input type="text" placeholder="Search" mr={2} width="30%" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button colorScheme="blue" type="submit">
            Search
          </Button>
        </Flex>
      </form>

      {/* fitur untuk filter, sort dan add product */}
      <Flex alignItems="center" mt="2">
        <Box mr={2}>
          <Icon as={FaSort} />
        </Box>
        <Text fontWeight="bold">Sort by:</Text>
        <Menu>
          <MenuButton ml={2} variant="ghost">
            {sortText}
          </MenuButton>
          <MenuList>
            <MenuItem value={sort} onClick={() => handleSort("product_id")}>
              Product
            </MenuItem>
            <MenuItem value={sort} onClick={() => handleSort("quantity")}>
              Quantity
            </MenuItem>
            <MenuItem value={sort} onClick={() => handleSort("from_warehouse_id")}>
              From Warehouse
            </MenuItem>
            <MenuItem value={sort} onClick={() => handleSort("to_warehouse_id")}>
              To Warehouse
            </MenuItem>
          </MenuList>
        </Menu>
        <Box mr={2} ml="4">
          <Icon as={FaFilter} />
        </Box>
        <Text fontWeight="bold">Order:</Text>
        <Menu>
          <MenuButton ml={2} variant="ghost">
            {order}
          </MenuButton>
          <MenuList>
            <MenuItem value={order} onClick={() => handleOrder("ASC")}>
              Ascending
            </MenuItem>
            <MenuItem value={order} onClick={() => handleOrder("DESC")}>
              Descending
            </MenuItem>
          </MenuList>
        </Menu>

        <Button colorScheme="teal" size="sm" ml="auto" leftIcon={<FaPlus />} onClick={handleOpenModal}>
          Request Stock Mutation
        </Button>
        <RequestMutationModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </Flex>

      {/* fitur table */}
      <Table variant="striped" size="sm" mt="2" textAlign="center">
        <TableCaption mb="2">
          Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
        </TableCaption>
        <Thead>
          <Tr>
            <Th>No</Th>
            <Th>Product</Th>
            <Th>Quantity</Th>
            <Th>From Warehouse</Th>
            <Th>To Warehouse</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {mutation.map((mutation, index) => (
            <Tr key={mutation.id} align="center">
              <Td fontSize="sm" fontWeight="medium">
                {index + 1}
              </Td>
              <Td fontSize="sm">{mutation.product.name}</Td>
              <Td fontSize="sm">{mutation.quantity}</Td>
              <Td fontSize="sm">{mutation.from_warehouse.name}</Td>
              <Td fontSize="sm">{mutation.to_warehouse.name}</Td>
              <Td>
                <Box display="flex">
                  {mutation.mutation_type === "Pending" && (
                    <div key={mutation.id}>
                      <Select placeholder="Select status" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option value="ACCEPT">Accept</option>
                        <option value="REJECT">Reject</option>
                      </Select>
                      <Button colorScheme="teal" size="sm" onClick={() => handleStatusUpdate(mutation.id, selectedStatus)}>
                        Submit
                      </Button>
                    </div>
                  )}
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* fitur paginate */}
      <Flex alignItems="center" justifyContent="center">
        <ReactPaginate
          previousLabel={<ChevronLeftIcon />}
          nextLabel={<ChevronRightIcon />}
          pageCount={Math.min(10, pages)}
          onPageChange={changePage}
          containerClassName={"flex"}
          pageLinkClassName={"mx-2"}
          previousLinkClassName={"mx-2"}
          nextLinkClassName={"mx-2"}
          activeLinkClassName={"mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}
          disabledLinkClassName={"mx-2 bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded"}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          breakClassName={"mx-2 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"}
          breakLabel={"..."}
          renderPageLink={({ selected, children }) => (
            <Button key={children} variant="solid" size="md" mx={2} rounded="md" fontWeight="bold" bg={selected ? "blue.500" : "gray.200"} color={selected ? "white" : "gray.800"} _hover={{ bg: selected ? "blue.700" : "gray.400" }}>
              {children}
            </Button>
          )}
        />
      </Flex>
    </div>
  );
}

export default ManageMutations;
