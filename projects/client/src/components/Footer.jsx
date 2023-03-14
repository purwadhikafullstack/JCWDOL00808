import Big4Logo from "../assets/Big4Logo.svg";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="p-4 bg-white sm:p-6 dark:bg-gray-900">
      <div className="md:flex md:justify-between">
        <div className="mb-6 md:mb-0">
          <a href="/" className="flex items-center">
            <img src={Big4Logo} alt="Big4Logo" className="w-56 h-28 invert" />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-4">
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Menu
            </h2>
            <ul className="text-gray-600 dark:text-gray-400">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  About Us
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Contact Us
                </a>
              </li>
              <li className="mb-4">
                <a href="/user/profile" className="hover:underline">
                  My Account
                </a>
              </li>
              <li>
                <a href="/user/login" className="hover:underline">
                  Login
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Follow us
            </h2>
            <ul className="text-gray-600 dark:text-gray-400">
              <li className="mb-4">
                <a href="http://facebook.com" className="hover:underline ">
                  Facebook
                </a>
              </li>
              <li className="mb-4">
                <a href="http://instagram.com" className="hover:underline ">
                  Instagram
                </a>
              </li>
              <li className="mb-4">
                <a href="http://tiktok.com" className="hover:underline ">
                  Tiktok
                </a>
              </li>
              <li>
                <a href="http://twitter.com" className="hover:underline">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Legal
            </h2>
            <ul className="text-gray-600 dark:text-gray-400">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Cookies Policy
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              Install App
            </h2>
            <ul className="text-gray-600 dark:text-gray-400">
              <li className="mb-2">
                <a href="https://play.google.com/">
                  <img
                    className="w-36 h-16"
                    alt="Get it on Google Play"
                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  />
                </a>
              </li>
              <li>
                <a href="https://apps.apple.com">
                  <img
                    className="w-32 h-14 ml-2"
                    alt="Download on the App Store"
                    src="https://apple-resources.s3.amazonaws.com/media-badges/download-on-the-app-store/black/en-us.svg"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023{" "}
          <a href="/" className="hover:underline">
            Big4Commerce™
          </a>
          . All Rights Reserved.
        </span>
        <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
          <a
            href="http://facebook.com"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <FaFacebook className="w-5 h-5" />
            <span className="sr-only">Facebook page</span>
          </a>
          <a
            href="http://instagram.com"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <FaInstagram className="w-5 h-5" />
            <span className="sr-only">Instagram page</span>
          </a>
          <a
            href="http://twitter.com"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <FaTwitter className="w-5 h-5" />
            <span className="sr-only">Twitter page</span>
          </a>
          <a
            href="http://tiktok.com"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <FaTiktok className="w-5 h-5" />
            <span className="sr-only">Tiktok account</span>
          </a>
          <a
            href="http://youtube.com"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <FaYoutube className="w-5 h-5" />
            <span className="sr-only">Youtube account</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
