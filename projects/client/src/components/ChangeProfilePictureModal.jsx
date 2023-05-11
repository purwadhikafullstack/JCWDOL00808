import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, FormControl, FormErrorMessage, Image, Flex, Box, Input, FormLabel } from "@chakra-ui/react";

const ChangeImageModal = ({ isOpen, onClose, adminId, onAdminPatch }) => {
  const toast = useToast();
  const [localImage, setLocalImage] = useState("");

  const formik = useFormik({
    initialValues: {
      profile_picture: null,
    },
    validationSchema: Yup.object({
      profile_picture: Yup.mixed()
        .test("fileType", "Invalid image format", (value) => {
          if (value && value.length) {
            const fileType = value[0].type;
            return fileType === "image/png" || fileType === "image/jpg" || fileType === "image/jpeg";
          }
          return true;
        })
        .required("Image is required"),
    }),
    onSubmit: async (values) => {
      try {
        await patchAdminImage(values);
      } catch (error) {
        toast({
          title: `${error.response.data.message}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });

  const patchAdminImage = async (values) => {
    try {
      const formData = new FormData();
      if (values.profile_picture) {
        formData.append("profile_picture", values.profile_picture[0]);
      }

      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/admin/patchAdminImage/${adminId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onClose();
      formik.resetForm();
      onAdminPatch();
      toast({
        title: `Profile picture updated successfully`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: `${error.response.data.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        setLocalImage(e.target.result);
      };

      reader.readAsDataURL(file);
      formik.setFieldValue("profile_picture", event.currentTarget.files);
    } else {
      formik.setFieldValue("profile_picture", null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change Profile Picture</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={formik.handleSubmit}>
            <FormControl isInvalid={formik.touched.profile_picture && formik.errors.profile_picture}>
              <FormLabel>Select a new profile picture:</FormLabel>
              <Flex>
                <Box>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      formik.setFieldValue("profile_picture", event.currentTarget.files);
                      handleImageChange(event);
                    }}
                  />
                  {localImage && (
                    <Box mt={2}>
                      <Image src={localImage} alt="Admin" objectFit="contain" w="100%" maxH="200px" />
                    </Box>
                  )}
                  <FormErrorMessage>{formik.errors.profile_picture}</FormErrorMessage>
                </Box>
              </Flex>
            </FormControl>
            <Button type="submit" mt={4}>
              Upload
            </Button>
            <Button
              onClick={() => {
                onClose();
                // setImage("");
                setLocalImage("");
              }}
              mt={4}
              ml={2}
            >
              Cancel
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChangeImageModal;
