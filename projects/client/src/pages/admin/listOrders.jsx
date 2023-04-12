import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { FaSort, FaFilter, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SendOrderModal from "../../components/SendOrderModal";

function ListOrders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("id");
  const [order, setOrder] = useState("DESC");
  const toast = useToast();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    getOrders();
  }, [page, keyword, sort, order]);

  const getOrders = async () => {
    const response = await axios.get(
      `http://localhost:8000/orders/get-order?search=${keyword}&page=${page}&limit=${limit}`,
      {
        params: {
          sort,
          order,
        },
        headers: { Authorization: token },
      }
    );
    setOrders(response.data.result);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
  };

  const fetchOrderDetailsAndOpenModal = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/orders/get-order-details/${orderId}`,
        {
          headers: { Authorization: token },
        }
      );
      setOrderDetails(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error fetching order details",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const searchData = () => {
    setPage(0);
    setKeyword(query);
  };

  const handleSort = (value) => {
    if (value === "warehouseName") {
      setSort(["warehouse", "name"]);
    } else {
      setSort(value);
    }
    setPage(0);
  };

  const handleOrder = (value) => {
    setOrder(value);
    setPage(0);
  };

  const getSortLabel = (sortValue) => {
    if (sortValue === "status") {
      return "Status";
    } else if (
      Array.isArray(sortValue) &&
      sortValue[0] === "warehouse" &&
      sortValue[1] === "name"
    ) {
      return "Warehouse1";
    } else if (sortValue === "total_price") {
      return "Total Price";
    } else {
      return "ID";
    }
  };

  function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  }

  function formatWeight(weightInGrams) {
    const weightInKilograms = weightInGrams / 1000;
    return `${weightInKilograms} kg`;
  }

  // membuat role admin warehouse hanya bisa read data saja
  const role = localStorage.getItem("role");
  const isButtonDisabled = role === "2";
  const buttonColorScheme = isButtonDisabled ? "gray" : "green";

  return (
    // <div style={{ margin: "auto", width: "70%" }}>
    <div className="container mx-auto px-4 mb-3">
      {/* fitur search */}
      <form onSubmit={searchData}>
        <Flex mt="2" size="sm">
          <Input
            type="text"
            placeholder="Search"
            mr={2}
            width="30%"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button colorScheme="blue" type="button" onClick={searchData}>
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
            {getSortLabel(sort)}
          </MenuButton>
          <MenuList>
            <MenuItem value={sort} onClick={() => handleSort("status")}>
              Status
            </MenuItem>
            <MenuItem value={sort} onClick={() => handleSort("warehouseName")}>
              Warehouse
            </MenuItem>
            <MenuItem value={sort} onClick={() => handleSort("total_price")}>
              Total Price
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
      </Flex>
      {/* fitur table */}
      <Table variant="striped" size="sm" mt="2" textAlign="center">
        <TableCaption mb="2">
          Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
        </TableCaption>
        <Thead>
          <Tr>
            <Th>Warehouse Name</Th>
            <Th>Recipient</Th>
            <Th>Grand Total</Th>
            <Th>Status</Th>
            <Th>Payment Proof</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((orderData) => (
            <Tr key={orderData.id} align="center">
              <Td fontSize="sm" fontWeight="medium">
                {orderData.warehouse.name}
              </Td>
              <Td fontSize="sm">{orderData.user_address.recipient}</Td>
              <Td fontSize="sm">
                {formatRupiah(orderData.total_price + orderData.shipping_cost)}
              </Td>
              <Td fontSize="sm">{orderData.status}</Td>
              <Td fontSize="sm">
                {/* for showing payment proof */}
                {/* {orderData.payment_proof ? (
                  <img
                    src={`http://localhost:8000/${orderData.payment_proof}`}
                    alt="Product image"
                    width="50"
                  />
                ) : (
                  "Data Not Found"
                )} */}
                {orderData.payment_proof ? (
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => {
                      // Your click event handler here
                    }}
                    disabled={!orderData.payment_proof}
                    mr={2}
                  >
                    Show Payment Proof
                  </Button>
                ) : (
                  "Data Not Found"
                )}
              </Td>
              <Td>
                <Box display="flex">
                  <Button
                    size="sm"
                    mr={2}
                    _hover={{ bg: "yellow.500" }}
                    colorScheme="yellow"
                    onClick={() => fetchOrderDetailsAndOpenModal(orderData.id)}
                  >
                    Order Details
                  </Button>
                  <SendOrderModal orders_id={orderData.id} />
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {/* fitur paginate */}
      <Flex alignItems="center" justifyContent="center">
        <ReactPaginate
          previousLabel={"< Prev"}
          nextLabel={"Next >"}
          pageCount={Math.min(10, pages)}
          onPageChange={changePage}
          containerClassName={"flex"}
          pageLinkClassName={
            "mx-2 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          }
          previousLinkClassName={
            "mx-2 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          }
          nextLinkClassName={
            "mx-2 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          }
          activeLinkClassName={
            "mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          }
          disabledLinkClassName={
            "mx-2 bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded"
          }
        />
      </Flex>
      {/* modal untuk order details */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant="striped" size="sm">
              <Thead>
                <Tr>
                  <Th>Product</Th>
                  <Th>Quantity</Th>
                  <Th>Product Price</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orderDetails.map((detail) => (
                  <Tr key={detail.id}>
                    <Td>{detail.product_name}</Td>
                    <Td>{detail.quantity}</Td>
                    <Td>{formatRupiah(detail.product_price)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ListOrders;
