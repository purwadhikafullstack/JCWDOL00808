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
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  Radio,
  RadioGroup,
  HStack,
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

const WarehouseList = (props) => {
  const toast = useToast();
  const cancelRef = React.useRef();
  const navigate = useNavigate();

  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
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

  const deleteButton = () => {
    Axios.delete(API_url + `/warehouses/deleteWarehouseData?id=${warehouseId}`)
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

  const getSpecificWarehouse = () => {
    Axios.get(API_url + `/warehouses/getWarehouseDetails?id=${warehouseId}`)
      .then((response) => {
        console.log("response:", response.data.name);
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
            <Button colorScheme="yellow" className="mr-2" onClick={() => navigate(`/warehouse/stock/${value.id}`)}>
              Stock
            </Button>
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
        console.log(response.data);
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
    // console.log("province_id:", province_id)
    Axios.get(API_url + `/warehouses/getCityData?province_id=${province_id}`)
      .then((response) => {
        console.log("dari onGetCity: ", response.data);
        setCityData(response.data);

        // setProvince("");
        // setCity("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const buttonAddWarehouse = () => {
    // alert(province + city)
    Axios.post(API_url + `/warehouses/addWarehouse`, {
      name,
      address,
      province,
      city,
      district,
    })
      .then((response) => {
        console.log(response.data);
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

  // const buttonEditWarehouse = () => {
  //   Axios.patch(API_url + `/warehouses/updateWarehouseData`, {
  //     id: warehouseId,
  //     name,
  //     address,
  //     province,
  //     city,
  //     district,
  //   })
  //     .then((response) => {
  //       console.log(response.data);
  //       toast({
  //         title: `${response.data.message}`,
  //         status: "success",
  //         duration: 9000,
  //         onCloseComplete: () => getWarehouseData(),
  //       });
  //     })
  //     .catch((err) => console.log(err));
  // };

  return (
    <>
      <Flex direction="column" alignItems="center">
        <Box className="my-5">
          <Flex>
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
                  {/* <RadioGroup> */}
                  {/* <HStack spacing="24px"> */}
                  {/* <Radio value="name" onChange={(element) => setSort(element.target.value)}>
                        Name
                      </Radio>
                      <Radio value="province" onChange={(element) => setSort(element.target.value)}>
                        Province
                      </Radio>
                      <Radio value="city" onChange={(element) => setSort(element.target.value)}>
                        City
                      </Radio>
                      <Radio value="updatedAt" onChange={(element) => setSort(element.target.value)}>
                        Date added
                      </Radio> */}
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
        <div className="mt-5 flex items-center justify-center">
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
            <ModalBody>
              <div className="mt-4 text-muted fw-bold text-start">
                <Text fontSize="md">Name</Text>
                <Input placeholder="Warehouse name" size="md" onChange={(element) => setName(element.target.value)} />
                <div className="mt-4 text-muted fw-bold text-start">
                  <Text fontSize="md">Address</Text>
                  <InputGroup size="md">
                    <Input pr="4.5rem" placeholder="warehouse address" onChange={(element) => setAddress(element.target.value)} />
                  </InputGroup>
                </div>
                <div className="mt-4 text-muted fw-bold text-start">
                  <Text fontSize="md">Province</Text>
                  <Select
                    placeholder="Select province"
                    onChange={(element) => {
                      setProvince(element.target.value.split(",")[1]);
                      onGetCity(element.target.value.split(",")[0]);
                    }}
                  >
                    {provinceData.map((value) => {
                      return (
                        <option value={value.province_id + "," + value.province} key={value.province_id}>
                          {value.province}
                        </option>
                      );
                    })}
                  </Select>
                </div>
              </div>
              <div>
                <div className="mt-4 text-muted fw-bold text-start">
                  <Text fontSize="md">City</Text>
                  <Select placeholder="Select city" value={city} onChange={(element) => setCity(element.target.value)}>
                    {cityData.map((value) => {
                      return (
                        <option value={`${value.type} ${value.city_name}`} key={value.city_id}>
                          {value.type} {value.city_name}
                        </option>
                      );
                    })}
                  </Select>
                </div>
                <div className="mt-4 text-muted fw-bold text-start">
                  <Text fontSize="md">District (Kecamatan)</Text>
                  <Input placeholder="Input district" onChange={(element) => setDistrict(element.target.value)}></Input>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onAddClose}>
                Close
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  onAddClose();
                  buttonAddWarehouse();
                }}
              >
                Add warehouse data
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
};

export default WarehouseList;
