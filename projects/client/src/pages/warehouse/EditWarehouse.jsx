import { Text, Input, InputGroup, Button, InputRightElement, Select, useToast } from "@chakra-ui/react";
import Axios from "axios";
import React from "react";
import { API_url } from "../../helper";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditWarehouse = (props) => {
  const navigate = useNavigate();

  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");

  // nampung hasil get dari raja ongkir
  const [provinceData, setProvinceData] = React.useState([]);
  const [cityData, setCityData] = React.useState([]);

  // nampung province dan city pilihan admin
  const [province, setProvince] = React.useState("");
  const [city, setCity] = React.useState("");
  const [district, setDistrict] = React.useState("");

  const toast = useToast();

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

  const urlParams = new URLSearchParams(window.location.search);
  const warehouse_id = urlParams.get("id"); // "id" didapat dari yang ditulis di navigate

  const buttonEditWarehouse = () => {
    Axios.patch(API_url + `/warehouses/updateWarehouseData`, {
      id: warehouse_id,
      name,
      address,
      province,
      city,
      district,
    })
      .then((response) => {
        console.log(response.data);
        // alert(response.data.message);
        toast({
          title: `${response.data.message}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setTimeout(navigate("/warehouse/list", { replace: true }), 9000);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex flex-column">
      {/* <div className="d-flex flex-row justify-content-center"> */}
        <div className="mt-5 mx-5 px-5 text-start">
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
        <div className="mx-5 px-5">
          <div className="mt-4 text-muted fw-bold text-start">
            <Text fontSize="md">Province</Text>
            <Select
              placeholder="Select province"
              onChange={(element) => {
                onGetCity(element.target.value);
                setProvince(element.target.value.split(",")[1]);
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
              <Select placeholder="Select city" onChange={(element) => setCity(element.target.value)}>
                {cityData.map((value) => {
                  return (
                    <option value={`${value.type} ${value.city_name}`} key={value.city_id}>
                      {value.type} {value.city_name}
                    </option>
                  );
                })}
              </Select>
            </div>
            <div className="mt-4 text-muted fw-bold text-start">
              <Text fontSize="md">District (Kecamatan)</Text>
              <Input
                placeholder="Input district"
                // onChange={(element) => {
                // setProvince(element.target.value.split(",")[1]);
                // onGetCity(element.target.value.split(",")[0]);
                // }}
                onChange={(element) => setDistrict(element.target.value)}
              >
                {/* {provinceData.map((value) => {
                  return (
                    <option value={value.province_id + "," + value.province} key={value.province_id}>
                      {value.province}
                    </option>
                  );
                })} */}
              </Input>
            </div>
          </div>
        </div>
      {/* </div> */}
      <Button colorScheme="facebook" style={{ width: "15%", marginInline: "auto", marginBottom: 50, marginTop: 50 }} onClick={buttonEditWarehouse}>
        Save changes
      </Button>
    </div>
  );
};

export default EditWarehouse;
