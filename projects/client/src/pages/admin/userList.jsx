import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Thead, Tbody, Tr, Th, Td, TableCaption } from "@chakra-ui/react";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("http://localhost:8000/admin/getAdminUserList");
      setUsers(result.data.user);
    };

    fetchData();
  }, []);

  return (
    <Table variant="simple">
      <TableCaption>User List</TableCaption>
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Email</Th>
          <Th>Full Name</Th>
          <Th>Phone Number</Th>
          <Th>Is Verified</Th>
        </Tr>
      </Thead>
      <Tbody>
        {users.map((user) => (
          <Tr key={user.id}>
            <Td>{user.id}</Td>
            <Td>{user.email}</Td>
            <Td>{user.full_name}</Td>
            <Td>{user.phone_number}</Td>
            <Td>{user.is_verified ? "Yes" : "No"}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default UserList;
