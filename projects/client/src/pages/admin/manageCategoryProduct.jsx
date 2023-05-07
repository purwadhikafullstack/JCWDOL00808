import { Table, Thead, Tbody, Tr, Th, Td, IconButton, Flex, Box, Input, Button, Menu, MenuButton, MenuList, MenuItem, Icon, Text, TableCaption, useToast } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { FaSort, FaFilter, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import axios from "axios";
import AddCategoryProductModal from "../../components/addCategoryProductModal";
import PatchCategoryProduct from "../../components/patchCategoryProductModal";
import DeleteConfirmation from "../../components/DeleteConfirmationDialog";

function ManageCategoryProducts() {
  const [category, setCategoryProducts] = useState([]);
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("updatedAt");
  const [sortText, setSortText] = useState("Date");
  const [order, setOrder] = useState("DESC");

  const toast = useToast();

  useEffect(() => {
    getCategoryProducts();
  }, [page, keyword, sort, order]);

  const getCategoryProducts = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/productcategory/listproductcategory?search_query=${keyword}&page=${page}&limit=${limit}`, {
      params: {
        sort,
        order,
      },
    });
    setCategoryProducts(response.data.result);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
  };

  const deleteProducts = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/productcategory/deletecategoryproduct/${id}`);
      toast({
        title: `Delete Category Success`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      getCategoryProducts();
    } catch (error) {
      toast({
        title: `${error.response.data.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleCategoryUpdate = () => {
    getCategoryProducts();
  };

  const handleFirstModalOpen = () => {
    setIsFirstModalOpen(true);
  };

  const handleSecondModalOpen = () => {
    setIsSecondModalOpen(true);
  };

  const handleModalClose = () => {
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(false);
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
      case "name":
        setSortText("Name");
        break;
      case "description":
        setSortText("Description");
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

  //function untuk memoting deskripsi yang terlalu panjang
  function truncateDescription(description, maxLength) {
    const truncatedDescription = description.slice(0, maxLength);
    const shouldTruncate = description.length > maxLength;

    return shouldTruncate ? truncatedDescription + "..." : description;
  }

  // membuat role admin warehouse hanya bisa read data saja
  const role = localStorage.getItem("role");
  const isButtonDisabled = role === "2";

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
            <MenuItem value={sort} onClick={() => handleSort("name")}>
              Name
            </MenuItem>
            <MenuItem value={sort} onClick={() => handleSort("description")}>
              Description
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

        <Button colorScheme="teal" size="sm" ml="auto" leftIcon={<Icon as={FaPlus} />} isDisabled={isButtonDisabled} onClick={handleFirstModalOpen}>
          Add Category Product
        </Button>
        <AddCategoryProductModal isOpen={isFirstModalOpen} onClose={handleModalClose} onCategoryUpdate={handleCategoryUpdate} />
      </Flex>

      {/* fitur table */}
      <Table variant="striped" size="sm" mt="2" textAlign="center" border="1px solid gray">
        <TableCaption mb="2">
          Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
        </TableCaption>
        <Thead>
          <Tr>
            <Th>No</Th>
            <Th>Category</Th>
            <Th>Description</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {category.map((categoryProduct, index) => (
            <Tr key={categoryProduct.id} align="center">
              <Td fontSize="sm" fontWeight="medium">
                {index + 1 + page * limit}
              </Td>
              <Td fontSize="sm">{categoryProduct.name}</Td>
              <Td fontSize="sm">{truncateDescription(categoryProduct.description, 35)}</Td>
              <Td>
                <Box display="flex">
                  <IconButton
                    size="sm"
                    bgColor="green.500"
                    aria-label="Edit"
                    icon={<EditIcon />}
                    mr={2}
                    borderRadius="full"
                    _hover={{ bg: "green.700" }}
                    isDisabled={isButtonDisabled}
                    onClick={() => {
                      handleSecondModalOpen(true);
                      setSelectedCategoryId(categoryProduct.id);
                    }}
                  />

                  {/* button icon for delete category product */}
                  <DeleteConfirmation onDelete={() => deleteProducts(categoryProduct.id)} isButtonDisabled={isButtonDisabled} />
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <PatchCategoryProduct categoryId={selectedCategoryId} isOpen={isSecondModalOpen} onClose={handleModalClose} onCategoryUpdate={handleCategoryUpdate} />

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

export default ManageCategoryProducts;
