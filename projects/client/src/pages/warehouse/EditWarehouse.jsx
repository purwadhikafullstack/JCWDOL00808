import { Text, Input, InputGroup, Button, InputRightElement, Select } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Axios from "axios";
import React from "react";
import { API_url } from "../../helper";
import { useEffect } from "react";

const EditWarehouse = (props) => {
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");

  // nampung hasil get dari raja ongkir
  const [provinceData, setProvinceData] = React.useState([]);
  const [cityData, setCityData] = React.useState([]);

  // nampung province dan city pilihan admin
  const [province, setProvince] = React.useState("");
  const [city, setCity] = React.useState("");

  const getProvinceData = () => {
    Axios.get(API_url + `/warehouses/getProvinceData`)
      .then((response) => {
        console.log(response.data);
        setProvinceData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProvinceData();
  }, []);

  const onGetCity = (province_id) => {
    // console.log("province_id:", province_id)
    Axios.get(API_url + `/warehouses/getCityData?province_id=${province_id}`)
      .then((response) => {
        console.log(response.data);
        setCityData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const buttonEditWarehouse = () => {};

  return (
    <div className="d-flex flex-column shadow-lg">
      <div className="d-flex flex-row justify-content-center">
        <div className="my-5 mx-5 px-5 text-start">
          <div>
            <Text fontSize="xl" as="b">
              Edit warehouse data
            </Text>
          </div>
          <div className="mt-4 text-muted fw-bold text-start">
            <Text fontSize="md">Name</Text>
            <Input placeholder="Warehouse name" size="md" onChange={(element) => setName(element.target.value)} />
          </div>
          <div className="mt-4 text-muted fw-bold text-start">
            <Text fontSize="md">Address</Text>
            <InputGroup size="md">
              <Input pr="4.5rem" placeholder="warehouse address" onChange={(element) => setAddress(element.target.value)} />
            </InputGroup>
          </div>
        </div>
        <div className="my-5 mx-5 px-5">
          <div className="mt-5 pt-5 text-muted fw-bold text-start">
            <Text fontSize="md">Province</Text>
            <Select placeholder="Select province" onChange={(element) => onGetCity(element.target.value)}>
              {provinceData.map((value) => {
                return <option value={value.province_id} key={value.province_id}>{value.province}</option>;
              })}
            </Select>
          </div>
          <div>
            <div className="mt-4 text-muted fw-bold text-start">
              <Text fontSize="md">City</Text>
              <Select placeholder="Select city">
                {cityData.map((value, index) => {
                  return (
                    <option value={value.city_id} key={value.city_id}>
                      {value.type} {value.city_name}
                    </option>
                  );
                })}
              </Select>
            </div>
          </div>
        </div>
      </div>
      <Button colorScheme="facebook" style={{ width: "15%", marginInline: "auto", marginBottom: 50 }} onClick={buttonEditWarehouse}>
        Save changes
      </Button>
    </div>
  );
};

export default EditWarehouse;
