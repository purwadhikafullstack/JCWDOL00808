import { Avatar, Image, Container, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, ButtonGroup } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_url } from "../../helper";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminList = (props) => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  // const { id, email, full_name, phone_number, role } = useSelector((state) => {
  //   return {
  //     id: state.adminsReducer.id,
  //     email: state.adminsReducer.email,
  //     full_name: state.adminsReducer.full_name,
  //     phone_number: state.adminsReducer.phone_number,
  //     role: state.adminsReducer.role
  //   }
  // })

  const [adminsData, setAdminsData] = useState([]);

  const getAdminsData = () => {
    Axios.get(API_url + `/admins/getAdminsData`)
      .then((response) => {
        console.log(response.data);
        // dispatch(getAdminsAction(response.data))
        setAdminsData(response.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAdminsData();
  }, []);

  const showAdminsData = () => {
    return adminsData.map((value) => {
      if (value.role == 1) {
        value.role = "Super admin";
      } else if (value.role == 2) {
        value.role = "Warehouse admin";
      }
      return (
        <Tr>
          <Td>{value.id}</Td>
          <Td>{value.full_name}</Td>
          <Td>{value.email}</Td>
          <Td>{value.phone_number}</Td>
          <Td>{value.role}</Td>
          <Td isNumeric>
                <Button className="mr-2" onClick={() => navigate(`/admin/assign?id=${value.id}`)}>Assign to warehouse</Button>
                <Button colorScheme="red">Delete</Button>
          </Td>
        </Tr>
      );
    });
  };

  const assignButton = () => {
    Axios.patch(API_url + `/admins/assignNewAdmin/`)
      .then((response) => {
        console.log(response.data);
        alert(response.data.message);
      })
      .catch((err) => {
        console.error(err);
        alert("Error guys");
      });
  };

  const deleteButton = () => {};

  return (
    <>
      <TableContainer className="mt-5">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>Name</Th>
              <Th>e-mail</Th>
              <Th>Phone number</Th>
              <Th>Role</Th>
              <Th isNumeric>Action</Th>
            </Tr>
          </Thead>
          <Tbody>{showAdminsData()}</Tbody>
          {/* <Tfoot>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Tfoot> */}
        </Table>
      </TableContainer>
      <Button colorScheme="orange" className="mt-5">
        Add new admin
      </Button>
    </>
  );
};

export default AdminList;
