import { Table, Thead, Tbody, Tr, Th, Td, IconButton, Flex, Box, Input, Button, Menu, MenuButton, MenuList, MenuItem, Icon, Text, TableCaption } from "@chakra-ui/react";
import { EditIcon, DeleteIcon, InfoOutlineIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaSort, FaFilter, FaPlus, FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ManageCategoryProducts() {
  const [category, setCategoryProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("id");
  const [order, setOrder] = useState("DESC");

  useEffect(() => {
    getCategoryProducts();
  }, [page, keyword, sort, order]);

  const getCategoryProducts = async () => {
    const response = await axios.get(`http://localhost:8000/productcategory/listproductcategory?search_query=${keyword}&page=${page}&limit=${limit}`, {
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
      await axios.delete(`http://localhost:8000/productcategory/deletecategoryproduct/${id}`);
      getCategoryProducts();
    } catch (error) {
      console.log(error);
    }
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

  //function untuk memoting deskripsi yang terlalu panjang
  function truncateDescription(description, maxLength) {
    const truncatedDescription = description.slice(0, maxLength);
    const shouldTruncate = description.length > maxLength;

    return shouldTruncate ? truncatedDescription + "..." : description;
  }

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
            Name
          </MenuButton>
          <MenuList>
            <MenuItem value={sort} onClick={() => handleSort("category")}>
              Category
            </MenuItem>
            <MenuItem value={sort} onClick={() => handleSort("description")}>
              Description
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
        <Button colorScheme="green" size="sm" ml="auto" leftIcon={<Icon as={FaPlus} />}>
          <Link to="/admin/addcategory">
            <Flex alignItems="center">
              <Text mr={2}>Add Product</Text>
            </Flex>
          </Link>
        </Button>
      </Flex>

      {/* fitur table */}
      <Table variant="striped" size="sm" mt="2" textAlign="center">
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
                {index + 1}
              </Td>
              <Td fontSize="sm">{categoryProduct.category}</Td>
              <Td fontSize="sm">{truncateDescription(categoryProduct.description, 35)}</Td>
              <Td>
                <Box display="flex">
                  <Link to={`/admin/patch-category/${categoryProduct.id}`}>
                    <IconButton size="sm" bgColor="green.500" aria-label="Edit" icon={<EditIcon />} mr={2} borderRadius="full" _hover={{ bg: "green.700" }} />
                  </Link>
                  <IconButton
                    size="sm"
                    bgColor="red.500"
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    borderRadius="full"
                    _hover={{ bg: "red.700" }}
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this Category Product ?")) {
                        deleteProducts(categoryProduct.id);
                      }
                    }}
                  />
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

export default ManageCategoryProducts;
