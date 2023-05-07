import { Flex, Box, Menu, MenuButton, MenuList, MenuItem, Icon, Text } from "@chakra-ui/react";
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
    const response = await axios.get(`http://localhost:8000/admin/getAdminUserList?search_query=${keyword}&page=${page}&limit=${limit}&verification_status=${verificationStatus}`, {
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
    <div class="container mx-auto mt-5 ">
      <div class="grid grid-cols-5 md:grid-cols-1">
        <div class="mx-4">
          <form onSubmit={searchData}>
            <div class="flex justify-center my-2">
              <div class="relative mr-2">
                <input type="text" class="h-10 w-96 pl-3 pr-8 rounded-lg z-0 border-2 focus:shadow focus:outline-none" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search here..." />
                <div class=" top-0 right-0 mt-3 mr-2">
                  <button type="submit" class="bg-dark-purple hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Search
                  </button>
                </div>
              </div>
            </div>
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
          <table class=" w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th class="py-3 px-6 text-left">No</th>
                <th class="py-3 px-6 text-left">Name</th>
                <th class="py-3 px-6 text-left">Email</th>
                <th class="py-3 px-6 text-left">Phone Number</th>
                <th class="py-3 px-6 text-left">Date</th>
                <th class="py-3 px-6 text-left">Profile Picture</th>
                <th class="py-3 px-6 text-left">Verification Status</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm font-light">
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td class="py-3 px-6 text-left">{index + 1 + page * limit}</td>
                  <td class="py-3 px-6 text-left">{user.full_name}</td>
                  <td class="py-3 px-6 text-left">{user.email}</td>
                  <td class="py-3 px-6 text-left">{user.phone_number}</td>
                  <td class="py-3 px-6 text-left">{formatDate(user.updatedAt)}</td>
                  <td class="py-3 px-6 text-left">
                    <img src={`http://localhost:8000/${user.profile_picture}`} alt="user" width="50" />
                  </td>
                  <td class="py-3 px-6 text-left">{user.is_verified ? "Verified" : "Not Verified"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p class="my-4">
            Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
          </p>
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
      </div>
    </div>
  );
};

export default UserList;
