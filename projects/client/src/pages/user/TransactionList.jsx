import { Input, Button, Card, CardBody, Text, Flex, Box, VStack, Select, FormControl, FormLabel } from "@chakra-ui/react";
import { BsBasketFill } from "react-icons/bs";

const TransactionList = () => {
  //   getTransactionList = () => {};

  return (
    <>
      <Flex bg="gray.100">
        <Box mx="100" my="100">
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
        <Box mr="30" my="100">
          <Text fontSize="3xl">My Transaction</Text>
          <Card>
            <CardBody>
              <Flex>
                <BsBasketFill />
                <Text>Shopping</Text>
                <Text>6 Dec 2021</Text>
                <Text>Success</Text>
              </Flex>
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </>
  );
};

export default TransactionList;
