import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Table, Thead, Tbody, Tr, Th, Td, TableCaption, VStack, Heading, FormControl, FormLabel, Select, Input, Button } from "@chakra-ui/react";
import jwtDecode from "jwt-decode";

const SalesReport = () => {
  const [report, setReport] = useState({ monthly: [], weekly: [] });
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState("weekly");
  const [warehouse, setWarehouse] = useState("");
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    // Get the token from localStorage
    const token = window.localStorage.getItem("token");

    // Decode the token and extract the email
    const decodedToken = jwtDecode(token);
    const email = decodedToken.email;

    // Replace the URL below with the correct endpoint for your API.
    let url = `http://localhost:8000/admin/sales-report?email=${email}&start_date=${startDate}&end_date=${endDate}`;
    if (warehouse) url += `&warehouse_filter=${warehouse}`;
    if (category) url += `&category_filter=${category}`;
    if (product) url += `&product_filter=${product}`;

    const response = await axios.get(url);
    setReport(response.data);
    setLoading(false);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchReport();
  };

  const renderTable = (data) => (
    <Table variant="simple">
      <TableCaption>{timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Sales Report</TableCaption>
      <Thead>
        <Tr>
          <Th>Time Period</Th>
          <Th>Total</Th>
          <Th>Total Quantity</Th>
          <Th>Category</Th>
          <Th>Product</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((item, index) => (
          <Tr key={index}>
            <Td>{item.timePeriod}</Td>
            <Td>{item.total}</Td>
            <Td>{item.totalQuantity}</Td>
            <Td>
              {item.categories.map((category, index) => (
                <div key={index}>
                  Category {category.id}: {category.total}
                </div>
              ))}
            </Td>
            <Td>
              {item.products.map((product, index) => (
                <div key={index}>
                  {product.name} (ID: {product.id}): {product.total} ({product.quantity} units)
                </div>
              ))}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  return (
    <VStack spacing={8} align="stretch">
      <Heading>Sales Report</Heading>
      <form onSubmit={handleFilterSubmit}>
        <FormControl>
          <FormLabel>Warehouse</FormLabel>
          <Input placeholder="Warehouse ID" value={warehouse} onChange={(e) => setWarehouse(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Category</FormLabel>
          <Input placeholder="Category ID" value={category} onChange={(e) => setCategory(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Product</FormLabel>
          <Input placeholder="Product ID" value={product} onChange={(e) => setProduct(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Start Date</FormLabel>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>End Date</FormLabel>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </FormControl>
        <Button mt={4} colorScheme="blue" type="submit">
          Apply Filters
        </Button>
      </form>
      {/* Show the table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <FormControl>
            <FormLabel>Time Period</FormLabel>
            <Select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)}>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </FormControl>
          {renderTable(report[timePeriod])}
        </>
      )}
    </VStack>
  );
};

export default SalesReport;
