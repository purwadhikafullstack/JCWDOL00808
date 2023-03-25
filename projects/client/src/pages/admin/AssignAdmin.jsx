import { Text, Input, InputGroup, Button, InputRightElement, Select } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Axios from "axios";
import React, { useState } from "react";
import { API_url } from "../../helper";
import { useEffect } from "react";
import {useParams} from "react-router-dom"

const AssignAdmin = (props) => {
  // nampung hasil get data warehouse
  const [warehouseData, setWarehouseData] = useState([]);
  const [city, setCity] = useState("");

  // nampung pilihan admin
  const [warehouse, setWarehouse] = useState("");


  const {id} = useParams();
  console.log("id admin: ", id);

  const getWarehouseData = () => {
    Axios.get(API_url + `/warehouses/getAllWarehouse`)
      .then((response) => {
        console.log(response.data);
        setWarehouseData(response.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getWarehouseData();
  }, []);

  const assignButton = () => {
    Axios.patch(API_url + `/admins/assignNewAdmin`, {
      admins_id: id,
      id: warehouse,
    })
      .then((response) => {
        console.log("cek:", response.data);
        alert(response.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-row justify-content-center">
        <div className="my-5 mx-5 px-5 text-start">
          <div>
            <Text fontSize="xl" as="b">
              Assign warehouse admin
            </Text>
          </div>
        </div>
        <div className="my-5 mx-5 px-5">
          <div className="mt-5 pt-5 text-muted fw-bold text-start">
            <Text fontSize="md">Warehouse</Text>
            <Select
              placeholder="Select warehouse"
              onChange={(element) => {
                setWarehouse(element.target.value.split(",")[0]);
                setCity(element.target.value.split(",")[1]);
              }}
            >
              {warehouseData.map((value) => {
                return (
                  <option value={value.id + "," + value.city} key={value.id}>
                    {value.name}
                  </option>
                );
              })}
            </Select>
          </div>
          <div>
            <div className="mt-4 text-muted fw-bold text-start">
              <Text fontSize="md">City</Text>
              <Text fontSize="md">{city}</Text>
            </div>
          </div>
        </div>
      </div>
      <Button colorScheme="facebook" style={{ width: "15%", marginInline: "auto", marginBottom: 50 }} onClick={assignButton}>
        Assign admin
      </Button>
    </div>
  );
};

export default AssignAdmin;
