import { Box, FormControl, FormLabel, Input, Select, Text, VStack, useToast, FormErrorMessage } from "@chakra-ui/react";
import axios from "axios";
import AddAdminConfirmation from "../../components/AddAdminConfirmation";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const PatchCategoryProduct = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

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
        await patchCategory(values);
      } catch (error) {
        toast({
          title: `${error.message}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/productcategory/productcategory/${id}`);
      const categoryData = response.data;
      console.log(response);
      formik.setValues({
        name: categoryData.name,
        description: categoryData.description,
      });
    } catch (error) {
      toast({
        title: `${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const patchCategory = async (values) => {
    try {
      await axios.patch(`http://localhost:8000/productcategory/patchcategoryproduct/${id}`, values);

      toast({
        title: `Edit Category Success`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
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

  useEffect(() => {
    fetchCategoryData();
  }, []);

  return (
    <Box w="100%" maxW="600px" mx="auto" my="auto" mt="3" mb="10">
      <Text fontSize="xl" fontWeight="bold" mb="4">
        Update Category
      </Text>
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
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          </FormControl>

          <AddAdminConfirmation onSave={formik.handleSubmit} />
        </VStack>
      </form>
    </Box>
  );
};

export default PatchCategoryProduct;
