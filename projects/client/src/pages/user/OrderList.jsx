import {
  Input,
  Button,
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
  Stack,
} from "@chakra-ui/react";
import { BsBasketFill } from "react-icons/bs";
import { API_url } from "../../helper";
import Axios from "axios";
import { useEffect, useState } from "react";

const OrderList = () => {
  const [list, setList] = useState([]);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("DESC");
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  let token = localStorage.getItem("token");
  const getTransactionList = () => {
    Axios.get(API_url + `/orders/getOrderList?sort=${sort}&keyword=${keyword}`, {
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
  }, [sort, keyword]);

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
          status: "success",
          duration: 9000,
          onCloseComplete: () => getTransactionList(),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showOrderList = () => {
    return list.map((value) => {
      if (value.status == "Waiting for payment") {
        return (
          <Card mb={6} size="lg">
            <CardBody>
              <VStack>
                <Box>
                  <Flex>
                    <BsBasketFill />
                    <Text>{value?.order_details[0].product_name}</Text>
                    <Text>dan {value?.order_details.length - 1} barang lainnya</Text>
                    <Text>Transaction date: {value?.date}</Text>
                    <Text>Status: {value?.status}</Text>
                  </Flex>
                </Box>
                <Box boxSize="70px">
                  <Flex>
                    <Image src={value?.order_details[0]?.imageUrl} size="lg" />
                    <Spacer />
                    <Text>Rp{value?.total_price}</Text>
                    <Button colorScheme="red" onClick={onOpen}>
                      Cancel my order
                    </Button>

                    <Modal isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Cancel my order</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <Text>Cancelling an order can't be undone, and it means you have to repeat all this transaction process if you still need the products. Reason for cancelling the order:</Text>
                          <Stack>
                            <Radio value="1">I want to change my address</Radio>
                            <Radio value="2">I ordered the wrong products</Radio>
                            <Radio value="3">I want to change the courier</Radio>
                            <Radio value="4">I find better products</Radio>
                            <Radio value="5">Something else</Radio>
                          </Stack>
                        </ModalBody>

                        <ModalFooter>
                          <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                          </Button>
                          <Button variant="ghost">Cancel my order</Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </Flex>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        );
      } else {
        return (
          <Card mb={6} size="lg">
            <CardBody>
              <VStack>
                <Box>
                  <Flex>
                    <BsBasketFill />
                    <Text>{value?.order_details[0].product_name}</Text>
                    <Text>dan {value?.order_details.length - 1} barang lainnya</Text>
                    <Text>Transaction date: {value?.date}</Text>
                    <Text>Status: {value?.status}</Text>
                  </Flex>
                </Box>
                <Box boxSize="70px">
                  <Flex>
                    <Image src="https://images.tokopedia.net/img/cache/500-square/hDjmkQ/2022/2/24/a9f6f800-b2ba-4ad7-a4e4-590c599309bc.jpg" size="sm" />
                    <Spacer />
                    <Text>Rp{value?.total_price}</Text>
                  </Flex>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        );
      }
    });
  };

  const handleSearchButton = () => {
    setKeyword(search);
  };

  return (
    <>
      <Box bg="gray.100" w="100%">
        <Flex>
          <HStack>
            <Box w="100%" ml="100">
              <Card maxW="xs" border="1px" borderColor="gray.200">
                <CardBody>
                  <VStack>
                    <FormControl>
                      <FormLabel>Search your transaction here:</FormLabel>
                      <Input placeholder="search" onChange={(element) => setSearch(element.target.value)} />
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
              <Card maxW="xs" border="1px" borderColor="gray.200">
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
          </HStack>
        </Flex>
      </Box>
    </>
  );
};

export default OrderList;
