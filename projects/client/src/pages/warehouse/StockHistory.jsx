import { Button, Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider, Card, CardHeader, CardBody, CardFooter, Heading, Stack, StackDivider, Box, Text } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const StockHistory = () => {
  return (
    <Card maxW="lg" style={{ marginInline: 525, marginTop: 80 }}>
      <CardHeader>
        <Heading size="md">Stock History</Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            {/* <Heading size="xs" textTransform="uppercase">
              History
            </Heading> */}
            <Text pt="2" fontSize="sm">
              View a history of your products over the last month.
            </Text>
            <div className="flex flex-row justify-center mt-5">
              <div>
                <Text pt="2" fontSize="sm">
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
                <Text pt="2" fontSize="sm">
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
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Overview
            </Heading>
            <Text pt="2" fontSize="sm">
              Check out the overview of your products.
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Stock Info
            </Heading>
            <Text pt="2" fontSize="sm">
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
              Cancel
            </Button>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default StockHistory;
