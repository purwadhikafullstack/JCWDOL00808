import { Input, Button, Card, CardBody, Text, Flex, Box, VStack, Select, FormControl, FormLabel, Image, HStack } from "@chakra-ui/react";
import { BsBasketFill } from "react-icons/bs";
import { API_url } from "../../helper";
import Axios from "axios";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const OrderList = () => {
  // menerima user id dari page sebelumnya, id tersebut berbentuk param
  const { search } = useLocation();
  const id = search.split("=")[1];
  console.log("id user:", id);

  const [list, setList] = useState([]);

  const getTransactionList = () => {
    Axios.get(API_url + `/orders/getOrderList?id=${id}`)
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

  const showOrderList = () => {
    return list.map((value) => {
      return (
        <Card mb={6} size="lg">
          <CardBody>
            <VStack>
              <Box>
                <Flex>
                  <BsBasketFill />
                  <Text>Shopping</Text>
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
            </VStack>
          </CardBody>
        </Card>
      );
    });
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
                      <Input placeholder="search" />
                      <Button colorScheme="blue" mt="25">
                        Search
                      </Button>
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
