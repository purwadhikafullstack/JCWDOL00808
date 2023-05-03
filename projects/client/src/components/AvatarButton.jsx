import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Avatar } from "@chakra-ui/react";
import { logout } from "../apis/userAPIs";

function AvatarButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleMenuClick() {
    setIsOpen(!isOpen);
  }

  return (
    <div>
      <Avatar
        onClick={handleMenuClick}
        cursor="context-menu"
        display={{ base: "none", sm: "block" }}
        size="md"
        name={props.profile.full_name}
        src={
          props.profile.profile_picture
            ? `${process.env.REACT_APP_API_BASE_URL}/${props.profile.profile_picture}`
            : null
        }
        className="border dark:border-white"
      />

      {isOpen && (
        <>
          {props.profile ? (
            <div className="absolute top-5 right-0 z-50 w-48 mt-12 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900 font-[Oswald]">
                  Signed in as
                </p>
                <p className="text-sm font-medium text-gray-900 font-[Oswald]">
                  {props.profile.email}
                </p>
              </div>
              <div className="py-1">
                <Link
                  to="/user/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-[Roboto]">
                  Edit Profile
                </Link>
                <Link
                  to="/user/address"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-[Roboto]">
                  Edit Address
                </Link>
                <Link
                  to="/user/order-list"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-[Roboto]">
                  My Transaction
                </Link>
                <span
                  onClick={() => {
                    logout(navigate, dispatch);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-[Roboto]">
                  Logout
                </span>
              </div>
            </div>
          ) : (
            <div className="absolute top-0 right-0 z-50 w-48 mt-12 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-1">
                <Link
                  to="/user/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-[Roboto]">
                  Sign in as user
                </Link>
              </div>
              <div className="py-1">
                <Link
                  to="/admin/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-[Roboto]">
                  Sign in as admin
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AvatarButton;
