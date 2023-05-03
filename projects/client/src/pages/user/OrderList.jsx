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
import ReactPaginate from "react-paginate";

const OrderList = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  const [order, setOrder] = useState("DESC");
  const [dataDetails, setDataDetails] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen: isCancelOpen, onOpen: onCancelOpen, onClose: onCancelClose } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const [value, setValue] = useState("1");

  let token = localStorage.getItem("token");
  const getTransactionList = async () => {
    await Axios.get(API_url + `/orders/getOrderList?page=${page}&order=${order}&status=${status}`, {
      headers: { Authorization: token },
    })
      .then((response) => {
        console.log(response.data);
        setTotalPage(response.data.totalPage);
        setList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getTransactionList();
  }, [page, order, status]);

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

  const getDetails = (value) => {
    Axios.get(API_url + `/orders/getDetails?orders_id=${value}`)
      .then((response) => {
        console.log(response.data);
        setDataDetails(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showOrderList = () => {
    return list.map((value) => {
      return (
        <Card key={value.id} mb={6} size="lg" maxW="600px" mx="auto" border="1px" borderColor="gray.300">
          <CardBody>
            <Flex>
              <Image src={`${process.env.REACT_APP_API_BASE_URL}/${value.order_details[0].imageUrl}`} boxSize="132px" />
              <Flex flexDirection="column" alignItems="flex-start">
                <Text fontSize="md" ml={8}>
                  Transaction date: {value.when}
                </Text>
                {value.status == "Confirmed" ? (
                  <Badge variant="subtle" colorScheme="green" ml={8}>
                    done
                  </Badge>
                ) : value.status == "Canceled" ? (
                  <Badge variant="subtle" colorScheme="red" ml={8}>
                    {value.status}
                  </Badge>
                ) : (
                  <Badge variant="subtle" colorScheme="blue" ml={8}>
                    {value.status}
                  </Badge>
                )}
                {value.order_details.length > 1 && value.order_details.length - 1 != 1 ? (
                  <Box ml={8} mt={4}>
                    {value.order_details[0].product_name} and {value.order_details.length - 1} other
                  </Box>
                ) : (
                  <Box ml={8} mt={4}>
                    {value.order_details[0].product_name}
                  </Box>
                )}
                <Box ml={8} mt={4}>
                  Total payment: Rp{value.total_price}
                </Box>
              </Flex>
            </Flex>
            {value.status == "Waiting for payment" ? (
              <>
                <Button
                  colorScheme="gray"
                  variant="subtle"
                  onClick={() => {
                    onCancelOpen();
                  }}
                >
                  Cancel order
                </Button>
                {/* <Button colorScheme="green" variant="outline" onClick={() => navigate(`/user/upload-payment-proof?id=${value.id}`)}>
                  Upload payment proof
                </Button> */}
                <Button variant="buttonBlack" type="submit" isLoading={isLoading} onClick={() => navigate(`/user/upload-payment-proof?id=${value.id}`)}>
                  Upload payment proof
                </Button>
                <Modal isOpen={isCancelOpen} onClose={onCancelClose}>
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
                      <Button colorScheme="blue" mr={3} onClick={onCancelClose}>
                        Close
                      </Button>
                      <Button variant="ghost" onClick={() => handleCancelButton(value.id)}>
                        Cancel my order
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    getDetails(value.id);
                    onDetailsOpen();
                  }}
                >
                  Transaction details
                </Button>
                <Modal isOpen={isDetailsOpen} onClose={onDetailsClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Transaction Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Text as="b">Status:</Text>
                      {value.status == "Confirmed" ? (
                        <Text variant="subtle" colorScheme="green">
                          done
                        </Text>
                      ) : value.status == "Canceled" ? (
                        <Text variant="subtle" colorScheme="red">
                          {value.status}
                        </Text>
                      ) : (
                        <Text variant="subtle" colorScheme="blue">
                          {value.status}
                        </Text>
                      )}
                      <Text as="b">Transaction Date:</Text>
                      <Text>{value.when}</Text>
                      <Text as="b">Product Details:</Text>
                      {dataDetails.map((detail) => {
                        return (
                          <Box key={detail.id}>
                            <Image src={`${process.env.REACT_APP_API_BASE_URL}/${detail.imageUrl}`} boxSize="132px" />
                            <Text>{detail.product_name}</Text>
                            <Text>
                              {detail.quantity} x Rp {detail.product_price}
                            </Text>
                            <Text>{detail.product_weight} gr</Text>
                            <Text>Shipping method: {value.shipping_method}</Text>
                            <Text as="b">Payment Details</Text>
                            <Text>Payment method: Bank transfer</Text>
                            <Text>Total price: Rp{value.total_price}</Text>
                            <Text>
                              Shipping cost {detail.product_weight} gr: Rp{value.shipping_cost}
                            </Text>
                            <Text as="b">Grand Total: Rp{value.total_price + value.shipping_cost}</Text>
                          </Box>
                        );
                      })}
                    </ModalBody>

                    <ModalFooter>
                      <Button colorScheme="blue" mr={3} onClick={onDetailsClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
            )}
          </CardBody>
        </Card>
      );
    });
  };

  const handlePageClick = (data) => {
    setPage(data.selected);
  };

  return (
    <>
      <Box w="100%">
        <Box id="sort and filter" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Card border="1px" borderColor="gray.300" w="50%" mt={4}>
            <CardBody>
              <VStack>
                <FormControl>
                  <Select placeholder="Select status" onChange={(element) => setStatus(element.target.value)}>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Waiting for payment">Waiting for payment</option>
                    <option value="Waiting for confirmation">Waiting for confirmation</option>
                    <option value="Canceled">Canceled</option>
                  </Select>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
          <Card border="1px" borderColor="gray.300" w="50%" mt={4}>
            <CardBody>
              <VStack>
                <FormControl>
                  <FormLabel>Sort by date ordered:</FormLabel>
                  <Select placeholder="Order" onChange={(element) => setOrder(element.target.value)}>
                    <option value="DESC">Latest</option>
                    <option value="ASC">Oldest</option>
                  </Select>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
        </Box>
        <Box w="100%" mt={8}>
          <Text fontSize="xl">My Transaction</Text>
          {showOrderList()}
        </Box>
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
      </Box>
    </>
  );
};

export default OrderList;
