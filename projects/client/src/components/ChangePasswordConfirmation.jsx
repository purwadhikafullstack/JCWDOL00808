import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

export default function ChangePasswordConfirmation(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  return (
    <>
      <Button
        onClick={onOpen}
        type="submit"
        isLoading={props.isLoading}
        loadingText="Saving"
        bg={"blue.400"}
        color={"white"}
        w="full"
        _hover={{
          bg: "blue.500",
        }}
      >
        Save new password
      </Button>

      <>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Save new password?
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    props.onSave();
                    onClose();
                  }}
                  ml={3}
                >
                  Save
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    </>
  );
}
