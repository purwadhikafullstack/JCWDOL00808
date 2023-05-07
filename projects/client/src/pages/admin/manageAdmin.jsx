import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { API_url } from "../../helper";
import { useNavigate } from "react-router-dom";
import { Flex, Box, Menu, MenuButton, MenuList, MenuItem, Icon, Text, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button, useToast } from "@chakra-ui/react";
import { FaSort, FaFilter } from "react-icons/fa";
import RegisterAdminModal from "../../components/addAdminModal";
import PatchAdminModal from "../../components/patchAdminModal";

const ManageAdmin = () => {
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
  const [roleAdmin, setRoleAdmin] = useState("");
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();

  useEffect(() => {
    getUsers();
  }, [page, keyword, sort, order, roleAdmin]);

  const getUsers = async () => {
    const response = await axios.get(`http://localhost:8000/admin/getAdmin?search_query=${keyword}&page=${page}&limit=${limit}&role_admin=${roleAdmin}`, {
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

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const deleteAdmin = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/admin/deleteAdmin/${id}`);
      getUsers();
      toast({
        title: `Admin is deleted`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: `${error.response.data.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
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
      case "full_name":
        setSortText("Name");
        break;
      case "email":
        setSortText("Email");
        break;
      default:
        setSortText(value);
    }
  };

  const handleAdminUpdate = () => {
    getUsers();
  };

  const handleFirstModalOpen = () => {
    setIsFirstModalOpen(true);
  };

  const handleSecondModalOpen = (isOpen) => {
    setIsSecondModalOpen(isOpen);
  };

  const openPatchAdminModal = (adminId) => {
    setSelectedAdminId(adminId);
    handleSecondModalOpen(true);
  };

  const handleModalClose = () => {
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(false);
  };

  const handleOrder = (e) => {
    setOrder(e.currentTarget.value);
    setPage(0);
  };

  const handleRoleAdmin = (value) => {
    setRoleAdmin(value);
    setPage(0);
  };

  const openDeleteDialog = (adminId) => {
    setAdminToDelete(adminId);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setAdminToDelete(null);
  };

  const navigate = useNavigate();

  return (
    <div class="container mx-auto mt-5">
      <div class="grid grid-cols-5 md:grid-cols-1">
        <div class="mx-4">
          <form onSubmit={searchData}>
            <div class="flex justify-center my-2">
              <div class="relative mr-2">
                <input type="text" class="h-10 w-96 pl-3 pr-8 rounded-lg z-0 border-2 focus:shadow focus:outline-none" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search here..." />
                <div class=" top-0 right-0 mt-3 mr-2">
                  <button type="submit" class="bg-dark-purple hover:bg-blue-700 text-white font-bold  py-2 px-4 rounded">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </form>

          <div className="flex items-center justify-between mb-4 md:mb-0">
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
                  <MenuItem value="ASC" onClick={(e) => handleOrder(e)}>
                    Ascending
                  </MenuItem>
                  <MenuItem value="DESC" onClick={(e) => handleOrder(e)}>
                    Descending
                  </MenuItem>
                </MenuList>
              </Menu>
              <Box mr={2} ml="4">
                <Icon as={FaFilter} />
              </Box>
              <Text fontWeight="bold">Role Admin :</Text>
              <Menu>
                <MenuButton ml={2} variant="ghost">
                  {roleAdmin === 1 ? "Admin" : roleAdmin === 2 ? "Admin Warehouse" : "All"}
                </MenuButton>

                <MenuList>
                  <MenuItem onClick={() => handleRoleAdmin("")}>All</MenuItem>
                  <MenuItem onClick={() => handleRoleAdmin(1)}>Admin</MenuItem>
                  <MenuItem onClick={() => handleRoleAdmin(2)}>Admin Warehouse</MenuItem>
                </MenuList>
              </Menu>
            </Flex>

            <div className="flex items-center ml-auto">
              {/* <Link to={"/admin/registeradmin"}> */}
              <button
                onClick={() => {
                  handleFirstModalOpen();
                }}
                className="bg-dark-purple hover:bg-blue-700 text-white font-bold p-2 ml-6 rounded"
              >
                Add Admin
              </button>
              {/* </Link> */}
              <RegisterAdminModal isOpen={isFirstModalOpen} onClose={handleModalClose} onAdminPatch={handleAdminUpdate} />
            </div>
          </div>
          <form>
            <table class=" w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th class="py-3 px-3 text-left">No</th>
                  <th class="py-3 px-6 text-left">Name</th>
                  <th class="py-3 px-6 text-left">Email</th>
                  <th class="py-3 px-6 text-left">Phone Number</th>
                  <th class="py-3 px-6 text-left">Profile Picture</th>
                  <th class="py-3 px-6 text-left">Role Admin</th>
                  <th class="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody class="text-gray-600 text-sm font-light">
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td class="py-3 px-3 text-left">{index + 1 + page * limit}</td>
                    <td class="py-3 px-6 text-left">{user.full_name}</td>
                    <td class="py-3 px-6 text-left">{user.email}</td>
                    <td class="py-3 px-6 text-left">{user.phone_number}</td>
                    <td class="py-3 px-6 text-left">
                      <img src={`http://localhost:8000/${user.profile_picture}`} alt="Admin" width="50" />
                    </td>
                    <td class="py-3 px-6 text-left">{user.role == 1 ? "Admin" : "Admin Warehouse"}</td>
                    <td class="py-3 px-4 text-left flex">
                      {/* button patch admin */}
                      <button
                        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          openPatchAdminModal(user.id);
                        }}
                      >
                        Edit
                      </button>
                      {/* button assign admin */}
                      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => navigate(`/admin/assign/${user.id}`)}>
                        Assign
                      </button>
                      {/* button delete admin */}
                      <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onMouseDown={() => openDeleteDialog(user.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
          {/* Modal Patch Admin */}
          <PatchAdminModal adminId={selectedAdminId} isOpen={isSecondModalOpen} onClose={handleModalClose} onAdminPatch={handleAdminUpdate} />
          {/* Batas Modal Patch Admin */}
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
      {/* Modal to dialog alert delete Admin */}
      <AlertDialog isOpen={isDeleteDialogOpen} onClose={closeDeleteDialog} leastDestructiveRef={cancelRef} motionPreset="slideInBottom">
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Admin
          </AlertDialogHeader>
          <AlertDialogBody>Are you sure you want to delete this admin? This action cannot be undone.</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                deleteAdmin(adminToDelete);
                closeDeleteDialog();
              }}
              ml={3}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageAdmin;
