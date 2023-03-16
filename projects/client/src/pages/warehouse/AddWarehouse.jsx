import { Text, Input, InputGroup, Button, InputRightElement, Select } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Axios from "axios";
import React, { useEffect } from "react";
import { API_url } from "../../helper";

const AddWarehouse = (props) => {
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
        console.log("dari onGetCity: ", response.data);
        setCityData(response.data);

        // setProvince("");
        // setCity("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const buttonAddWarehouse = () => {
    // alert(province + city)
    Axios.post(API_url + `/warehouses/addWarehouseData`, {
      name,
      address,
      province,
      city,
      // district,
      // latitude,
      // longitude,
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="d-flex flex-column shadow-lg">
      <div className="d-flex flex-row justify-content-center">
        <div className="my-5 mx-5 px-5 text-start">
          <div>
            <Text fontSize="xl" as="b">
              Add new warehouse
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
            <Select
              placeholder="Select province"
              onChange={(element) => {
                setProvince(element.target.value.split(",")[1]);
                onGetCity(element.target.value.split(","[0]));
              }}
            >
              {provinceData.map((value) => {
                return (
                  <option value={value.province_id + "," + value.province} key={value.province_id}>
                    {value.province}
                  </option>
                );
              })}
            </Select>
          </div>
          <div>
            <div className="mt-4 text-muted fw-bold text-start">
              <Text fontSize="md">City</Text>
              <Select placeholder="Select city" value={city} onChange={(element) => setCity(element.target.value)}>
                {cityData.map((value) => {
                  return (
                    <option value={`${value.type} ${value.city_name}`} key={value.city_id}>
                      {value.type} {value.city_name}
                    </option>
                  );
                })}
              </Select>
            </div>
          </div>
        </div>
      </div>
      <Button colorScheme="facebook" style={{ width: "15%", marginInline: "auto", marginBottom: 50 }} onClick={buttonAddWarehouse}>
        Add warehouse
      </Button>
    </div>
  );
};

export default AddWarehouse;
