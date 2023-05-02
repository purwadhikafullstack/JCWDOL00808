import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function AdminWarehouseNotFound() {
  const navigate = useNavigate();
  return (
    <Box textAlign="center" py={10} px={6} minH={"18.5rem"} w={"full"}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, teal.400, teal.600)"
        backgroundClip="text"></Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Not assigned to any warehouse
      </Text>
      <Text color={"gray.500"} mb={6}>
        Ask your admin to assign you to a warehouse
      </Text>

      <Button
        onClick={() => navigate(-1)}
        colorScheme="teal"
        bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
        color="white"
        variant="solid">
        Go Back
      </Button>
    </Box>
  );
}
