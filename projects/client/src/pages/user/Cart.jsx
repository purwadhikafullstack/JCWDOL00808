import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import DeleteProductAlert from "../../components/DeleteProductAlert";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import {
  cartSelector,
  deleteProduct,
  getCarts,
  getTotalPriceInCart,
  getTotalProductsInCart,
  updateCarts,
} from "../../reducers/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const carts = useSelector(cartSelector.selectAll);
  const subtotal = useSelector(getTotalPriceInCart);
  const totalProductsInCart = useSelector(getTotalProductsInCart);
  const [defaultValue, setDefaultValue] = useState({});
  const navigate = useNavigate();

  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct(id));
  };

  const handleUpdateQuantity = (event, id) => {
    const inputValue = parseInt(event.target.value || 0, 10);
    const minValue = parseInt(event.target.min, 10);
    const maxValue = parseInt(event.target.max, 10);

    // Ensure inputValue is within the min and max range
    let newValue = inputValue;
    if (inputValue < minValue) {
      newValue = minValue;
    } else if (inputValue > maxValue) {
      newValue = maxValue;
    }

    // Update the input value to show the reverted value
    event.target.value = newValue;

    // Dispatch the action after reverting the value
    dispatch(
      updateCarts({
        id,
        quantity: newValue,
      })
    );
  };

  useEffect(() => {
    dispatch(getCarts());
  }, [navigate, dispatch]);

  useEffect(() => {
    const defaultValues = {};
    carts.forEach((cart) => {
      defaultValues[cart.id] = cart.quantity;
    });
    setDefaultValue(defaultValues);
  }, [carts]);

  return (
    <>
      <div className="flex flex-col justify-between w-full">
        <div className="bg-white py-5">
          <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
          <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
            <div className="rounded-lg md:w-2/3">
              {carts.length !== 0 ? (
                carts.map((cart, index) => {
                  return (
                    <div
                      key={index}
                      className="justify-between border border-gray-200 mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
                    >
                      <img
                        onClick={() =>
                          navigate(`/product-details/${cart.product.id}`)
                        }
                        src={`${process.env.REACT_APP_API_BASE_URL}/${cart.product.imageUrl}`}
                        alt={cart.product.name}
                        className="w-full rounded-lg sm:w-40"
                      />
                      <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                        <div className="mt-5 sm:mt-0">
                          <h2
                            onClick={() =>
                              navigate(`/product-details/${cart.product.id}`)
                            }
                            className="text-lg font-bold text-gray-900"
                          >
                            {cart.product?.name}
                          </h2>
                          <p className="mt-1 text-xs text-gray-700 text-left">
                            Weight:{" "}
                            {(
                              cart.quantity * cart.product.weight
                            ).toLocaleString("ID")}{" "}
                            grams
                          </p>
                          <p className="mt-1 text-xs text-gray-700 text-left">
                            Stocks: {cart.product.totalStock} Pcs
                          </p>
                        </div>
                        <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                          <div className="flex items-center justify-end border-gray-100">
                            {cart.quantity === 1 ? (
                              <DeleteProductAlert
                                type={2}
                                id={cart.id}
                                func={handleDeleteProduct}
                              />
                            ) : (
                              <button
                                onClick={() =>
                                  dispatch(
                                    updateCarts({
                                      id: cart.id,
                                      quantity: cart.quantity - 1,
                                    })
                                  )
                                }
                                className="cursor-pointer font-bold rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"
                              >
                                {" "}
                                -{" "}
                              </button>
                            )}

                            <input
                              className="h-8 w-8 border bg-white text-center text-xs outline-none"
                              type="number"
                              defaultValue={defaultValue[cart.id]}
                              onBlur={(event) => {
                                handleUpdateQuantity(event, cart.id);
                              }}
                              min={1}
                              max={cart.product.totalStock}
                            />
                            <button
                              disabled={
                                cart.quantity ===
                                parseInt(cart.product.totalStock)
                              }
                              onClick={() =>
                                dispatch(
                                  updateCarts({
                                    id: cart.id,
                                    quantity: cart.quantity + 1,
                                  })
                                )
                              }
                              className="cursor-pointer font-bold rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 enabled:hover:text-blue-50 disabled:text-gray-100 disabled:bg-gray-100"
                            >
                              {" "}
                              +{" "}
                            </button>
                          </div>
                          <div className="flex md:flex-col items-center space-x-4">
                            <p className="text-sm">
                              {(
                                cart.product.price * cart.quantity
                              ).toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              })}
                            </p>
                            <DeleteProductAlert
                              type={1}
                              id={cart.id}
                              func={handleDeleteProduct}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col col-span-4 justify-center items-center my-4">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    No product in your cart
                  </h1>
                  <p className="text-gray-700 text-lg mb-8">
                    Continue shopping and add some product to cart
                  </p>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => navigate("/")}
                  >
                    Go Shopping
                  </button>
                </div>
              )}
            </div>
            <div
              className={`sticky top-[5.7rem] mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3 ${
                carts.length === 0 ? "hidden" : null
              }`}
            >
              <div className="mb-2 flex justify-between">
                <p className="text-gray-700">
                  Subtotal ({totalProductsInCart} items)
                </p>
                <p className="text-gray-700">
                  {subtotal.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </p>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between">
                <p className="text-lg font-bold">Subtotal</p>
                <div className="">
                  <p className="mb-1 text-lg font-bold">
                    {subtotal.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </p>
                </div>
              </div>
              <Link to="/user/checkout">
                <button className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">
                  Check out
                </button>
              </Link>
            </div>
          </div>
        </div>
        <ScrollToTopButton />
      </div>
    </>
  );
}
