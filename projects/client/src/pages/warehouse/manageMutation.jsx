import { useState, useEffect } from "react";
import { FormControl, FormLabel, useToast, Input, Textarea, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Flex, Button, Box, Image, FormErrorMessage, Select } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AddAdminConfirmation from "../../components/AddAdminConfirmation";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  from_warehouse_id: Yup.number().min(1, "please select warehouse").required("Warehouse Name is required"),
  to_warehouse_id: Yup.number().min(1, "please select warehouse").required("Warehouse Name is required"),
  quantity: Yup.number().min(0, "Price must be greater than or equal to 0").required("quantity is required"),
  products_id: Yup.number().min(1, "Please select a product name").required("Product name is required"),
});

const StockMutations = () => {
  const [products, setProduct] = useState([]);
  const [warehouse, setWarehouse] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      from_warehouse_id: "",
      to_warehouse_id: "",
      quantity: 0,
      products_id: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        await axios.post("http://localhost:8000/mutations/request-stock", values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setIsSubmitting(false);
        formik.resetForm();
        toast({
          title: `Request Stock Mutation Success`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        // navigate("");
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
    fetchProducts();
    fetchWarehouse();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get(`http://localhost:8000/product/listproduct`);
    setProduct(response.data.result);
  };

  const fetchWarehouse = async () => {
    const response = await axios.get(`http://localhost:8000/warehouses/getAllWarehouse`);
    setWarehouse(response.data);
  };

  return (
    <form onSubmit={formik.handleSubmit} style={{ margin: "auto", width: "30%" }}>
      <FormControl mb={2} mt={3} id="from_warehouse_id" isInvalid={formik.touched.from_warehouse_id && formik.errors.from_warehouse_id}>
        <FormLabel>Select from Warehouse Name</FormLabel>
        <Select placeholder="Select Warehouse name" {...formik.getFieldProps("from_warehouse_id")}>
          {warehouse.map((warehouses) => (
            <option key={warehouses.id} value={warehouses.id}>
              {warehouses.name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{formik.errors.from_warehouse_id}</FormErrorMessage>
      </FormControl>

      <FormControl mb={2} id="to_warehouse_id" isInvalid={formik.touched.to_warehouse_id && formik.errors.to_warehouse_id}>
        <FormLabel>Select to Warehouse Name</FormLabel>
        <Select placeholder="Select Warehouse name" {...formik.getFieldProps("to_warehouse_id")}>
          {warehouse.map((warehouses) => (
            <option key={warehouses.id} value={warehouses.id}>
              {warehouses.name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{formik.errors.to_warehouse_id}</FormErrorMessage>
      </FormControl>

      <FormControl mb={2} id="quantity" isInvalid={formik.touched.quantity && formik.errors.quantity}>
        <FormLabel>quantity</FormLabel>
        <NumberInput min={0} {...formik.getFieldProps("quantity")} onChange={(value) => formik.setFieldValue("quantity", value)}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>{formik.errors.quantity}</FormErrorMessage>
      </FormControl>

      <FormControl mb={2} id="products_id" isInvalid={formik.touched.products_id && formik.errors.products_id}>
        <FormLabel>Product Name</FormLabel>
        <Select placeholder="Select Product Name" {...formik.getFieldProps("products_id")}>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{formik.errors.products_id}</FormErrorMessage>
      </FormControl>

      <AddAdminConfirmation onSave={formik.handleSubmit} />
    </form>
  );
};

export default StockMutations;
