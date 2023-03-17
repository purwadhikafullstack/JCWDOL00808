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
  Icon,
} from "@chakra-ui/react";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { productId } = useParams();

  const getProductsData = async () => {
    try {
      console.log(productId);
      const productsData = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/product/${productId}`
      );
      console.log(productsData?.data?.data);
      setProduct(productsData?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const handleAddToCart = () => {
  //   // Add the product to the cart with the selected quantity
  // };

  useEffect(() => {
    getProductsData();
  }, []);

  if (!product) {
    return (
      <div className="container flex flex-col justify-between">
        <Navbar />
        <div>Loading...</div>
        <Footer />
      </div>
    );
  }

  // const renderStars = (rating) => {
  //   const stars = [];
  //   for (let i = 1; i <= 5; i++) {
  //     stars.push(
  //       <Icon
  //         key={i}
  //         as={i <= rating ? FaStar : FaRegStar}
  //         color={i <= rating ? "yellow.400" : "gray.300"}
  //         mr="1"
  //       />
  //     );
  //   }
  //   return stars;
  // };

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
            {/* <HStack>
              {renderStars(product.rating.rate)}
              <Text>({product.rating.rate})</Text>
            </HStack> */}
            <Text fontSize="xl" fontWeight="bold">
              Rp {product.price * quantity},00
            </Text>
            <HStack width="100%">
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
            <Button colorScheme="blue" width="100%">
              Add to Cart
            </Button>
          </VStack>
        </Flex>
      </div>
      <Footer />
    </>
  );
}
