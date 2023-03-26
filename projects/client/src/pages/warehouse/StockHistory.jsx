import { Button, Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider, Card, CardHeader, CardBody, CardFooter, Heading, Stack, StackDivider, Box, Text } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const StockHistory = () => {
  return (
    // <Card maxW="lg" mx="auto" my={8} px={4} py={8} rounded="md">
    //    <CardHeader>
    //      <Heading as="h2" size="md" textTransform="uppercase">Stock History</Heading>
    //    </CardHeader>

    //    <CardBody>
    //      <Stack divider={<Stack.Divider />} spacing={4}>
    //        <Box>
    //          <Text as="p" fontSize="md" fontWeight="medium" mb={2}>View a history of your products over the last month.</Text>
    //          <Stack direction="row" alignItems="center">
    //            <Text as="label" htmlFor="product" fontSize="md" fontWeight="medium">Product:</Text>
    //            <Menu>
    //              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" size="sm" ml={4}>
    //                Choose product name
    //              </MenuButton>
    //              <MenuList>
    //                <MenuItem>Product 1</MenuItem>
    //                <MenuItem>Product 2</MenuItem>
    //                <MenuItem>Product 3</MenuItem>
    //              </MenuList>
    //            </Menu>
    //          </Stack>
    //          <Stack direction="row" alignItems="center" mt={4}>
    //            <Text as="label" htmlFor="location" fontSize="md" fontWeight="medium">Location:</Text>
    //            <Menu>
    //              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" size="sm" ml={4}>
    //                Choose warehouse
    //              </MenuButton>
    //              <MenuList>
    //                <MenuItem>Warehouse 1</MenuItem>
    //                <MenuItem>Warehouse 2</MenuItem>
    //                <MenuItem>Warehouse 3</MenuItem>
    //              </MenuList>
    //            </Menu>
    //          </Stack>
    //        </Box>
    //        <Box>
    //          <Heading as="h3" size="md">Stock Info</Heading>
    //          <Text as="p" fontSize="md" fontWeight="medium" mb={2}>See a detailed analysis of all your business clients.</Text>
    //          <Stack direction="row" justify="space-between" alignItems="center" mt={4}>
    //            <Stack>
    //              <Text as="label" htmlFor="quantity" fontSize="md" fontWeight="medium">Quantity on hand (pcs):</Text>
    //              <Text fontSize="md">1400</Text>
    //            </Stack>
    //            <Stack>
    //              <Text as="label" htmlFor="forecast" fontSize="md" fontWeight="medium">Forecast quantity (pcs):</Text>
    //              <Text fontSize="md">800</Text>
    //            </Stack>
    //            <Stack>
    //              <Text as="label" htmlFor="incoming" fontSize="md" fontWeight="medium">Incoming:</Text>
    //              <Text fontSize="md">1400</Text>
    //            </Stack>
    //            <Stack>
    //              <Text as="label" htmlFor="outcoming" fontSize="md" fontWeight="medium">Outcoming:</Text>
    //              <Text fontSize="md">800</Text>
    //            </Stack>
    //          </Stack>
    //          <Button mt={4}>Manage Stock</Button>
    //        </Box>
    //      </Stack>
    //    </CardBody>
    //  </Card>


    <Card maxW="lg" style={{ marginInline: 525, marginTop: 80 }}>
      <CardHeader>
        <Heading size="md"  textTransform="uppercase">Stock History</Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            {/* <Heading size="xs" textTransform="uppercase">
              History
            </Heading> */}
            <Text pt="2" fontSize="md">
              View a history of your products over the last month.
            </Text>
            <div className="flex flex-row justify-center mt-5">
              <div>
                <Text pt="2" fontSize="md">
                  Product:   
                </Text>
              </div>
              <div>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Choose product name
                  </MenuButton>
                  <MenuList>
                    <MenuItem>Download</MenuItem>
                    <MenuItem>Create a Copy</MenuItem>
                    <MenuItem>Mark as Draft</MenuItem>
                    <MenuItem>Delete</MenuItem>
                    <MenuItem>Attend a Workshop</MenuItem>
                  </MenuList>
                </Menu>
              </div>
            </div>
            <div className="flex flex-row justify-center mt-5">
              <div>
                <Text pt="2" fontSize="md">
                  Location:
                </Text>
              </div>
              <div>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Choose warehouse
                  </MenuButton>
                  <MenuList>
                    <MenuItem>Download</MenuItem>
                    <MenuItem>Create a Copy</MenuItem>
                    <MenuItem>Mark as Draft</MenuItem>
                    <MenuItem>Delete</MenuItem>
                    <MenuItem>Attend a Workshop</MenuItem>
                  </MenuList>
                </Menu>
              </div>
            </div>
          </Box>
          {/* <Box>
            <Heading size="xs" textTransform="uppercase">
              Overview
            </Heading>
            <Text pt="2" fontSize="sm">
              Check out the overview of your products.
            </Text>
          </Box> */}
          <Box>
            <Heading size="md">
              Stock Info
            </Heading>
            <Text pt="2" fontSize="md">
              See a detailed analysis of all your business clients.
            </Text>
            <div className="flex flex-row justify-center">
              <div>
                <div className="flex flex-row mt-4">
                  <div>Quantity on hand (pcs): </div>
                  <div> 1400</div>
                </div>
                <div className="flex flex-row mt-4">
                  <div>Forecast quantity (pcs): </div>
                  <div> 800</div>
                </div>
              </div>
              <div>
                <div className="flex flex-row mt-4">
                  <div>Incoming: </div>
                  <div> 1400</div>
                </div>
                <div className="flex flex-row mt-4">
                  <div>Outcoming: </div>
                  <div> 800</div>
                </div>
              </div>
            </div>
            <Button className="mt-5">
              Manage Stock
            </Button>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default StockHistory;