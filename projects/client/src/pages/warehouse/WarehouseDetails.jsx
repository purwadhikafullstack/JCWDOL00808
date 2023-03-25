import { Card, CardHeader, CardBody, CardFooter, Image, Stack, Heading, Text, Divider, Button, ButtonGroup } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { API_url } from "../../helper";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const WarehouseDetails = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

  const navigate = useNavigate();

  const { id } = useParams();
  console.log("id warehouse displayed:", id);

  const getSpecificWarehouse = () => {
    Axios.get(API_url + `/warehouses/getWarehouseDetails/${id}`)
      .then((response) => {
        console.log("response:", response.data.name);
        setName(response.data.name);
        setAddress(response.data.address);
        setCity(response.data.city);
        setProvince(response.data.province);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getSpecificWarehouse();
  }, []);

  return (
    <Card maxW="sm" style={{ marginInline: 525, marginTop: 80 }}>
      <CardBody>
        <Image src="https://www.paper.id/blog/wp-content/uploads/2022/11/istockphoto-1138429558-612x612-1.jpg" alt="Green double couch with wooden legs" borderRadius="lg" />
        <Stack mt="6" spacing="3">
          <Heading size="md">Warehouse {name}</Heading>
          <Text size="sm">Warehouse address: {address}</Text>
          <Text color="blue.600" size="sm">
            {city}, {province}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="7">
          <Button variant="solid" colorScheme="blue" onClick={() => navigate(`/admin/assign/${id}`)}>
            Assign an admin
          </Button>
          <Button variant="ghost" colorScheme="blue" onClick={() => navigate("/warehouse/list", { replace: true })}>
            Back
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default WarehouseDetails;
