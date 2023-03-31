import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { userLogin, clearState } from "../../reducers/authSlice";
import { Toaster } from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const { user, isSuccess } = useSelector((state) => state.auth);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setLoginData((prevValues) => {
      return { ...prevValues, [e.target.name]: e.target.value };
    });
  };

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate("/");
        dispatch(clearState());
      }, 2000);
    } else if (user) {
      navigate("/");
    }
  }, [user, isSuccess, navigate, dispatch]);

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          // src={shareVideo}
          data-type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg bg-blackOverlay">
          <div className="w-[396px] mx-auto h-screen">
            <div className="border my-8 pb-6 bg-white border-gray-300">
              <h1 className="text-center text-3xl my-4 py-6">My Store</h1>
              <form className="flex flex-col gap-4">
                <input
                  placeholder="Email"
                  className="bg-gray-50 mx-8 py-1 placeholder:text-xs focus:outline-1 focus:outline-gray-400 placeholder:text-gray-400 border rounded-sm p-2"
                  type="text"
                  name="email"
                  onChange={changeHandler}
                  required
                />
                <input
                  id="password"
                  placeholder="Password"
                  className="bg-gray-50 mx-8 py-1 placeholder:text-xs focus:outline-1 focus:outline-gray-400 placeholder:text-gray-400 border rounded-sm p-2"
                  type={passwordShown ? "text" : "password"}
                  name="password"
                  onChange={changeHandler}
                  required
                />
                <div className="mx-auto">
                  <input
                    className="mr-1"
                    id="toggle"
                    name="toggle"
                    type="checkbox"
                    onClick={togglePasswordVisiblity}
                  />
                  Show Password
                </div>

                <button
                  className="bg-sky-500 text-center mx-8 text-sm py-1 rounded-sm text-white font-bold"
                  type="button"
                  onClick={() => {
                    // loginUser(loginData.email, loginData.password);
                    dispatch(
                      userLogin({
                        email: loginData.email,
                        password: loginData.password,
                      })
                    );
                  }}
                >
                  Log in
                </button>
              </form>

              <h1
                className="text-center mt-12 text-xs text-indigo-900 cursor-pointer"
                onClick={() => navigate("/user/reset-password")}
              >
                Forgot password?
              </h1>
            </div>
            <div className="border bg-white text-center py-4 border-gray-300 ">
              <h1 className="text-sm">
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/user/register")}
                  className="text-sky-500 font-bold cursor-pointer"
                >
                  Sign up
                </span>
              </h1>
            </div>
            <div>
              {/* <h1 className="text-center py-4 text-sm">Get the app.</h1> */}
              <div className="flex scale-50 gap-6 justify-evenly">
                {/* <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/320px-Download_on_the_App_Store_Badge.svg.png" />{" "}
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/320px-Google_Play_Store_badge_EN.svg.png" /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Login;
