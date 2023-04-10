import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Box,
  Input,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Text,
  TableCaption,
  useToast,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { FaSort, FaFilter, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import axios from "axios";
import RequestMutationModal from "../../components/RequestMutationModal";

function ManageMutations() {
  const [mutation, setMutation] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [sortText, setSortText] = useState("Date");
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
      toast({
        title: `Confirm Stock Mutation Success`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: `${error.response.data.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  function handleIconClick(id, status) {
    setDialogAction(id);
    setSelectedStatus(status);
    setIsPopoverOpen(true);
  }

  function handlePopoverClose() {
    setIsPopoverOpen(false);
    setDialogAction("");
  }

  function handleDialogConfirm() {
    handleStatusUpdate(dialogAction, selectedStatus);
    handlePopoverClose();
  }

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
      case "products_id":
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
      case "createdAt":
        setSortText("Date");
        break;
      default:
        setSortText(value);
    }
  };

  const handleOrder = (value) => {
    setOrder(value);
    setPage(0);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${day}/${month}/${year}`;
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
            <MenuItem value={sort} onClick={() => handleSort("products_id")}>
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
            <MenuItem value={sort} onClick={() => handleSort("createdAt")}>
              Date
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
            <Th>From</Th>
            <Th>To</Th>
            <Th>Status</Th>
            <Th>Date</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {mutation.map((mutation, index) => (
            <Tr key={mutation.id} align="center">
              <Td fontSize="sm" fontWeight="medium">
                {index + 1 + page * limit}
              </Td>
              <Td fontSize="sm">{mutation.product.name}</Td>
              <Td fontSize="sm">{mutation.quantity}</Td>
              <Td fontSize="sm">{mutation.from_warehouse.name}</Td>
              <Td fontSize="sm">{mutation.to_warehouse.name}</Td>
              <Td fontSize="sm">{mutation.mutation_type}</Td>
              <Td fontSize="sm">{formatDate(mutation.createdAt)}</Td>
              <Td>
                <Box display="flex">
                  {mutation.mutation_type === "Pending" && (
                    <div key={mutation.id}>
                      <Box position="relative">
                        <IconButton icon={<FaCheck />} name="check" size="sm" color="green.500" _hover={{ color: "green.600" }} onClick={() => handleIconClick(mutation.id, "ACCEPT")} />
                        <IconButton icon={<FaTimes />} name="close" size="sm" color="red.500" _hover={{ color: "red.600" }} onClick={() => handleIconClick(mutation.id, "REJECT")} />
                      </Box>
                      <Box position="relative">
                        <Popover isOpen={isPopoverOpen} onClose={handlePopoverClose} placement="bottom-start" closeOnBlur={false}>
                          <PopoverContent>
                            <PopoverHeader fontWeight="bold">{selectedStatus === "ACCEPT" ? "Confirm Accept" : "Confirm Reject"}</PopoverHeader>
                            <PopoverBody>Are you sure you want to {selectedStatus === "ACCEPT" ? "accept" : "reject"}?</PopoverBody>
                            <Flex justify="flex-end" mt={2}>
                              <Button variant="ghost" onClick={handlePopoverClose}>
                                Cancel
                              </Button>
                              <Button colorScheme="teal" ml={3} onClick={handleDialogConfirm}>
                                Confirm
                              </Button>
                            </Flex>
                          </PopoverContent>
                          <PopoverTrigger>
                            <Box position="absolute" top="-10px" right="-10px" width="40px" height="40px" borderRadius="full" bg="transparent" onClick={() => handleIconClick("REJECT")} />
                          </PopoverTrigger>
                        </Popover>
                      </Box>
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
