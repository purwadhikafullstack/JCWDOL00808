import Big4Logo from "../assets/Big4Logo.svg";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="p-4 bg-white sm:p-6 dark:bg-gray-900">
      <div className="md:flex md:justify-between">
        <div className="mb-6 md:mb-0">
          <Link to="/" className="flex items-center">
            <img
              src={Big4Logo}
              alt="Big4Logo"
              className="w-56 h-28 dark:invert"
            />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-4">
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Menu
            </h2>
            <ul className="text-gray-600 dark:text-gray-400">
              <li className="mb-4">
                <Link to="#" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li className="mb-4">
                <Link to="#" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/user/profile" className="hover:underline">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/user/login" className="hover:underline">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Follow us
            </h2>
            <ul className="text-gray-600 dark:text-gray-400">
              <li className="mb-4">
                <Link
                  to="http://facebook.com"
                  target="_blank"
                  className="hover:underline "
                >
                  Facebook
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="http://instagram.com"
                  target="_blank"
                  className="hover:underline "
                >
                  Instagram
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="http://tiktok.com"
                  target="_blank"
                  className="hover:underline "
                >
                  Tiktok
                </Link>
              </li>
              <li>
                <Link
                  to="http://twitter.com"
                  target="_blank"
                  className="hover:underline"
                >
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Legal
            </h2>
            <ul className="text-gray-600 dark:text-gray-400">
              <li className="mb-4">
                <Link to="#" className="hover:underline">
                  Cookies Policy
                </Link>
              </li>
              <li className="mb-4">
                <Link to="#" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Install App
            </h2>
            <ul className="text-gray-600 dark:text-gray-400">
              <li className="mb-2">
                <Link to="https://play.google.com/" target="_blank">
                  <img
                    className="w-32 h-14 ml-2"
                    alt="Get it on Google Play"
                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  />
                </Link>
              </li>
              <li>
                <Link to="https://apps.apple.com" target="_blank">
                  <img
                    className="w-28 h-14 ml-4"
                    alt="Download on the App Store"
                    src="https://apple-resources.s3.amazonaws.com/media-badges/download-on-the-app-store/black/en-us.svg"
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023{" "}
          <Link to="/" className="hover:underline">
            Big4Commerce™
          </Link>
          . All Rights Reserved.
        </span>
        <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
          <Link
            to="http://facebook.com"
            target="_blank"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <FaFacebook className="w-5 h-5" />
            <span className="sr-only">Facebook page</span>
          </Link>
          <Link
            to="http://instagram.com"
            target="_blank"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <FaInstagram className="w-5 h-5" />
            <span className="sr-only">Instagram page</span>
          </Link>
          <Link
            to="http://twitter.com"
            target="_blank"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <FaTwitter className="w-5 h-5" />
            <span className="sr-only">Twitter page</span>
          </Link>
          <Link
            to="http://tiktok.com"
            target="_blank"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <FaTiktok className="w-5 h-5" />
            <span className="sr-only">Tiktok account</span>
          </Link>
          <Link
            to="http://youtube.com"
            target="_blank"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <FaYoutube className="w-5 h-5" />
            <span className="sr-only">Youtube account</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
