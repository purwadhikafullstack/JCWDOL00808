import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Box,
  Flex,
  Image,
  Text,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  HStack,
  Spacer,
  CircularProgress,
  useToast,
} from "@chakra-ui/react";

export default function ProductDetails() {
  const [profile, setProfile] = useState(null);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { productId } = useParams();
  const toast = useToast();

  const getProductsData = async () => {
    try {
      const productsData = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/products/${productId}`
      );
      setProduct(productsData?.data?.data);
    } catch (error) {
      toast({
        title: error?.response?.data?.message || error?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // const handleAddToCart = () => {
  //   // Add the product to the cart with the selected quantity
  // };

  useEffect(() => {
    getProductsData();
    setProfile(JSON.parse(localStorage.getItem("user")));
  }, []);

  if (!product) {
    return (
      <div className="container flex flex-col justify-between">
        <Navbar />
        <div className="my-8">
          <CircularProgress isIndeterminate color="blue" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto md:px-24 px-8 py-8">
        <Flex
          direction={{ base: "column", sm: "row" }}
          justifyContent="center"
          alignItems="center"
        >
          <Box flex="1" maxW="lg">
            <Image
              src={`${process.env.REACT_APP_API_BASE_URL}/${product?.imageUrl}`}
              alt={product.name}
              objectFit="cover"
              borderRadius="md"
              mb="4"
            />
          </Box>
          <Spacer />
          <VStack flex="1" spacing={4} maxW="lg">
            <Text fontSize="2xl" fontWeight="bold">
              {product.name}
            </Text>
            <Text>{product.description}</Text>
            <Text fontSize="xl" fontWeight="bold">
              {(product.price * quantity).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </Text>
            <HStack width="100%" justifyContent="center">
              <Text>Quantity:</Text>
              <NumberInput
                onChange={(qty) => setQuantity(Number(qty))}
                defaultValue={1}
                min={1}
                max={99}
                keepWithinRange
                clampValueOnBlur
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </HStack>
            <Button
              isDisabled={!profile?.is_verified}
              colorScheme="blue"
              width="100%"
            >
              Add to Cart
            </Button>
          </VStack>
        </Flex>
      </div>
      <Footer />
    </>
  );
}
