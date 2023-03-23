import { Card, CardHeader, CardBody, CardFooter, Image, Stack, Heading, Text, Divider, Button, ButtonGroup } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { API_url } from "../../helper";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const WarehouseDetails = () => {
  const [warehouse, setWarehouse] = useState("");
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const warehouse_id = urlParams.get("id");

  const getSpecificWarehouse = (warehouse_id) => {
    Axios.get(API_url + `/warehouses/getWarehouseData?id=${warehouse_id}`)
      .then((response) => {
        alert(response.data);
        setWarehouse(response.data);
      })
      .catch((error) => console.log(error));
  };

  //   useEffect(()=>{
  //     getSpecificWarehouse()
  //   }, [])

  return (
    <Card maxW="sm" style={{ marginInline: 525, marginTop: 80 }}>
      <CardBody>
        <Image src="https://www.paper.id/blog/wp-content/uploads/2022/11/istockphoto-1138429558-612x612-1.jpg" alt="Green double couch with wooden legs" borderRadius="lg" />
        <Stack mt="6" spacing="3">
          <Heading size="md">Warehouse name</Heading>
          <Text>Warehouse address: address Warehouse admin: admins_id</Text>
          <Text color="blue.600" fontSize="2xl">
            City, Province
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="7">
          <Button variant="solid" colorScheme="blue" onClick={() => navigate("/admin/assign", { replace: true })}>
            Assign an admin
          </Button>
          <Button variant="ghost" colorScheme="blue">
            Edit
          </Button>
          <Button variant="ghost" colorScheme="blue">
            Back
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default WarehouseDetails;
