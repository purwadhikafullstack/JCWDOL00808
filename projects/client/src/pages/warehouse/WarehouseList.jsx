import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  ButtonGroup,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  useDisclosure,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  VStack,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Card, CardHeader, CardBody, CardFooter, Heading, Stack, StackDivider, Box, Text } from "@chakra-ui/react";
import Axios from "axios";
import { API_url } from "../../helper";
import { useEffect, useState, useRef } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useFormik } from "formik";
import * as yup from "yup";

const WarehouseList = (props) => {
  const toast = useToast();
  const cancelRef = React.useRef();
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("role"));

  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const [warehouseData, setWarehouseData] = useState([]);
  const [warehouseId, setWarehouseId] = useState();

  const [sort, setSort] = useState("id");
  const [order, setOrder] = useState("ASC");
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");

  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [provinceData, setProvinceData] = React.useState([]);
  const [province, setProvince] = React.useState("");
  const [cityData, setCityData] = React.useState([]);
  const [city, setCity] = React.useState("");
  const [districtData, setDistrictData] = React.useState([]);
  const [district, setDistrict] = React.useState("");

  const getWarehouseData = () => {
    Axios.get(API_url + `/warehouses/getWarehouseData?page=${page}&sort=${sort}&order=${order}&keyword=${keyword}`)
      .then((response) => {
        console.log(response.data);
        setTotalPage(response.data.totalPage);
        setWarehouseData(response.data.rows);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getWarehouseData();
  }, [page, sort, order, keyword]);

  // const deleteButton = () => {
  //   Axios.delete(API_url + `/warehouses/deleteWarehouseData?id=${warehouseId}`)
  //     .then((response) => {
  //       toast({
  //         title: `${response.data.message}`,
  //         status: "success",
  //         duration: 9000,
  //         isClosable: true,
  //         onCloseComplete: () => window.location.reload(false),
  //       });
  //     })
  //     .catch((err) => console.log(err));
  // };

  const getSpecificWarehouse = () => {
    Axios.get(API_url + `/warehouses/getWarehouseDetails?id=${warehouseId}`)
      .then((response) => {
        setName(response.data.name);
        setAddress(response.data.address);
        setCity(response.data.city);
        setProvince(response.data.province);
        // setDetailsDistrict(response.data.district)
      })
      .catch((error) => console.log(error));
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
            {role === "1" && (
              <Button colorScheme="yellow" className="mr-2" onClick={() => navigate(`/warehouse/stock/${value.id}`)}>
                Stock
              </Button>
            )}
            <Button
              colorScheme="teal"
              className="mr-2"
              onClick={() => {
                setWarehouseId(value.id);
                navigate(`/warehouse/details?id=${value.id}`);
              }}
            >
              Details
            </Button>
            {/* <>
              {role === "1" && (
                <Button colorScheme="red" onClick={onAlertOpen}>
                  Delete
                </Button>
              )}
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
            </> */}
          </Td>
        </Tr>
      );
    });
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  const handleSearchButton = () => {
    setPage(0);
    setKeyword(search);
  };

  const getProvinceData = () => {
    Axios.get(API_url + `/warehouses/getProvinceData`)
      .then((response) => {
        setProvinceData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProvinceData();
  }, []);

  const onGetCity = (province_id) => {
    Axios.get(API_url + `/warehouses/getCityData?province_id=${province_id}`)
      .then((response) => {
        setCityData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const buttonAddWarehouse = (values) => {
    Axios.post(API_url + `/warehouses/addWarehouse`, values)
      .then((response) => {
        toast({
          title: `${response.data.message}`,
          status: "success",
          duration: 9000,
          isClosable: true,
          onCloseComplete: () => getWarehouseData(),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      province: "",
      city: "",
      district: "",
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Required"),
      address: yup.string().required("Required"),
      province: yup.string().required("Required"),
      city: yup.string().required("Required"),
      district: yup.string().required("Required"),
    }),
    onSubmit: (values, actions) => {
      buttonAddWarehouse(values);
      onAddClose();
    },
  });

  return (
    <>
      <Flex direction="column" alignItems="center" px="0">
        <Box className="my-5" mx="100">
          <Flex id="sort, search, and filter">
            <Card maxW="lg">
              <CardBody>
                <FormControl>
                  <FormLabel>Search</FormLabel>
                  <Input placeholder="warehouse name, city, or province..." className="mb-5" onChange={(element) => setSearch(element.target.value)} />
                  <Button onClick={handleSearchButton}>Search</Button>
                </FormControl>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <FormControl>
                  <FormLabel>Sort data by:</FormLabel>
                  <VStack>
                    <Select placeholder="Select option" onChange={(element) => setSort(element.target.value)}>
                      <option value="name">Warehouse name</option>
                      <option value="province">Province</option>
                      <option value="city">City</option>
                      <option value="updatedAt">Date added</option>
                    </Select>
                    <Select placeholder="Order" onChange={(element) => setOrder(element.target.value)}>
                      <option value="ASC">Ascending</option>
                      <option value="DESC">Descending</option>
                    </Select>
                  </VStack>
                  {/* </HStack> */}
                  {/* </RadioGroup> */}
                </FormControl>
              </CardBody>
            </Card>
          </Flex>
        </Box>
        <Card>
          <CardBody>
            <TableContainer className="my-5">
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
          </CardBody>
        </Card>
        <div id="pagination" className="mt-5 flex items-center justify-center">
          <ReactPaginate
            previousLabel={"< Previous"}
            nextLabel={"Next >"}
            breakLabel={"..."}
            pageCount={totalPage}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={"flex"}
            pageClassName={"page-item"}
            pageLinkClassName={"mx-2 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"}
            previousLinkClassName={"mx-2 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"}
            nextLinkClassName={"mx-2 bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"}
          />
        </div>
        <Button size="md" colorScheme="orange" className="my-5" onClick={onAddOpen}>
          Add new warehouse
        </Button>
        <Modal isOpen={isAddOpen} onClose={onAddClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add new warehouse</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={formik.handleSubmit}>
              <ModalBody>
                <FormControl isInvalid={formik.errors.name && formik.touched.name}>
                  <FormLabel>Name:</FormLabel>
                  <Input id="name" placeholder="Warehouse name" value={formik.values.name} onChange={formik.handleChange} />
                  <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={formik.errors.address && formik.touched.address}>
                  <FormLabel>Address:</FormLabel>
                  <InputGroup>
                    <Input id="address" placeholder="Address" value={formik.values.address} onChange={formik.handleChange} />
                  </InputGroup>
                  <FormErrorMessage>{formik.errors.address}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={formik.errors.province && formik.touched.province}>
                  <FormLabel>Province:</FormLabel>
                  <Select
                    id="province"
                    placeholder="Select province"
                    onChange={(e) => {
                      console.log(e.target.value);
                      formik.setFieldValue("province", e.target.value.split(",")[1]);
                      onGetCity(e.target.value.split(",")[0]);
                    }}
                  >
                    {provinceData.map((value) => {
                      return (
                        <option id="province" value={value.province_id + "," + value.province} key={value.province_id}>
                          {value.province}
                        </option>
                      );
                    })}
                  </Select>
                  <FormErrorMessage>{formik.errors.province}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={formik.errors.city && formik.touched.city}>
                  <FormLabel>City:</FormLabel>
                  <Select id="city" placeholder="Select city" onChange={formik.handleChange}>
                    {cityData.map((value) => {
                      return (
                        <option id="city" value={`${value.type} ${value.city_name}`} key={value.city_id}>
                          {value.type} {value.city_name}
                        </option>
                      );
                    })}
                  </Select>
                  <FormErrorMessage>{formik.errors.city}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={formik.errors.district && formik.touched.district}>
                  <FormLabel>District (Kecamatan):</FormLabel>
                  <InputGroup>
                    <Input id="district" placeholder="District" value={formik.values.district} onChange={formik.handleChange} />
                  </InputGroup>
                  <FormErrorMessage>{formik.errors.district}</FormErrorMessage>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onAddClose}>
                  Close
                </Button>
                <Button variant="ghost" type="submit">
                  Add warehouse data
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
};

export default WarehouseList;
