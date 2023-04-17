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
        variant="buttonBlack"
        w="full">
        Save New Password
      </Button>

      <>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader
                fontFamily="Oswald"
                fontSize="lg"
                fontWeight="bold">
                Save new password?
              </AlertDialogHeader>

              <AlertDialogBody fontFamily="Roboto">
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button variant="buttonWhite" ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="buttonBlack"
                  onClick={() => {
                    props.onSave();
                    onClose();
                  }}
                  ml={3}>
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
