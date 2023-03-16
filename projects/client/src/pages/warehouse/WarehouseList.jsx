// import { Avatar, Image, Container, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, ButtonGroup } from "@chakra-ui/react";
// import Axios from "axios";
// import { useDispatch, useSelector } from "react-redux"
// import { getWarehousesAction } from "../../actions/warehousesAction";
// import { API_url } from "../../helper";
// import { useEffect } from "react";
// // import warehouses from "../../../../server/src/controllers/warehouses";

// const WarehouseList = (props) => {
//     const dispatch = useDispatch();

//   const { id, name, address, province, city } = useSelector((state) => {
//     return {
//       id: state.warehousesReducer.id,
//       name: state.warehousesReducer.name,
//       address: state.warehousesReducer.address,
//       province: state.warehousesReducer.province,
//       city: state.warehousesReducer.city
//     }
//   })

//   const getWarehouseData = () => {
//     Axios.get(API_url + `/warehouses/getWarehousesData`)
//     .then((response) => {
//         console.log("response.data:", response.data);
//         dispatch(getWarehousesAction(response.data))
//     })
//     .catch((err) => {
//         console.log(err);
//     })
//   }

//   useEffect(() => {
//     getWarehouseData();
//   }, []);

//   const detailsButton = () => {};
//   const editButton = () => {};
//   const deleteButton = () => {};

//   return (
//     <>
//       <TableContainer className="mt-5">
//         <Table size="sm">
//           <Thead>
//             <Tr>
//               <Th>id</Th>
//               <Th>Warehouse Name</Th>
//               <Th>Address</Th>
//               <Th>Province</Th>
//               <Th>City</Th>
//               <Th></Th>
//               {/* <Th>Latitude</Th> */}
//               {/* <Th>Longitude</Th> */}
//             </Tr>
//           </Thead>
//           <Tbody>
//             {warehouses.map((warehouse) => (

//             <Tr key={warehouse.id}>
//               <Td>{warehouse.id}</Td>
//               <Td>{warehouse.name}</Td>
//               <Td>{warehouse.address}</Td>
//               <Td>{warehouse.province}</Td>
//               <Td>{warehouse.city}</Td>
//               <Td isNumeric>
//                 <Button colorScheme="teal" className="mr-2" onClick={detailsButton}>
//                   Details
//                 </Button>
//                 <Button colorScheme="blue" className="mr-2" onClick={editButton}>
//                   Edit
//                 </Button>
//                 <Button colorScheme="red" onClick={deleteButton}>Delete</Button>
//               </Td>
//             </Tr>
//             ))}
//             <Tr>
//               <Td>{id}</Td>
//               <Td>{name}</Td>
//               <Td>{address}</Td>
//               <Td>{province}</Td>
//               <Td>{city}</Td>
//               <Td isNumeric>
//                 <Button colorScheme="teal" className="mr-2">
//                   Details
//                 </Button>
//                 <Button colorScheme="blue" className="mr-2">
//                   Edit
//                 </Button>
//                 <Button colorScheme="red">Delete</Button>
//               </Td>
//             </Tr>
//           </Tbody>
//           {/* <Tfoot>
//             <Tr>
//               <Th>To convert</Th>
//               <Th>into</Th>
//               <Th isNumeric>multiply by</Th>
//             </Tr>
//           </Tfoot> */}
//         </Table>
//       </TableContainer>
//       <Button colorScheme="orange" className="mt-5">
//         Add new warehouse
//       </Button>
//     </>
//   );
// };

// export default WarehouseList;
