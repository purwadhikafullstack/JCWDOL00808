import { useEffect, useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { isAuth } from "../apis/userAPIs";
import Big4Logo from "../assets/Big4Logo.svg";
import { getCarts, getTotalProductsInCart } from "./../reducers/cartSlice";
import AvatarButton from "./AvatarButton";
import HamburgerMenuButton from "./HamburgerMenu";
import LoginModal from "../pages/user/LoginModal";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

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
      isAuth().then((data) => setProfile(data));
    }
  }, [token, dispatch, navigate]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <nav
        className="bg-black mb-1 px-2 sm:px-4 py-2.5 dark:bg-gray-900 w-full border-b border-gray-200 dark:border-gray-600" /* fixed z-20 top-0 left-0 */
      >
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <Link to="/" className="flex items-center">
            <img
              src={Big4Logo}
              className="h-12 mr-3 sm:h-14 dark:invert invert"
              alt="Big4Commerce Logo"
            />
          </Link>
          <div className="flex md:order-2 items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="w-4 h-4 text-gray-500" />
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
                className="font-[Roboto] md:block md:w-full w-28 mr-4 p-1 pl-10 text-sm text-gray-900 border border-gray-300 rounded-none bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
              />
            </div>
            {profile ? (
              <div className="grid grid-cols-2 gap-1 place-items-center">
                <Link to={"/user/cart"}>
                  <div className="relative">
                    <FaShoppingCart className="dark:text-white text-2xl hover:text-gray-700 active:text-black invert" />
                    <p className="absolute -top-2 -right-2 md:-right-2 text-white text-xs font-medium bg-red-600 rounded-full py-0.5 px-1 border border-white dark:border-gray-900">
                      {totalProductsInCart}
                    </p>
                  </div>
                </Link>
                <AvatarButton profile={profile} />
              </div>
            ) : (
              <Link to="/user/register">
                <Button
                  type="button"
                  variant="buttonBlack"
                  className="rounded-none font-[Oswald] hidden md:flex text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium  text-sm px-5 py-2.5 text-center mr-3 ml-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Create account
                </Button>
              </Link>
            )}

            <HamburgerMenuButton profile={profile} />
          </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
            <ul className="font-[Oswald] flex text-white flex-col p-1 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 ">
              <li>
                <Link
                  to="/"
                  className="hover:border-b-2  border-red-500 block py-2 pl-3 pr-4 text-md mx-2 rounded-none hover:bg-gray-100 md:hover:bg-transparent md:hover:text-gray-400 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  aria-current="page">
                  HOME
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:border-b-2  border-red-500 block py-2 pl-3 pr-4 text-md mx-2 rounded-none hover:bg-gray-100 md:hover:bg-transparent md:hover:text-gray-400 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                  ABOUT
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:border-b-2  border-red-500 block py-2 pl-3 pr-4 text-md mx-2 rounded-none hover:bg-gray-100 md:hover:bg-transparent md:hover:text-gray-400 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                  CONTACT
                </Link>
              </li>
              {profile ? null : (
                <li>
                  <button
                    onClick={onOpen}
                    className="hover:border-b-2  border-red-500 block py-2 pl-3 pr-4 text-md mx-2 rounded-none hover:bg-gray-100 md:hover:bg-transparent md:hover:text-gray-400 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                    LOGIN
                  </button>
                </li>
              )}
            </ul>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent className="w-min rounded-none">
                <ModalCloseButton />
                <ModalBody className="rounded-none">
                  <LoginModal onClose={onClose} />
                </ModalBody>
                <ModalFooter></ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </div>
      </nav>
    </>
  );
}
