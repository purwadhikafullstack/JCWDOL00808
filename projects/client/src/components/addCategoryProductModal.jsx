import { useState } from "react";
import { Box, FormControl, FormErrorMessage, Flex, FormLabel, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, VStack, useToast, Button, Text } from "@chakra-ui/react";
import axios from "axios";
import AddCategoryConfirmation from "./AddConfirmation";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddCategoryProductModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Category Name is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        await registerCategory(values);
        setIsSubmitting(false);
        formik.resetForm();
      } catch (error) {
        setIsSubmitting(false);
        toast({
          title: `${error.message}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });

  const registerCategory = async (values) => {
    try {
      await axios.post("http://localhost:8000/productcategory/addcategoryproduct", values);
      toast({
        title: `Add Category Success`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      onClose();
      navigate("/admin/managecategory");
    } catch (error) {
      toast({
        title: `${error.response.data.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay  />
        <ModalContent>
          <ModalHeader>Add Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" maxW="600px" mx="auto" my="auto" mt="3" mb="10">
              {/* <Text fontSize="xl" fontWeight="bold" mb="4">
                Register Category
              </Text> */}
              <form onSubmit={formik.handleSubmit}>
                <VStack spacing="1" align="stretch">
                  <FormControl id="name" isRequired isInvalid={formik.touched.name && formik.errors.name}>
                    <FormLabel>Category Name</FormLabel>
                    <Input type="text" {...formik.getFieldProps("name")} placeholder="Input Category" />
                    <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl id="description" isRequired isInvalid={formik.touched.description && formik.errors.description}>
                    <FormLabel>Description</FormLabel>
                    <Input type="text" {...formik.getFieldProps("description")} placeholder="Input Description" />
                    <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
                  </FormControl>

                  {/* button for cancel and submit */}
                  <Flex justifyContent="flex-end">
                    <Button
                      variant="ghost"
                      mr={1}
                      onClick={() => {
                        onClose();
                        formik.resetForm();
                      }}
                    >
                      Cancel
                    </Button>

                    <AddCategoryConfirmation onSave={formik.handleSubmit} isLoading={isSubmitting} />
                  </Flex>
                </VStack>
              </form>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddCategoryProductModal;
