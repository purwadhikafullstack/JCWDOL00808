// import { useState } from "react";
// import {
//   Button,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   MenuDivider,
//   Card,
//   CardHeader,
//   CardBody,
//   Heading,
//   Stack,
//   Box,
//   Text,
// } from "@chakra-ui/react";
// import { ChevronDownIcon } from "@chakra-ui/icons";

// const StockHistory = () => {
//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [selectedWarehouse, setSelectedWarehouse] = useState("");

//   return (
//     <Card maxW="lg" mx="auto" mt="8">
//       <CardHeader>
//         <Heading size="md" textTransform="uppercase">
//           Stock History
//         </Heading>
//       </CardHeader>

//       <CardBody>
//         <Stack spacing="4">
//           <Box>
//             <Text fontSize="md">
//               View a history of your products over the last month.
//             </Text>
//             <Stack direction="row" justify="center" mt="5">
//               <Box>
//                 <Text fontSize="md">Product:</Text>
//               </Box>
//               <Box>
//                 <Menu>
//                   <MenuButton
//                     as={Button}
//                     rightIcon={<ChevronDownIcon />}
//                     onClick={() => setSelectedProduct("")}
//                   >
//                     {selectedProduct ? selectedProduct : "Choose product name"}
//                   </MenuButton>
//                   <MenuList>
//                     <MenuItem onClick={() => setSelectedProduct("Download")}>
//                       Download
//                     </MenuItem>
//                     <MenuItem onClick={() => setSelectedProduct("Create a Copy")}>
//                       Create a Copy
//                     </MenuItem>
//                     <MenuItem onClick={() => setSelectedProduct("Mark as Draft")}>
//                       Mark as Draft
//                     </MenuItem>
//                     <MenuItem onClick={() => setSelectedProduct("Delete")}>
//                       Delete
//                     </MenuItem>
//                     <MenuItem onClick={() => setSelectedProduct("Attend a Workshop")}>
//                       Attend a Workshop
//                     </MenuItem>
//                   </MenuList>
//                 </Menu>
//               </Box>
//             </Stack>
//             <Stack direction="row" justify="center" mt="5">
//               <Box>
//                 <Text fontSize="md">Location:</Text>
//               </Box>
//               <Box>
//                 <Menu>
//                   <MenuButton
//                     as={Button}
//                     rightIcon={<ChevronDownIcon />}
//                     onClick={() => setSelectedWarehouse("")}
//                   >
//                     {selectedWarehouse ? selectedWarehouse : "Choose warehouse"}
//                   </MenuButton>
//                   <MenuList>
//                     <MenuItem onClick={() => setSelectedWarehouse("Download")}>
//                       Download
//                     </MenuItem>
//                     <MenuItem onClick={() => setSelectedWarehouse("Create a Copy")}>
//                       Create a Copy
//                     </MenuItem>
//                     <MenuItem onClick={() => setSelectedWarehouse("Mark as Draft")}>
//                       Mark as Draft
//                     </MenuItem>
//                     <MenuItem onClick={() => setSelectedWarehouse("Delete")}>
//                       Delete
//                     </MenuItem>
//                     <MenuItem onClick={() => setSelectedWarehouse("Attend a Workshop")}>
//                       Attend a Workshop
//                     </MenuItem>
//                   </MenuList>
//                 </Menu>
//               </Box>
//             </Stack>
//           </Box>
//           <Box>
//             <Heading size="md">Stock Info</Heading>
//             <Text fontSize="md">
//               See a detailed analysis of all your business clients.
//             </Text>
//             <Stack direction="row" justify="space-around" mt="4">
//               <Box>
//                 <Text>
//                   Quantity on hand (pcs): <b>1400</b>
//                 </Text>
//                 <Text>
//                   Forecast quantity (pcs): <b>800</b>
//                 </Text>
//               </Box>
//               </Stack>
//           </Box>
//           </Stack>
//           </CardBody>
//           </Card>
//   )
// }

// export default StockHistory;

//=========================================================================



// import { Button, Menu, MenuButton, MenuList, MenuItem, Card, CardHeader, CardBody, Heading, Stack, Box, Text } from "@chakra-ui/react";
// import { ChevronDownIcon } from "@chakra-ui/icons";

// const StockHistory = () => {
//   return (
//     <Card maxW="lg" mx="auto" my={8} px={4} py={8} rounded="md">
//       <CardHeader>
//         <Heading as="h2" size="md" textTransform="uppercase">Stock History</Heading>
//       </CardHeader>

//       <CardBody>
//         <Stack divider={<Stack.Divider />} spacing={4}>
//           <Box>
//             <Text as="p" fontSize="md" fontWeight="medium" mb={2}>View a history of your products over the last month.</Text>
//             <Stack direction="row" alignItems="center">
//               <Text as="label" htmlFor="product" fontSize="md" fontWeight="medium">Product:</Text>
//               <Menu>
//                 <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" size="sm" ml={4}>
//                   Choose product name
//                 </MenuButton>
//                 <MenuList>
//                   <MenuItem>Product 1</MenuItem>
//                   <MenuItem>Product 2</MenuItem>
//                   <MenuItem>Product 3</MenuItem>
//                 </MenuList>
//               </Menu>
//             </Stack>
//             <Stack direction="row" alignItems="center" mt={4}>
//               <Text as="label" htmlFor="location" fontSize="md" fontWeight="medium">Location:</Text>
//               <Menu>
//                 <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" size="sm" ml={4}>
//                   Choose warehouse
//                 </MenuButton>
//                 <MenuList>
//                   <MenuItem>Warehouse 1</MenuItem>
//                   <MenuItem>Warehouse 2</MenuItem>
//                   <MenuItem>Warehouse 3</MenuItem>
//                 </MenuList>
//               </Menu>
//             </Stack>
//           </Box>
//           <Box>
//             <Heading as="h3" size="md">Stock Info</Heading>
//             <Text as="p" fontSize="md" fontWeight="medium" mb={2}>See a detailed analysis of all your business clients.</Text>
//             <Stack direction="row" justify="space-between" alignItems="center" mt={4}>
//               <Stack>
//                 <Text as="label" htmlFor="quantity" fontSize="md" fontWeight="medium">Quantity on hand (pcs):</Text>
//                 <Text fontSize="md">1400</Text>
//               </Stack>
//               <Stack>
//                 <Text as="label" htmlFor="forecast" fontSize="md" fontWeight="medium">Forecast quantity (pcs):</Text>
//                 <Text fontSize="md">800</Text>
//               </Stack>
//               <Stack>
//                 <Text as="label" htmlFor="incoming" fontSize="md" fontWeight="medium">Incoming:</Text>
//                 <Text fontSize="md">1400</Text>
//               </Stack>
//               <Stack>
//                 <Text as="label" htmlFor="outcoming" fontSize="md" fontWeight="medium">Outcoming:</Text>
//                 <Text fontSize="md">800</Text>
//               </Stack>
//             </Stack>
//             <Button mt={4}>Manage Stock</Button>
//           </Box>
//         </Stack>
//       </CardBody>
//     </Card>
//   );
// };

// export default StockHistory;
//=========================================================================
