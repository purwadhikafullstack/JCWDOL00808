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
  InputGroup,
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
  Select,
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

  const [detailsName, setDetailsName] = useState("");
  const [detailsAddress, setDetailsAddress] = useState("");
  const [detailsCity, setDetailsCity] = useState("");
  const [detailsProvince, setDetailsProvince] = useState("");

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
    Axios.get(API_url + `/warehouses/getWarehouseDetails/${warehouseId}`)
      .then((response) => {
        console.log("response:", response.data.name);
        setDetailsName(response.data.name);
        setDetailsAddress(response.data.address);
        setDetailsCity(response.data.city);
        setDetailsProvince(response.data.province);
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
                  onDetailsOpen();
                  getSpecificWarehouse();
                }
              }
            >
              Details
            </Button>
            <Modal isOpen={isDetailsOpen} onClose={onDetailsClose}>
              <ModalOverlay />
              <ModalContent>
                <Image src="https://www.paper.id/blog/wp-content/uploads/2022/11/istockphoto-1138429558-612x612-1.jpg" alt="Green double couch with wooden legs" borderRadius="lg" />
                <ModalHeader>Warehouse name: {detailsName}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text size="sm">Warehouse address: {detailsAddress}</Text>

                  <Text color="blue.600" size="sm">
                    {detailsCity}, {detailsProvince}
                  </Text>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" onClick={onDetailsClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Button
              colorScheme="blue"
              className="mr-2"
              onClick={() => {
                onEditOpen();
                setWarehouseId(value.id);
              }}
            >
              Edit
            </Button>
            <Modal isOpen={isEditOpen} onClose={onEditClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit warehouse data</ModalHeader>
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
                  <Button mr={3} onClick={onEditClose}>
                    Close
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      onEditClose();
                      buttonEditWarehouse();
                    }}
                  >
                    Edit warehouse data
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <>
              <Button
                colorScheme="red"
                onClick={() => {
                  setWarehouseId(value.id);
                  onAlertOpen();
                }}
              >
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
                      <Button colorScheme="red" onClick={deleteButton} ml={3}>
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

  const buttonEditWarehouse = () => {
    Axios.patch(API_url + `/warehouses/updateWarehouseData`, {
      id: warehouseId,
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
          onCloseComplete: () => getWarehouseData(),
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Container className="my-5" maxW={600}>
        <FormControl>
          <FormLabel>Search</FormLabel>
          <Input placeholder="type warehouse name, city, or province..." className="mb-5" onChange={(element) => setSearch(element.target.value)} />
          <Button onClick={handleSearchButton}>Search</Button>
        </FormControl>
        <FormControl>
          <FormLabel>Sort data by:</FormLabel>
          <RadioGroup>
            <HStack spacing="24px">
              <Radio value="name" onChange={(element) => setSort(element.target.value)}>
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
              </Radio>
              <Select placeholder="Order" onChange={(element) => setOrder(element.target.value)}>
                <option value="ASC">Ascending</option>
                <option value="DESC">Descending</option>
              </Select>
            </HStack>
          </RadioGroup>
        </FormControl>
      </Container>
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
      <Button colorScheme="orange" className="my-5" onClick={onAddOpen}>
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
    </>
  );
};

export default WarehouseList;
