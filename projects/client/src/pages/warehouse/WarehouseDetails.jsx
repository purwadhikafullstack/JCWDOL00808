import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  Button,
  ButtonGroup,
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
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  HStack,
} from "@chakra-ui/react";
import { BiArrowBack } from "react-icons/bi";
import { useState, useEffect } from "react";
import { API_url } from "../../helper";
import Axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import React from "react";

const WarehouseDetails = () => {
  const [warehouseId, setWarehouseId] = useState();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [cityData, setCityData] = React.useState([]);
  const [provinceData, setProvinceData] = React.useState([]);
  const [district, setDistrict] = React.useState("");

  const [detailsName, setDetailsName] = useState("");
  const [detailsAddress, setDetailsAddress] = useState("");
  const [detailsCity, setDetailsCity] = useState("");
  const [detailsProvince, setDetailsProvince] = useState("");
  const [detailsDistrict, setDetailsDistrict] = useState("");

  const toast = useToast();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const cancelRef = React.useRef();

  const navigate = useNavigate();

  // const { id } = useParams();
  const { search } = useLocation();
  const id = search.split("=")[1];

  const getSpecificWarehouse = () => {
    Axios.get(API_url + `/warehouses/getWarehouseDetails?id=${id}`)
      .then((response) => {
        console.log("response:", response.data);
        setName(response.data[0].name);
        setAddress(response.data[0].address);
        setCity(response.data[0].city);
        setProvince(response.data[0].province);
        setDistrict(response.data[0].district);

        setDetailsName(response.data[0].name);
        setDetailsAddress(response.data[0].address);
        setDetailsCity(response.data[0].city);
        setDetailsProvince(response.data[0].province);
        setDetailsDistrict(response.data[0].district);
      })
      .catch((error) => console.log(error));
  };

  const getProvinceData = () => {
    Axios.get(API_url + `/warehouses/getProvinceData`)
      .then((response) => {
        // console.log(response.data);
        setProvinceData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onGetCity = (province_id) => {
    // console.log("province_id:", province_id)
    Axios.get(API_url + `/warehouses/getCityData?province_id=${province_id}`)
      .then((response) => {
        // console.log("dari onGetCity: ", response.data);
        setCityData(response.data);

        // setProvince("");
        // setCity("");
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
          onCloseComplete: () => getSpecificWarehouse(),
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getSpecificWarehouse();
    getProvinceData();
  }, []);

  const deleteButton = () => {
    Axios.delete(API_url + `/warehouses/deleteWarehouseData?id=${id}`)
      .then((response) => {
        toast({
          title: `${response.data.message}`,
          status: "success",
          duration: 9000,
          isClosable: true,
          onCloseComplete: () => navigate("/warehouse/list"),
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box w="50%">
      <Card maxW="lg" border="1px" borderColor="gray.300">
        <CardBody>
          <Image src="https://www.paper.id/blog/wp-content/uploads/2022/11/istockphoto-1138429558-612x612-1.jpg" alt="Green double couch with wooden legs" borderRadius="lg" />
          <Stack mt="6" spacing="3">
            <Heading size="md">Warehouse name: {name}</Heading>
            <Text size="sm">Address: {address}</Text>
            <Text color="blue.600" size="sm">
              {city}, {province}
            </Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup spacing="6">
            <Button variant="solid" onClick={() => navigate("/warehouse/list", { replace: true })}>
              <BiArrowBack />
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                // setWarehouseId(value.id);
                onEditOpen();
              }}
            >
              Edit warehouse data
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                onAlertOpen();
              }}
            >
              Delete warehouse data
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
            <Modal isOpen={isEditOpen} onClose={onEditClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit warehouse data</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <div className="mt-4 text-muted fw-bold text-start">
                    <Text fontSize="md">Name</Text>
                    <Input placeholder={detailsName} size="md" onChange={(element) => setName(element.target.value)} />
                    <div className="mt-4 text-muted fw-bold text-start">
                      <Text fontSize="md">Address</Text>
                      <InputGroup size="md">
                        <Input pr="4.5rem" placeholder={detailsAddress} onChange={(element) => setAddress(element.target.value)} />
                      </InputGroup>
                    </div>
                    <div className="mt-4 text-muted fw-bold text-start">
                      <Text fontSize="md">Province</Text>
                      <Select
                        placeholder={detailsProvince}
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
                      <Select className="text-muted" placeholder={detailsCity} value={city} onChange={(element) => setCity(element.target.value)}>
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
                      <Input placeholder={detailsDistrict} onChange={(element) => setDistrict(element.target.value)}></Input>
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
          </ButtonGroup>
        </CardFooter>
      </Card>
    </Box>
  );
};

export default WarehouseDetails;
