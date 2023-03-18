import { Avatar, Image, Container, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, ButtonGroup, useToast } from "@chakra-ui/react";
import Axios from "axios";
import { API_url } from "../../helper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WarehouseList = (props) => {
  const navigate = useNavigate();
  const toast = useToast();

  const [warehouseData, setWarehouseData] = useState([]);

  const getWarehouseData = () => {
    Axios.get(API_url + `/warehouses/getWarehouseData`)
      .then((response) => {
        console.log(response.data);
        setWarehouseData(response.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getWarehouseData();
  }, []);

  const detailsButton = () => {};

  const deleteButton = (value) => {
    Axios.delete(API_url + `/warehouses/deleteWarehouseData?id=${value}`)
      .then((response) => {
        toast({
          title: `${response.data.message}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setTimeout(window.location.reload(false), 9000);
      })
      .catch((err) => console.log(err));
  };

  const showWarehouseData = () => {
    let count = 0;
    return warehouseData.map((value) => {
      count++
      return (
        <Tr key={value.id}>
          <Td>{count}</Td>
          <Td>{value.name}</Td>
          <Td>{value.address}</Td>
          <Td>{value.province}</Td>
          <Td>{value.city}</Td>
          <Td isNumeric>
            <Button colorScheme="teal" className="mr-2" onClick={detailsButton}>
              Details
            </Button>
            <Button colorScheme="blue" className="mr-2" onClick={() => navigate(`/warehouse/edit?id=${value.id}`)}>
              Edit
            </Button>
            <Button colorScheme="red" onClick={() => deleteButton(value.id)}>
              Delete
            </Button>
          </Td>
        </Tr>
      );
    });
  };
  return (
    <>
      <TableContainer className="mt-5">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>No.</Th>
              <Th>Warehouse Name</Th>
              <Th>Address</Th>
              <Th>Province</Th>
              <Th>City</Th>
              <Th>Action</Th>
              {/* <Th>Latitude</Th> */}
              {/* <Th>Longitude</Th> */}
            </Tr>
          </Thead>
          <Tbody>{showWarehouseData()}</Tbody>
        </Table>
      </TableContainer>
      <Button colorScheme="orange" className="mt-5" onClick={() => navigate(`/warehouse/add`)}>
        Add new warehouse
      </Button>
    </>
  );
};

export default WarehouseList;

{
  /* <Tfoot>
  <Tr>
    <Th>To convert</Th>
    <Th>into</Th>
    <Th isNumeric>multiply by</Th>
  </Tr>
</Tfoot> */
}
