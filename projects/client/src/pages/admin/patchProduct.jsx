import { useState, useEffect } from "react";
import { FormControl, FormLabel, useToast, Input, Textarea, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Flex, Button, Box, Image, FormErrorMessage, Select } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AddAdminConfirmation from "../../components/AddAdminConfirmation";
import { useNavigate, useParams } from "react-router-dom";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Product Name is required"),
  description: Yup.string().required("Product Description is required"),
  price: Yup.number().min(0, "Price must be greater than or equal to 0").required("Price is required"),
  weight: Yup.number().min(0, "Weight must be greater than or equal to 0").required("Weight must be filled"),
  product_categories_id: Yup.number().min(1, "Please select a product category").required("Product Category is required"),
  imageUrl: Yup.mixed()
    .test("fileType", "Invalid image format", (value) => {
      if (value && value.length) {
        const fileType = value[0].type;
        return fileType === "image/png" || fileType === "image/jpg" || fileType === "image/jpeg";
      }
      return true;
    })
    .required("Image is required"),
});

const PatchProductForm = () => {
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      weight: 0,
      product_categories_id: "",
      image: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("weight", values.weight);
      formData.append("imageUrl", values.imageUrl[0]);
      formData.append("product_categories_id", values.product_categories_id);

      try {
        await axios.post("http://localhost:8000/product/addproduct", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setIsSubmitting(false);
        formik.resetForm();
        setImage("");
        toast({
          title: `Add Product Success`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        navigate("/admin/manageProducts");
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

  useEffect(() => {
    fetchCategories();
    fetchProductData();
  }, []);

  const fetchCategories = async () => {
    const response = await axios.get(`http://localhost:8000/productcategory/listproductcategory`);
    setCategories(response.data.result);
  };

  const fetchProductData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/product/productId/${id}`);
      const productData = response.data;
      console.log(response);
      formik.setValues({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        weight: productData.weight,
        imageUrl: productData.imageUrl,
        product_categories_id: productData.product_categories_id,
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setImage(e.target.result);
      // formik.setFieldValue("image", e.terget.result); // set image field value
    };

    reader.readAsDataURL(file);
    formik.setFieldValue("imageUrl", event.currentTarget.files);
  };

  return (
    <form onSubmit={formik.handleSubmit} style={{ margin: "auto", width: "70%" }}>
      <FormControl mb={2} mt="2" id="name" isInvalid={formik.touched.name && formik.errors.name}>
        <FormLabel>Product Name</FormLabel>
        <Input type="text" placeholder="Input Product Name" {...formik.getFieldProps("name")} />
        <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
      </FormControl>

      <FormControl mb={2} id="product_categories_id" isInvalid={formik.touched.product_categories_id && formik.errors.product_categories_id}>
        <FormLabel>Product Category</FormLabel>
        <Select placeholder="Select Product Category" {...formik.getFieldProps("product_categories_id")}>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{formik.errors.product_categories_id}</FormErrorMessage>
      </FormControl>

      <FormControl mb={2} id="description" isInvalid={formik.touched.description && formik.errors.description}>
        <FormLabel>Product Description</FormLabel>
        <Textarea placeholder="Input Product Description" {...formik.getFieldProps("description")} />
        <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
      </FormControl>

      <FormControl mb={2} id="price" isInvalid={formik.touched.price && formik.errors.price}>
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

      <FormControl mb={2} id="weight" isInvalid={formik.touched.weight && formik.errors.weight}>
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
            <Input type="file" accept="image/*" onChange={handleImageChange} isInvalid={formik.touched.image && formik.errors.image} />
            <FormErrorMessage>{formik.errors.image}</FormErrorMessage>
          </Box>
        </Flex>
      </Box>
      <AddAdminConfirmation onSave={formik.handleSubmit} />
    </form>
  );
};

export default PatchProductForm;
