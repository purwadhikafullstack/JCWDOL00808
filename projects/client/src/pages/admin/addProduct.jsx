import { useState } from "react";
import { FormControl, FormLabel, Input, Textarea, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Flex, Button, Box, Image, FormErrorMessage } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Product Name is required"),
  description: Yup.string().required("Product Description is required"),
  price: Yup.number().min(0, "Price must be greater than or equal to 0").required("Price is required"),
  weight: Yup.number().min(0, "Weight must be greater than or equal to 0").required("Weight must be filled"),
});

const ProductForm = () => {
  const [image, setImage] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      weight: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // do something with the form data, e.g. submit to a server
      console.log(values);
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setImage(e.target.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={formik.handleSubmit} style={{ margin: "auto", width: "70%" }}>
      <FormControl mb={2} mt="2" isInvalid={formik.errors.name}>
        <FormLabel>Product Name</FormLabel>
        <Input type="text" placeholder="Input Product Name" {...formik.getFieldProps("name")} />
        <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
      </FormControl>

      <FormControl mb={2} isInvalid={formik.errors.description}>
        <FormLabel>Product Description</FormLabel>
        <Textarea placeholder="Input Product Description" {...formik.getFieldProps("description")} />
        <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
      </FormControl>

      <FormControl mb={2} isInvalid={formik.errors.price}>
        <FormLabel>Price</FormLabel>
        <NumberInput min={0} {...formik.getFieldProps("price")} onChange={(value) => formik.setFieldValue("price", value)}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
      </FormControl>

      <FormControl mb={2} isInvalid={formik.errors.weight}>
        <FormLabel>Weight (in gram)</FormLabel>
        <NumberInput min={0} {...formik.getFieldProps("weight")} onChange={(value) => formik.setFieldValue("weight", value)}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>{formik.errors.weight}</FormErrorMessage>
      </FormControl>

      <Box mb={2}>
        <FormLabel>Image Product</FormLabel>
        <Flex>
          <Box w={16} h={16} mr={4}>
            {image && <Image src={image} alt="Produk" />}
          </Box>
          <Box>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </Box>
        </Flex>
      </Box>
      <Button colorScheme="blue" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default ProductForm;
