import {
  Avatar,
  Image,
  Container,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  ButtonGroup,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Radio,
  RadioGroup,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Card, CardHeader, CardBody, CardFooter, Heading, Stack, StackDivider, Box, Text } from "@chakra-ui/react";
import Axios from "axios";
import { API_url } from "../../helper";
import { useEffect, useState, useRef } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

const WarehouseList = (props) => {
  const toast = useToast();
  const cancelRef = React.useRef();
  const navigate = useNavigate();

  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  const [warehouseData, setWarehouseData] = useState([]);
  const [warehouseId, setWarehouseId] = useState();

  // buat ngirimin nilai page ke backend
  const [page, setPage] = useState(0);

  // buat nerima dari backend
  const [totalPage, setTotalPage] = useState(0);

  const getWarehouseData = () => {
    Axios.get(API_url + `/warehouses/getWarehouseData?page=${page}`)
      .then((response) => {
        console.log(response.data);
        setTotalPage(response.data.totalPage);
        setWarehouseData(response.data.rows);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getWarehouseData();
  }, [page]);

  const deleteButton = (value) => {
    Axios.delete(API_url + `/warehouses/deleteWarehouseData?id=${value}`)
      .then((response) => {
        toast({
          title: `${response.data.message}`,
          status: "success",
          duration: 9000,
          isClosable: true,
          onCloseComplete: () => window.location.reload(false),
        });
      })
      .catch((err) => console.log(err));
  };

  // const WarehouseRow = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  // }

  const handleDetailsClick = () => {
    setIsDetailsOpen(true);
    // onModalOpen()
    // showDetails()
    // alert("warehouseId: ", warehouseId)
  };
  const handleDetailsClose = () => {
    setIsDetailsOpen(false);
  };

  const showDetails = (warehouseId) => {
    alert("siap show details: ", warehouseId);
    // return (
    //   <>
    //     {/* <Button onClick={onOpen}>Open Modal</Button> */}

    //     <Modal isOpen={isModalOpen} onClose={onModalClose}>
    //       <ModalOverlay />
    //       <ModalContent>
    //         <ModalHeader>{element.name}</ModalHeader>
    //         <ModalCloseButton />
    //         <ModalBody>
    //           <Text>{element.address} {element.province} {element.city}</Text>
    //         </ModalBody>

    //         <ModalFooter>
    //           <Button colorScheme="blue" mr={3} onClick={onModalClose}>
    //             Close
    //           </Button>
    //           <Button variant="ghost">Stock History</Button>
    //         </ModalFooter>
    //       </ModalContent>
    //     </Modal>
    //   </>
    // );
    // navigate(`/warehouse/details/${value.id}`, { replace: true });
  };

  const showWarehouseData = () => {
    let count = 0;
    return warehouseData.map((value) => {
      count++;
      return (
        <Tr key={value.id}>
          <Td>{count}</Td>
          <Td>{value.name}</Td>
          <Td>{value.address}</Td>
          <Td>{value.province}</Td>
          <Td>{value.city}</Td>
          <Td isNumeric>
            <Button
              colorScheme="teal"
              className="mr-2"
              onClick={() => navigate(`/warehouse/details/${value.id}`)}
              // onClick={showDetails}
              // onClick={() => {
              //   handleDetailsClick();
                // setWarehouseId(value.id);
                // showDetails();
              // }}
            >
              Details
            </Button>
            <Button colorScheme="blue" className="mr-2" onClick={() => navigate(`/warehouse/edit?id=${value.id}`)}>
              Edit
            </Button>
            <>
              <Button colorScheme="red" onClick={onAlertOpen}>
                Delete
              </Button>

              <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={onAlertClose}>
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Delete Warehouse
                    </AlertDialogHeader>

                    <AlertDialogBody>Are you sure you want to delete this data? This can't be undone.</AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onAlertClose}>
                        Cancel
                      </Button>
                      <Button colorScheme="red" onClick={() => deleteButton(value.id)} ml={3}>
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </>
          </Td>
        </Tr>
      );
    });
  };

  const searchData = () => {};

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  return (
    <>
      <Container className="my-5">
        <FormControl onSubmit={searchData}>
          <FormLabel>Search</FormLabel>
          <Input placeholder="type warehouse name, city, or province..." className="mb-5" />
        </FormControl>
        <FormControl as="fieldset">
          <FormLabel as="legend">Sort data by:</FormLabel>
          <RadioGroup defaultValue="Itachi">
            <HStack spacing="24px">
              <Radio value="Sasuke">Name</Radio>
              <Radio value="Nagato">Province</Radio>
              <Radio value="Itachi">City</Radio>
              <Radio value="Sage of the six Paths">Date added</Radio>
              <Menu>
                {({ isOpen }) => (
                  <>
                    <MenuButton isActive={isOpen} as={Button} rightIcon={<ChevronDownIcon />}>
                      {isOpen ? "A/Z" : "A/Z"}
                    </MenuButton>
                    <MenuList>
                      <MenuItem>Ascending (A-Z)</MenuItem>
                      <MenuItem onClick={() => alert("Kagebunshin")}>Descending (Z-A)</MenuItem>
                    </MenuList>
                  </>
                )}
              </Menu>
            </HStack>
          </RadioGroup>
        </FormControl>
      </Container>
      <TableContainer className="mt-5">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>No.</Th>
              <Th>Warehouse Name</Th>
              <Th>Address</Th>
              <Th>Province</Th>
              <Th>City</Th>
              <Th isNumeric className="mr-5">
                Action
              </Th>
            </Tr>
          </Thead>
          <Tbody>{showWarehouseData()}</Tbody>
        </Table>
      </TableContainer>
      <div className="mt-5">
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          pageCount={totalPage}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName={"pagination justify-content-center"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>
      <Button colorScheme="orange" className="mt-5" onClick={() => navigate(`/warehouse/add`)}>
        Add new warehouse
      </Button>
    </>
  );
};

export default WarehouseList;