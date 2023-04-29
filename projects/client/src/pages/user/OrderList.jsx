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

  let token = localStorage.getItem("token");
  const token = localStorage.getItem("token");
  const getTransactionList = () => {
    Axios.get(API_url + `/orders/getOrderList`, {
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
    Axios.post(API_url + `/orders/cancelOrder`, {
      id: value,
    })
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
    return list.map((value) => {
      return (
        <Card mb={6} size="lg">
          <CardBody>
            <VStack>
              <Box>
                <Flex>
                  <BsBasketFill />
                  <Text>{value.createdAt}</Text>
                  <Text>{value.status}</Text>
                </Flex>
              </Box>
              <Box boxSize="70px">
                <Flex>
                  <Image src="https://images.tokopedia.net/img/cache/500-square/hDjmkQ/2022/2/24/a9f6f800-b2ba-4ad7-a4e4-590c599309bc.jpg" size="sm" />
                  <Text>Rp{value.total_price}</Text>
                </Flex>
              </Box>
              {value.status == "Waiting for payment" ? (
                <>
                  <Button onClick={() => navigate("/user/upload-payment-proof")}>Proceed to payment</Button>
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      handleCancelButton(value.id);
                    }}
                  >
                    Cancel order
                  </Button>
                </>
              ) : null}
            </VStack>
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
