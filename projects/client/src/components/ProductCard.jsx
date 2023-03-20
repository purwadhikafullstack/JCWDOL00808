import { Button, CircularProgress } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export const ProductCard = (props) => {
  const { products } = props;
  const [profile, setProfile] = useState(null);

  // const handleAddToCart = () => {
  //   // Add the product to the cart with the selected quantity
  // };

  useEffect(() => {
    setProfile(JSON.parse(localStorage.getItem("user")));
  }, []);

  if (!props) {
    return (
      <div classNameName="my-8">
        <CircularProgress isIndeterminate color="blue" />
      </div>
    );
  }

  return (
    <>
      {products.map((product) => {
        return (
          <div
            key={product.id}
            className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
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
                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {product?.name}
                </h5>
              </Link>

              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-3 mt-3">
                <span className="text-md font-bold text-gray-900 dark:text-white">
                  {product?.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </span>
                <button
                  disabled={!profile?.is_verified || product.totalStock === "0"}
                  className="text-white bg-blue-700 hover:bg-blue-700 active:bg-blue-900 font-medium rounded-lg text-sm px-2 py-2 text-center dark:bg-blue-600 enabled:dark:hover:bg-blue-700 enabled:dark:active:bg-blue-900 disabled:dark:bg-gray-700 disabled:cursor-not-allowed disabled:dark:text-black disabled:bg-blue-300 disabled:text-white"
                >
                  {product.totalStock !== "0" ? "Add to cart" : "Out of stock"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
