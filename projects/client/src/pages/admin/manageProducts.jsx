import { Table, Thead, Tbody, Tr, Th, Td, IconButton, Flex, Box, Input, Button, Menu, MenuButton, MenuList, MenuItem, Icon, Text } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaSort, FaFilter, FaPlus, FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import ReactPaginate from "react-paginate";

const products = [
  {
    name: "Product A",
    description: "Lorem ipsum dolor sit amet",
    price: "$10.00",
    weight: "1 lb",
    id: 1,
  },
  {
    name: "Product B",
    description: "Consectetur adipiscing elit",
    price: "$20.00",
    weight: "2 lbs",
    id: 2,
  },
  {
    name: "Product C",
    description: "Sed do eiusmod tempor incididunt",
    price: "$30.00",
    weight: "3 lbs",
    id: 3,
  },
];

function ManageProducts({ pageCount, onPageChange, forcePage }) {
  const handlePageClick = (data) => {
    onPageChange(data.selected);
  };

  return (
    <div style={{ margin: "auto", width: "70%" }}>
      {/* fitur search */}
      <Flex mt="2" size="sm">
        <Input placeholder="Search" mr={2} width="30%" />
        <Button colorScheme="blue">Search</Button>
      </Flex>

      {/* fitur untuk filter, sort dan add product */}
      <Flex alignItems="center" mt="2">
        <Box mr={2}>
          <Icon as={FaSort} />
        </Box>
        <Text fontWeight="bold">Sort by:</Text>
        <Menu>
          <MenuButton ml={2} variant="ghost">
            Date
          </MenuButton>
          <MenuList>
            <MenuItem>Date</MenuItem>
            <MenuItem>Name</MenuItem>
            <MenuItem>Size</MenuItem>
          </MenuList>
        </Menu>
        <Box mr={2} ml="4">
          <Icon as={FaFilter} />
        </Box>
        <Text fontWeight="bold">Filter:</Text>
        <Menu>
          <MenuButton ml={2} variant="ghost">
            All
          </MenuButton>
          <MenuList>
            <MenuItem>All</MenuItem>
            <MenuItem>Photos</MenuItem>
            <MenuItem>Videos</MenuItem>
            <MenuItem>Documents</MenuItem>
          </MenuList>
        </Menu>
        <Button colorScheme="green" size="sm" ml="auto" leftIcon={<Icon as={FaPlus} />}>
          <Flex alignItems="center">
            <Text mr={2}>Add Product</Text>
          </Flex>
        </Button>
      </Flex>

      {/* fitur table */}
      <Table variant="striped" size="sm" mt="2" textAlign="center">
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
              <Td fontSize="sm">{product.description}</Td>
              <Td fontSize="sm">{product.price}</Td>
              <Td fontSize="sm">{product.weight}</Td>
              <Td fontSize="sm"></Td>
              <Td>
                <Box display="flex">
                  <IconButton size="sm" bgColor="green.500" aria-label="Edit" icon={<EditIcon />} mr={2} borderRadius="full" _hover={{ bg: "green.700" }} />
                  <IconButton size="sm" bgColor="red.500" aria-label="Delete" icon={<DeleteIcon />} borderRadius="full" _hover={{ bg: "red.700" }} />
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* fitur paginate */}
      <Flex alignItems="center" justifyContent="center">
        <ReactPaginate
          pageCount={pageCount}
          onPageChange={handlePageClick}
          forcePage={forcePage}
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          activeClassName="active"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          disabledClassName="disabled"
          previousLabel={<Icon as={FaAngleLeft} />}
          nextLabel={<Icon as={FaAngleRight} />}
          breakLabel={<Text>...</Text>}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          renderOnZeroPageCount={null}
          firstLabel={<Icon as={FaAngleDoubleLeft} />}
          lastLabel={<Icon as={FaAngleDoubleRight} />}
        />
      </Flex>
    </div>
  );
}

export default ManageProducts;
