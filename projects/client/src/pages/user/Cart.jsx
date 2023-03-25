import { isAuth } from "../../apis/userAPIs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSelector, useDispatch } from "react-redux";
import {
  getCarts,
  updateCarts,
  deleteCarts,
  cartSelector,
} from "../../reducers/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const carts = useSelector(cartSelector.selectAll);
  const navigate = useNavigate();

  useEffect(() => {
    isAuth(navigate, true);
    dispatch(getCarts());
  }, [navigate, dispatch]);

  return (
    <>
      <div className="container flex flex-col justify-between">
        <Navbar />
        <div className=" bg-gray-100 py-16">
          <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
          <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
            <div className="rounded-lg md:w-2/3">
              {carts.map((cart, index) => {
                return (
                  <div
                    key={index}
                    className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
                  >
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}/${cart.product.imageUrl}`}
                      alt={cart.product.name}
                      className="w-full rounded-lg sm:w-40"
                    />
                    <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                      <div className="mt-5 sm:mt-0">
                        <h2 className="text-lg font-bold text-gray-900">
                          {cart.product?.name}
                        </h2>
                        <p className="mt-1 text-xs text-gray-700">
                          {cart.product.weight}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                        <div className="flex items-center justify-end border-gray-100">
                          <span
                            onClick={() =>
                              dispatch(
                                updateCarts({
                                  id: cart.id,
                                  quantity: cart.quantity - 1,
                                })
                              )
                            }
                            className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"
                          >
                            {" "}
                            -{" "}
                          </span>
                          <input
                            className="h-8 w-8 border bg-white text-center text-xs outline-none"
                            type="number"
                            value={cart.quantity}
                            onChange={(e) =>
                              dispatch(
                                updateCarts({
                                  id: cart.id,
                                  quantity: parseInt(e.target.value, 10),
                                })
                              )
                            }
                            min="1"
                          />
                          <span
                            onClick={() =>
                              dispatch(
                                updateCarts({
                                  id: cart.id,
                                  quantity: cart.quantity + 1,
                                })
                              )
                            }
                            className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"
                          >
                            {" "}
                            +{" "}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="text-sm">
                            {(
                              cart.product.price * cart.quantity
                            ).toLocaleString("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            })}
                          </p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="sticky top-[4.7rem] mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
              <div className="mb-2 flex justify-between">
                <p className="text-gray-700">Subtotal</p>
                <p className="text-gray-700">Rp 200.000,00</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-700">Shipping</p>
                <p className="text-gray-700">Rp 15.000,00</p>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between">
                <p className="text-lg font-bold">Total</p>
                <div className="">
                  <p className="mb-1 text-lg font-bold">Rp 215.000,00</p>
                </div>
              </div>
              <button className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">
                Check out
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
