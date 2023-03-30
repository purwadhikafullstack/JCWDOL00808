import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../apis/userAPIs";

function HamburgerMenuButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleMenuClick() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="block text-gray-500 hover:text-white focus:text-white focus:outline-none"
        onClick={handleMenuClick}
      >
        <svg viewBox="0 0 20 20" className="w-8 h-8 fill-current">
          <path
            fillRule="evenodd"
            d="M18 14v1H2v-1h16zm0-5v1H2V9h16zm0-5v1H2V4h16z"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {props.profile ? (
            <div className="absolute top-1 right-0 z-50 w-48 mt-12 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900">
                  Signed in as
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {props.profile.email}
                </p>
              </div>
              <div className="py-1">
                <Link
                  to="/user/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit Profile
                </Link>
                <Link
                  to="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit Address
                </Link>
                <span
                  onClick={() => logout(navigate, dispatch)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </span>
              </div>
            </div>
          ) : (
            <div className="absolute top-0 right-0 z-50 w-48 mt-12 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-1">
                <Link
                  to="/user/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign in as user
                </Link>
              </div>
              <div className="py-1">
                <Link
                  to="/admin/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
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

export default HamburgerMenuButton;
