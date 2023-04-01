import { Table, Thead, Tbody, Tr, Th, Td, IconButton, Flex, Box, Input, Button, Menu, MenuButton, MenuList, MenuItem, Icon, Text, TableCaption, useToast } from "@chakra-ui/react";
import { EditIcon, DeleteIcon, InfoOutlineIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaSort, FaFilter, FaPlus, FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("id");
  const [order, setOrder] = useState("DESC");
  const toast = useToast();

  useEffect(() => {
    getProducts();
  }, [page, keyword, sort, order]);

  const getProducts = async () => {
    const response = await axios.get(`http://localhost:8000/product/listproduct?search_query=${keyword}&page=${page}&limit=${limit}`, {
      params: {
        sort,
        order,
      },
    });
    setProducts(response.data.result);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
    console.log(response.data.result);
  };

  const deleteProducts = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/product/deleteproduct/${id}`);
      getProducts();
      toast({
        title: `Product success deleted`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: `${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
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

  //function untuk memoting deskripsi yang terlalu panjang
  function truncateDescription(description, maxLength) {
    const truncatedDescription = description.slice(0, maxLength);
    const shouldTruncate = description.length > maxLength;

    return shouldTruncate ? truncatedDescription + "..." : description;
  }

  // membuat role admin warehouse hanya bisa read data saja
  const role = localStorage.getItem("role");
  const isButtonDisabled = role === "2";
  const buttonColorScheme = isButtonDisabled ? "gray" : "green";

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
            <MenuItem value={sort} onClick={() => handleSort("name")}>
              Name
            </MenuItem>
            <MenuItem value={sort} onClick={() => handleSort("price")}>
              Price
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
        <Button colorScheme={buttonColorScheme} size="sm" ml="auto" leftIcon={<Icon as={FaPlus} isDisabled={isButtonDisabled} />}>
          <Link to={isButtonDisabled ? "#" : "/admin/addproducts"} style={isButtonDisabled ? { pointerEvents: "none" } : {}}>
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
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Price</Th>
            <Th>Weight</Th>
            <Th>Image</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr key={product.id} align="center">
              <Td fontSize="sm" fontWeight="medium">
                {product.name}
              </Td>
              <Td fontSize="sm">{truncateDescription(product.description, 35)}</Td>
              <Td fontSize="sm">{formatRupiah(product.price)}</Td>
              <Td fontSize="sm">{formatWeight(product.weight)}</Td>
              <Td fontSize="sm">
                <img src={`http://localhost:8000/${product.imageUrl}`} alt="Product image" width="50" />
                {/* {`http://localhost:8000/${product.imageUrl}`} */}
              </Td>
              <Td>
                <Box display="flex">
                  <Link to={isButtonDisabled ? "#" : `/admin/patch-product/${product.id}`} style={isButtonDisabled ? { pointerEvents: "none" } : {}}>
                    <IconButton size="sm" bgColor="green.500" aria-label="Edit" icon={<EditIcon />} mr={2} borderRadius="full" _hover={{ bg: "green.700" }} isDisabled={isButtonDisabled} />
                  </Link>
                  <IconButton
                    size="sm"
                    bgColor="red.500"
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    borderRadius="full"
                    _hover={{ bg: "red.700" }}
                    isDisabled={isButtonDisabled}
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this product ?")) {
                        deleteProducts(product.id);
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

export default ManageProducts;
