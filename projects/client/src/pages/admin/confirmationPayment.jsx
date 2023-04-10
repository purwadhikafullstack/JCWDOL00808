import { Table, Thead, Tbody, Tr, Th, Td, Checkbox, Flex, Box, Input, Button, Menu, MenuButton, MenuList, MenuItem, Icon, Text, TableCaption, useToast } from "@chakra-ui/react";
import { FaSort, FaFilter, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import axios from "axios";

function ManageConfirmationPayment() {
  const [orderList, setOrdersList] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("DESC");
  const [statusFilter, setStatusFilter] = useState("All");

  const toast = useToast();

  useEffect(() => {
    getOrdersList();
  }, [page, keyword, sort, order, statusFilter]);

  const getOrdersList = async () => {
    const status = statusFilter !== "All" ? statusFilter : "";
    const response = await axios.get(`http://localhost:8000/admin/getPaymentConfirmation?search_query=${keyword}&page=${page}&limit=${limit}&status=${status}`, {
      params: {
        sort,
        order,
      },
    });
    setOrdersList(response.data.result);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
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
  };

  const handleOrder = (value) => {
    setOrder(value);
    setPage(0);
  };

  function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  }

  return (
    <div className="container mx-auto px-4 mb-3">
      {/* fitur search */}

      <form onSubmit={searchData}>
        <Flex mt="2" size="sm">
          <Input type="text" placeholder="Search" mr={2} width="30%" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button colorScheme="blue" type="submit">
            Search
          </Button>
        </Flex>
      </form>

      {/* fitur untuk filter, sort  */}
      <Flex alignItems="center" mt="2">
        <Box mr={2}>
          <Icon as={FaSort} />
        </Box>
        <Text fontWeight="bold">Sort by:</Text>
        <Menu>
          <MenuButton ml={2} variant="ghost">
            {sort}
          </MenuButton>
          <MenuList>
            <MenuItem value={sort} onClick={() => handleSort("total_price")}>
              Total Price
            </MenuItem>
            <MenuItem value={sort} onClick={() => handleSort("status")}>
              status
            </MenuItem>
            <MenuItem value={sort} onClick={() => handleSort("createdAt")}>
              Date
            </MenuItem>
          </MenuList>
        </Menu>
        <Box mr={2} ml="4">
          <Icon as={FaSort} />
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
        <Box mr={2} ml="4">
          <Icon as={FaFilter} />
        </Box>
        <Text fontWeight="bold">Filter:</Text>
        <Menu>
          <MenuButton ml={2} variant="ghost">
            {statusFilter}
          </MenuButton>
          <MenuList>
            <MenuItem>
              <Checkbox isChecked={statusFilter === "Waiting For Payment"} onChange={(e) => setStatusFilter(e.target.checked ? "Waiting For Payment" : "")}>
                Waiting For Payment
              </Checkbox>
            </MenuItem>
            <MenuItem>
              <Checkbox isChecked={statusFilter === "Confirmed Payment"} onChange={(e) => setStatusFilter(e.target.checked ? "Confirmed Payment" : "")}>
                Confirmed Payment
              </Checkbox>
            </MenuItem>
            <MenuItem>
              <Checkbox isChecked={statusFilter === " On Process"} onChange={(e) => setStatusFilter(e.target.checked ? " On Process" : "")}>
                On Process
              </Checkbox>
            </MenuItem>
            <MenuItem>
              <Checkbox isChecked={statusFilter === "Shipped"} onChange={(e) => setStatusFilter(e.target.checked ? "Shipped" : "")}>
                Shipped
              </Checkbox>
            </MenuItem>
            <MenuItem>
              <Checkbox isChecked={statusFilter === "Order Confirmed"} onChange={(e) => setStatusFilter(e.target.checked ? "Order Confirmed" : "")}>
                Order Confirmed
              </Checkbox>
            </MenuItem>
            <MenuItem>
              <Checkbox isChecked={statusFilter === "Cancelled"} onChange={(e) => setStatusFilter(e.target.checked ? "Cancelled" : "")}>
                Cancelled
              </Checkbox>
            </MenuItem>
            {statusFilter && (
              <Button ml={2} variant="solid" colorScheme="blue" onClick={() => setStatusFilter("All")}>
                Reset
              </Button>
            )}
          </MenuList>
        </Menu>
      </Flex>

      {/* fitur table */}
      <Table variant="striped" size="sm" mt="2" textAlign="center" borderColor="gray.200" borderWidth="2px">
        <TableCaption mb="2">
          Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
        </TableCaption>
        <Thead>
          <Tr>
            <Th>No</Th>
            <Th>Total Price</Th>
            <Th>Status</Th>
            <Th>Shipping Method</Th>
            <Th>Shipping Cost</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orderList.map((order, index) => (
            <Tr key={order.id} align="center">
              <Td fontSize="sm" fontWeight="medium">
                {index + 1 + page * limit}
              </Td>
              <Td fontSize="sm">{formatRupiah(order.total_price)}</Td>
              <Td fontSize="sm">{order.status}</Td>
              <Td fontSize="sm">{order.shipping_method}</Td>
              <Td fontSize="sm">{formatRupiah(order.shipping_cost)}</Td>
              <Td>{order.status === "Confirmed Payment" && <div key={order.id}>Button</div>}</Td>
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
    </div>
  );
}

export default ManageConfirmationPayment;
