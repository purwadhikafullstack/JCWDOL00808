import { Flex, Box, Menu, MenuButton, MenuList, MenuItem, Icon, Text, Input, Button, Table, Tr, Td, Th, Tbody, TableCaption, Thead } from "@chakra-ui/react";
import { FaSort, FaFilter } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("updatedAt");
  const [sortText, setSortText] = useState("Date");
  const [order, setOrder] = useState("DESC");
  const [verificationStatus, setVerificationStatus] = useState("");

  useEffect(() => {
    getUsers();
  }, [page, keyword, sort, order, verificationStatus]);

  const getUsers = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/getAdminUserList?search_query=${keyword}&page=${page}&limit=${limit}&verification_status=${verificationStatus}`, {
      params: {
        sort,
        order,
      },
    });
    setUsers(response.data.result);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
  };

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setKeyword(query);
  };

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const handleSort = (value) => {
    setSort(value);
    setPage(0);
    // add switch case to convert value to readable text
    switch (value) {
      case "full_name":
        setSortText("Name");
        break;
      case "email":
        setSortText("Email");
        break;
      case "updatedAt":
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

  const handleVerificationStatus = (value) => {
    setVerificationStatus(value);
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

      {/* fitur sort and order */}
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
            <MenuItem value={sort} onClick={() => handleSort("full_name")}>
              Name
            </MenuItem>
            <MenuItem value={sort} onClick={() => handleSort("email")}>
              Email
            </MenuItem>
            <MenuItem value={sort} onClick={() => handleSort("updatedAt")}>
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
        <Box mr={2} ml="4">
          <Icon as={FaFilter} />
        </Box>
        <Text fontWeight="bold">Verification Status:</Text>
        <Menu>
          <MenuButton ml={2} variant="ghost">
            {verificationStatus === 1 ? "Verified" : verificationStatus === 0 ? "Not Verified" : "All"}
          </MenuButton>

          <MenuList>
            <MenuItem onClick={() => handleVerificationStatus("")}>All</MenuItem>
            <MenuItem onClick={() => handleVerificationStatus(1)}>Verified</MenuItem>
            <MenuItem onClick={() => handleVerificationStatus(0)}>Not Verified</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {/* tabel list user */}
      <Table variant="striped" size="sm" mt="2" textAlign="center" border="1px solid gray">
        <TableCaption mb="2">
          Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
        </TableCaption>
        <Thead>
          <Tr>
            <Th>No</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone Number</Th>
            <Th>Date</Th>
            <Th>Profile Picture</Th>
            <Th>Verification Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user, index) => (
            <Tr key={user.id} align="center">
              <Td fontSize="sm" fontWeight="medium">
                {index + 1 + page * limit}
              </Td>
              <Td fontSize="sm" fontWeight="medium">
                {user.full_name}
              </Td>
              <Td fontSize="sm">{user.email}</Td>
              <Td fontSize="sm">{user.phone_number}</Td>
              <Td fontSize="sm">{formatDate(user.updatedAt)}</Td>
              <Td fontSize="sm">
                <img src={`${process.env.REACT_APP_API_BASE_URL}/${user.profile_picture}`} alt="user" width="50" />
              </Td>
              <Td>{user.is_verified ? "Verified" : "Not Verified"}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <nav class="flex items-center justify-center mt-4 mb-10" key={rows} role="navigation" aria-label="pagination">
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
      </nav>
    </div>
  );
};

export default UserList;
