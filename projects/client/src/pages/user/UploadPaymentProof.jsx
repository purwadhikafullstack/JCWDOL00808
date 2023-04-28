import { Box, Text, InputGroup, Input, InputRightElement, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { API_url } from "../../helper";
import Axios from "axios";
import { useLocation } from "react-router-dom";

const UploadPaymentProof = () => {
  const [proof, setProof] = useState(null);
  const toast = useToast();

  let token = localStorage.getItem("token");
  let { search } = useLocation();
  let orders_id = parseInt(search.split("=")[1]);

  const handleUploadButton = async () => {
    const formData = new FormData();
    formData.append("payment_proof", proof);
    formData.append("id", orders_id);

    await Axios.post(API_url + `/orders/upload-payment-proof`, formData, {
      headers: { Authorization: token },
    })
      .then((response) => {
        console.log(response.data);
        toast({
          title: `${response.data.message}`,
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: `${error.message}`,
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Box w={[300, 400, 500]} className="shadow p-5">
        <Text className="font-bold" fontSize="2xl">
          Upload proof for payment
        </Text>
        <Text className="mt-3" fontSize="lg">
          Payment proof
        </Text>
        <Input type="file" placeholder="upload .jpeg/ .jpg/ .png file less than 5MB" onChange={(element) => setProof(element.target.files[0])} />

        <Button className="mt-5" colorScheme="twitter" onClick={handleUploadButton}>
          Upload proof
        </Button>
      </Box>
    </div>
  );
};

export default UploadPaymentProof;
