import { Text, Input, InputGroup, Button, InputRightElement, Select } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Axios from "axios";
import React, { useState } from "react";
import { API_url } from "../../helper";
import { useEffect } from "react";

const AssignAdmin = (props) => {
  // nampung hasil get data warehouse
  const [warehouseData, setWarehouseData] = useState([]);
  const [city, setCity] = useState("");

  // nampung pilihan admin
  const [warehouse, setWarehouse] = useState("");

  const urlParams = new URLSearchParams(window.location.search);

  // To get the value of a specific query parameter:
  const admin_id = urlParams.get("id");

  const getWarehouseData = () => {
    Axios.get(API_url + `/warehouses/getWarehouseData`)
      .then((response) => {
        console.log(response.data);
        setWarehouseData(response.data);
      })
      .catch((err) => console.log(err));
  };

  const assignButton = () => {
    Axios.patch(API_url + `/warehouses/assignAdmin`, {
      admins_id: admin_id,
      id: warehouse,
    })
      .then((response) => {
        console.log(response.data);
        alert(response.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getWarehouseData();
  }, []);

  return (
    <div className="d-flex flex-column shadow-lg">
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
              {/* <Select placeholder="(insert nama city here)"> */}
              {/* {cityData.map((value, index) => {
                  return (
                    <option value={value.city_id} key={value.city_id}>
                      {value.type} {value.city_name}
                    </option>
                  );
                })} */}
              {/* </Select> */}
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
