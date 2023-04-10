import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  return (
    <Box textAlign="center" py={10} px={6} minH={"18.5rem"}>
      <Heading display="inline-block" as="h2" size="2xl" bgGradient="linear(to-r, teal.400, teal.600)" backgroundClip="text">
        Big4Commerce.com
      </Heading>
      <Text fontSize="18px" mt={5} mb={2}>
        Dashboard Page
      </Text>
      {/* <Text color={"gray.500"} mb={6}>
        The page you're looking is Dashboard
      </Text> */}
    </Box>
  );
}
