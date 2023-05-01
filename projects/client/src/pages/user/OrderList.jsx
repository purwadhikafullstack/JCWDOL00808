import {
  Input,
  Button,
  Badge,
  Card,
  CardBody,
  Text,
  Flex,
  Box,
  VStack,
  Select,
  FormControl,
  FormLabel,
  Image,
  HStack,
  Spacer,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { BsBasketFill } from "react-icons/bs";
import { API_url } from "../../helper";
import Axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const OrderList = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("DESC");
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState("1");

  let token = localStorage.getItem("token");
  const getTransactionList = async () => {
    await Axios.get(API_url + `/orders/getOrderList`, {
      headers: { Authorization: token },
    })
      .then((response) => {
        console.log(response.data);
        setList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getTransactionList();
  }, []);

  const handleCancelButton = (value) => {
    Axios.post(
      API_url + `/orders/cancelOrder`,
      {
        id: value,
      },
      {
        headers: { Authorization: token },
      }
    )
      .then((response) => {
        console.log(response.data);
        toast({
          title: `${response.data.message}`,
          duration: 9000,
          isClosable: true,
          onCloseComplete: () => window.location.reload(false),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showOrderList = () => {
    return list?.map((value) => {
      return (
        <Card mb={6} size="lg" maxW="600px" mx="auto" border="1px" borderColor="gray.300">
          <CardBody>
            <Box>
              <Flex>
                <BsBasketFill />
                <Text>{value.when}</Text>
                {value.status == "Shipped" ? (
                  <Badge variant="subtle" colorScheme="green">
                    {value.status}
                  </Badge>
                ) : value.status == "Canceled" ? (
                  <Badge variant="subtle" colorScheme="red">
                    {value.status}
                  </Badge>
                ) : (
                  <Badge variant="subtle" colorScheme="blue">
                    {value.status}
                  </Badge>
                )}
              </Flex>
            </Box>
            <Box boxSize="70px">
              <Flex>
                <Image src="https://images.tokopedia.net/img/cache/500-square/hDjmkQ/2022/2/24/a9f6f800-b2ba-4ad7-a4e4-590c599309bc.jpg" size="sm" />
                {/* <Image src={value.order_details[0].imageUrl} size="sm" /> */}
                {/* {value.order_details.length > 1 ? (
                  <Text>
                    {value.order_details[0].product_name} dan {value.order_details.length - 1} lainnya
                  </Text>
                ) : (
                  <Text>{value.order_details[0].product_name}</Text>
                )} */}
                <Text>Total belanja: Rp{value.total_price}</Text>
              </Flex>
            </Box>
            {value.status == "Waiting for payment" ? (
              <>
                <Button onClick={() => navigate(`/user/upload-payment-proof?id=${value.id}`)}>Upload payment proof</Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    onOpen();
                  }}
                >
                  Cancel order
                </Button>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Request order cancellation?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>This action can't be undone. Please add your reason for cancellation:</ModalBody>
                    <Select placeholder="Select reason">
                      <option>I bought the wrong item</option>
                      <option>I don't need it anymore</option>
                      <option>I want to change my address</option>
                    </Select>
                    <ModalFooter>
                      <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Close
                      </Button>
                      <Button variant="ghost" onClick={() => handleCancelButton(value.id)}>
                        Cancel my order
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
            ) : null}
          </CardBody>
        </Card>
      );
    });
  };

  const handleSearchButton = () => {
    setKeyword(search);
  };

  return (
    <>
      <Box w="100%">
        <Box id="sort and filter" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Card maxW="md" border="1px" borderColor="gray.300">
            <CardBody>
              <VStack>
                <FormControl>
                  <FormLabel>Search</FormLabel>
                  <Input placeholder="Search your transaction here" onChange={(element) => setSearch(element.target.value)} />
                  <Button colorScheme="blue" mt="25" mr="4" onClick={() => setSearch("")}>
                    Reset filter
                  </Button>
                  <Button colorScheme="blue" mt="25" onClick={handleSearchButton}>
                    Search
                  </Button>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
          <Card maxW="md" border="1px" borderColor="gray.300">
            <CardBody>
              <VStack>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <RadioGroup onChange={setValue} value={value}>
                    <Stack direction="row">
                      <Radio value="1">All</Radio>
                      <Radio value="2">Ongoing</Radio>
                      <Radio value="3">Success</Radio>
                      <Radio value="4">Cancelled</Radio>
                      <Radio value="5">Done</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
          <Card maxW="md" border="1px" borderColor="gray.300">
            <CardBody>
              <VStack>
                <FormControl>
                  <FormLabel>Sort transaction by:</FormLabel>
                  <Select placeholder="Newest/Oldest" onChange={(element) => setSort(element.target.value)}>
                    <option value="ASC">Newest</option>
                    <option value="DESC">Oldest</option>
                  </Select>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
        </Box>
        <Box w="100%" my="100">
          <Text fontSize="xl">My Transaction</Text>
          {showOrderList()}
        </Box>
      </Box>
    </>
  );
};

export default OrderList;
