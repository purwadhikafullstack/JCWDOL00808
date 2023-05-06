import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export default function SendOrderModal(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const toast = useToast();
  const { orders_id } = props;

  const sendOrder = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/cart/order/${orders_id}`,
        null,
        { headers: { Authorization: token } }
      );
      setIsLoading(false);
      toast({
        title: response?.data?.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      props.func();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: error?.response?.data?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button
        // isDisabled={props.orders_status !== "On Process"}
        display={props.orders_status !== "On Process" ? "none" : "block"}
        size="sm"
        mr={2}
        _hover={{ bg: "green.600" }}
        colorScheme="green"
        onClick={onOpen}
      >
        Send Order
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Do you want to send this order? Please make sure all the products
            are available before sending.
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={isLoading}
              onClick={() => {
                sendOrder();
                onClose();
              }}
              colorScheme="blue"
              variant="solid"
            >
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
