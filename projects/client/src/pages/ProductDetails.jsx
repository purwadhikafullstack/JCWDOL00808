import {
  Box,
  Button,
  CircularProgress,
  Flex,
  HStack,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spacer,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addProduct } from "../reducers/cartSlice";

export default function ProductDetails() {
  const [profile, setProfile] = useState(null);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const token = localStorage.getItem("user_token");
  const { productId } = useParams();
  const toast = useToast();
  const dispatch = useDispatch();

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

  const handleAddToCart = async (products_id, quantity) => {
    try {
      //Get product quantity in existing cart
      const productQuantity = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/cart/quantity/${products_id}`,
        { headers: { Authorization: token } }
      );

      if (quantity + productQuantity.data.data > product.availableStock) {
        toast({
          title: "Product in your cart exceeds available stocks",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Add the product to the cart with the selected quantity
        dispatch(
          addProduct({
            products_id,
            quantity,
          })
        );
        toast({
          title: "Product added to cart",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getProductsData();
    setProfile(JSON.parse(localStorage.getItem("user")));
    //eslint-disable-next-line
  }, []);

  if (!product) {
    return (
      <div className="container flex flex-col justify-between">
        <div className="my-8">
          <CircularProgress isIndeterminate color="blue" />
        </div>
      </div>
    );
  }

  return (
    <>
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
            <Text fontSize="2xl" fontWeight="bold" fontFamily="Oswald">
              {product.name}
            </Text>
            <Text fontFamily="Roboto">{product.description}</Text>
            <Text fontSize="xl" fontWeight="bold" fontFamily="Roboto">
              {(product.price * quantity).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </Text>
            <HStack width="100%" justifyContent="center" fontFamily="Roboto">
              <Text>Quantity:</Text>
              <NumberInput
                onChange={(qty) => setQuantity(Number(qty))}
                defaultValue={1}
                min={1}
                max={product.availableStock}
                keepWithinRange
                clampValueOnBlur
                borderRadius="none"
              >
                <NumberInputField />
                <NumberInputStepper borderRadius="none">
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </HStack>
            <Button
              variant="buttonBlack"
              onClick={() => handleAddToCart(product.id, quantity)}
              isDisabled={
                !profile?.is_verified || product.availableStock <= "0"
              }
              width="100%"
            >
              {product.availableStock > "0" ? "Add to cart" : "Out of stock"}
            </Button>
            <Text>Available products: {product.availableStock} Pcs</Text>
          </VStack>
        </Flex>
      </div>
    </>
  );
}
