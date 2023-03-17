import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Box, Flex, Image, Text, VStack } from "@chakra-ui/react";

export default function ProductDetails() {
  const [product, setProduct] = useState({
    id: 1,
    name: "Example Product",
    imageUrl: "https://via.placeholder.com/300",
    description: "This is an example product description.",
    price: 49.99,
  });

  if (!product) {
    return (
      <div className="container flex flex-col justify-between">
        <Navbar />
        <div>Loading...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container flex flex-col justify-between">
      <Navbar />
      <Flex direction="column" alignItems="center" mt={8} mb={8}>
        <Image src={product.imageUrl} boxSize="300px" alt={product.name} />
        <VStack spacing={2} mt={4}>
          <Text fontSize="2xl">{product.name}</Text>
          <Text fontSize="lg" color="gray.500">
            {product.description}
          </Text>
          <Text fontSize="xl" fontWeight="bold">
            ${product.price.toFixed(2)}
          </Text>
        </VStack>
      </Flex>
      <Footer />
    </div>
  );
}
