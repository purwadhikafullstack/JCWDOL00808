import { useEffect, useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { isAuth } from "../apis/userAPIs";
import Big4Logo from "../assets/Big4Logo.svg";
import { getCarts, getTotalProductsInCart } from "./../reducers/cartSlice";
import AvatarButton from "./AvatarButton";
import HamburgerMenuButton from "./HamburgerMenu";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState(null);
  const totalProductsInCart = useSelector(getTotalProductsInCart);
  const queryParams = new URLSearchParams(window.location.search);
  const search = queryParams.get("search");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(getCarts());
    }
    isAuth(navigate).then((data) => setProfile(data));
  }, [token, dispatch, navigate]);

  return (
    <>
      <nav
        className="bg-gray-300 mb-1 px-2 sm:px-4 py-2.5 dark:bg-gray-900 w-full border-b border-gray-200 dark:border-gray-600" /* fixed z-20 top-0 left-0 */
      >
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <Link to="/" className="flex items-center">
            <img
              src={Big4Logo}
              className="h-12 mr-3 sm:h-14 dark:invert"
              alt="Big4Commerce Logo"
            />
          </Link>
          <div className="flex md:order-2 items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="w-5 h-5 text-gray-500" />
              </div>
              <input
                defaultValue={search}
                onBlur={(event) => {
                  navigate(`/?search=${event.target.value}`);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    navigate(`/?search=${event.target.value}`);
                  }
                }}
                type="search"
                className="md:block md:w-full w-28 mr-4 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
              />
            </div>
            {profile ? (
              <div className="grid grid-cols-2 gap-1 place-items-center">
                <Link to={"/user/cart"}>
                  <div className="relative">
                    <FaShoppingCart className="dark:text-white text-2xl hover:text-slate-300" />
                    <p className="absolute -top-2 -right-2 md:-right-2 text-white text-xs font-medium bg-red-600 rounded-full py-0.5 px-1 border border-white dark:border-gray-900">
                      {totalProductsInCart}
                    </p>
                  </div>
                </Link>
                <AvatarButton profile={profile} />
              </div>
            ) : (
              <Link to="/user/register">
                <button
                  type="button"
                  className="hidden md:flex text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 ml-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Create account
                </button>
              </Link>
            )}

            <HamburgerMenuButton profile={profile} />
          </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
            <ul className="flex flex-col p-1 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link
                  to="/"
                  className="block py-2 pl-3 pr-4 text-lg text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="block py-2 pl-3 pr-4 text-lg text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="block py-2 pl-3 pr-4 text-lg text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Contact
                </Link>
              </li>
              {profile ? null : (
                <li>
                  <Link
                    to="/user/login"
                    className="block py-2 pl-3 pr-4 text-lg text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
