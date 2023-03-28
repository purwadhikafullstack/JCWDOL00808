import React, { useState, useEffect } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Select, Button } from "@chakra-ui/react";
import axios from "axios";

const StockRequestList = () => {
  const [stockRequests, setStockRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStockRequests();
  }, []);

  const fetchStockRequests = async () => {
    try {
      const response = await axios.get("http://localhost:8000/mutations/getrequest-stock", {
        headers: { Authorization: token },
      });
      setStockRequests(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:8000/mutations/confirm-mutation/${id}`,
        { status },
        {
          headers: { Authorization: token },
        }
      );
      fetchStockRequests();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ margin: "auto", width: "70%" }}>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Product</Th>
            <Th>Quantity</Th>
            <Th>From Warehouse</Th>
            <Th>To Warehouse</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {stockRequests.map((request) => (
            <Tr key={request.id}>
              <Td>{request.product.name}</Td>
              <Td>{request.quantity}</Td>
              <Td>{request.from_warehouse.name}</Td>
              <Td>{request.to_warehouse.name}</Td>
              <Td>{request.mutation_type}</Td>
              <Td>
                {request.mutation_type === "Pending" && (
                  <div>
                    <Select placeholder="Select status" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                      <option value="ACCEPT">Accept</option>
                      <option value="REJECT">Reject</option>
                    </Select>
                    <Button colorScheme="teal" size="sm" onClick={() => handleStatusUpdate(request.id, selectedStatus)}>
                      Submit
                    </Button>
                  </div>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default StockRequestList;
