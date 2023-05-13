import { useToast } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addProduct } from "../reducers/cartSlice";
import { Button } from "@chakra-ui/react";

export const ProductCard = (props) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const { products } = props;

  const handleAddToCart = (products_id, quantity) => {
    // Add the product to the cart with the selected quantity
    dispatch(
      addProduct({
        products_id,
        quantity,
      })
    );
    toast({
      title: "Product added to cart",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col col-span-4 justify-center items-center my-4">
        <h1 className="text-3xl font-[Oswald] text-gray-900 mb-4">
          Product Not Found
        </h1>
        <p className="text-gray-700 text-lg mb-8 font-[Roboto]">
          We're sorry, the product you're looking for cannot be found. Please
          check your keyword or try again later.
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-[Oswald] py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => props.func("")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      {products.map((product) => {
        return (
          <div
            key={product.id}
            className="flex flex-col justify-between md:flex-none w-full max-w-sm bg-white border border-gray-200 rounded-none shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <Link to={`/product-details/${product.id}`}>
              <img
                className="p-4"
                src={`${process.env.REACT_APP_API_BASE_URL}/${product?.imageUrl}`}
                alt={product?.name}
              />
            </Link>
            <div className="px-5 pb-5">
              <Link to={`/product-details/${product.id}`}>
                <h5 className="text-lg font-[Oswald] tracking-tight text-gray-900 dark:text-white">
                  {product?.name}
                </h5>
              </Link>
              <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-3 mt-3">
                <span className="md:col-span-4 text-lg font-[Roboto]  text-gray-900 dark:text-white">
                  {product?.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
                <Button
                  variant="buttonBlack"
                  onClick={() => handleAddToCart(product.id, 1)}
                  isDisabled={
                    !user?.is_verified || product?.availableStock === "0"
                  }
                  className="md:col-span-3 text-white bg-blue-700 hover:bg-blue-700 active:bg-blue-900  rounded-sm text-md px-2 py-2 text-center dark:bg-blue-600 enabled:dark:hover:bg-blue-700 enabled:dark:active:bg-blue-900 disabled:dark:bg-gray-700 disabled:cursor-not-allowed disabled:dark:text-black disabled:bg-blue-300 disabled:text-white"
                >
                  {product?.availableStock !== "0"
                    ? "Add to cart"
                    : "Out of stock"}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
