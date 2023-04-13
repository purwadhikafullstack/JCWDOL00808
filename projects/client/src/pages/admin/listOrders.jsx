import {
  Table,
  Thead,
  Tbody,
  VStack,
  Heading,
  Image,
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
import { EditIcon, DeleteIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaSort, FaFilter, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SendOrderModal from "../../components/SendOrderModal";
import { get } from "lodash";

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
  const [allData, getAllData] = useState([]);
  const [isConfirmRejectModalOpen, setIsConfirmRejectModalOpen] = useState(false);
  const [isConfirmAcceptModalOpen, setIsConfirmAcceptModalOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    getOrders();
  }, [page, keyword, sort, order]);

  const getOrders = async () => {
    const response = await axios.get(`http://localhost:8000/orders/get-order?search=${keyword}&page=${page}&limit=${limit}`, {
      params: {
        sort,
        order,
      },
      headers: { Authorization: token },
    });
    setOrders(response.data.result);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
  };

  const fetchOrderDetailsAndOpenModal = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:8000/orders/get-order-details/${orderId}`, {
        headers: { Authorization: token },
      });
      setOrderDetails(response.data);
      const responses = await axios.get(`http://localhost:8000/orders/allorders-data/${orderId}`, {
        headers: { Authorization: token },
      });
      getAllData(responses.data);
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

  const openConfirmAcceptModal = () => {
    setIsConfirmAcceptModalOpen(true);
  };

  const closeConfirmAcceptModal = () => {
    setIsConfirmAcceptModalOpen(false);
  };

  const openConfirmRejectModal = () => {
    setIsConfirmRejectModalOpen(true);
  };

  const closeConfirmRejectModal = () => {
    setIsConfirmRejectModalOpen(false);
  };

  const handleAcceptPayment = async (id) => {
    try {
      await axios.post(`http://localhost:8000/admin/acceptPayment/${id}`, {
        headers: { Authorization: token },
      });
      closeConfirmAcceptModal();
      setIsModalOpen(false);
      toast({
        title: "Success Accept payment",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      getOrders();
    } catch (error) {
      console.error(error);
      closeConfirmAcceptModal();
      toast({
        title: `${error.response.data.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleRejectPayment = async (id) => {
    try {
      await axios.post(`http://localhost:8000/admin/rejectPayment/${id}`, {
        headers: { Authorization: token },
      });
      closeConfirmRejectModal();
      setIsModalOpen(false);
      toast({
        title: "Success rejecting payment",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      getOrders();
    } catch (error) {
      console.error(error);
      toast({
        title: `${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const getSortLabel = (sortValue) => {
    if (sortValue === "status") {
      return "Status";
    } else if (Array.isArray(sortValue) && sortValue[0] === "warehouse" && sortValue[1] === "name") {
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
          <Input type="text" placeholder="Search" mr={2} width="30%" value={query} onChange={(e) => setQuery(e.target.value)} />
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
              <Td fontSize="sm">{formatRupiah(orderData.total_price + orderData.shipping_cost)}</Td>
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
                  <Button size="sm" mr={2} _hover={{ bg: "yellow.500" }} colorScheme="yellow" onClick={() => fetchOrderDetailsAndOpenModal(orderData.id)}>
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
          pageLinkClassName={"mx-2 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"}
          previousLinkClassName={"mx-2 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"}
          nextLinkClassName={"mx-2 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"}
          activeLinkClassName={"mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}
          disabledLinkClassName={"mx-2 bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded"}
        />
      </Flex>
      {/* modal untuk order details */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Payment Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box maxWidth="auto" mx="auto" mt="8" maxHeight="70vh" overflowY="auto" width="100%">
              <Text fontSize="2xl" fontWeight="bold" mb="4">
                Order Confirmation Payment
              </Text>

              <Text mb="2">Order ID: {allData.id}</Text>
              <Text mb="4">User ID: {allData.users_id}</Text>

              <Text fontSize="lg" fontWeight="bold" mb="2">
                Order Details:
              </Text>
              <Table variant="simple" size="sm" mb="4">
                <Thead>
                  <Tr>
                    <Th>Product Name</Th>
                    <Th>Quantity</Th>
                    <Th>Unit Price</Th>
                    <Th>Total Price</Th>
                    <Th>Product Weight</Th>
                    <Th>Image URL</Th>
                    <Th>Product ID</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {orderDetails.map((item) => (
                    <Tr key={item.id}>
                      <Td>{item.product_name}</Td>
                      <Td>{item.quantity}</Td>
                      <Td>{formatRupiah(item.product_price)}</Td>
                      <Td>{formatRupiah(item.quantity * item.product_price)}</Td>
                      <Td>{formatWeight(item.product_weight)}</Td>
                      <Td>
                        <img src={`http://localhost:8000/${item.imageUrl}`} alt="Product" width="50" />
                      </Td>
                      <Td>{item.products_id}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Text fontSize="lg" fontWeight="bold" mb="2">
                Order Summary:
              </Text>
              <Text mb="2">Shipping Method: {allData.shipping_method}</Text>
              <Text mb="2">Shipping Cost: {formatRupiah(allData.shipping_cost)}</Text>
              <Text mb="4">Total Price: {formatRupiah(allData.total_price)}</Text>

              <Text fontSize="lg" fontWeight="bold" mb="2">
                Shipping Information:
              </Text>
              <Text mb="2">Shipping Address ID: {allData.user_addresses_id}</Text>
              <Text mb="4">
                {allData.user_address?.address} {allData.user_address?.city}, {allData.user_address?.province}{" "}
              </Text>

              <Text fontSize="lg" fontWeight="bold" mb="2">
                Warehouse Information:
              </Text>
              <Text mb="2">Warehouse ID: {allData.warehouses_id}</Text>
              <Text mb="4">{allData.warehouse?.name}</Text>

              <Text fontSize="lg" fontWeight="bold" mb="2">
                Payment Information:
              </Text>
              <Text mb="2">Payment Status: {allData.status}</Text>
              <Box>
                <Text mb="4">Payment Proof:</Text>
                <img src={`http://localhost:8000/${allData.payment_proof}`} alt="Payment Proof" width="200" />
                <Text mb="4"></Text>
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter>
            {allData.status === "Confirmed Payment" ? (
              <>
                <Button colorScheme="green" mr={3} onClick={openConfirmAcceptModal}>
                  Accept
                </Button>
                <Button colorScheme="red" onClick={openConfirmRejectModal}>
                  Reject
                </Button>
              </>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for reject Payment */}
      <Modal isOpen={isConfirmRejectModalOpen} onClose={closeConfirmRejectModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to reject this payment?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRejectPayment(allData.id)}>
              Reject
            </Button>
            <Button onClick={closeConfirmRejectModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for Accepted Payment */}
      <Modal isOpen={isConfirmAcceptModalOpen} onClose={closeConfirmAcceptModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Accept Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to Accept this payment?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={() => handleAcceptPayment(allData.id)}>
              Reject
            </Button>
            <Button onClick={closeConfirmAcceptModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ListOrders;
