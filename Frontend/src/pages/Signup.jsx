import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Image } from "../components/Image";
import { useEffect, useState } from "react";
import { getme } from "../utils/getme";
import axios from "axios";
import { Loader } from "../components/Loader";
import { useDispatch } from "react-redux";
import { resetVerifyOtpPage, setVerifyOtpPage } from "../redux/verifyOtpSlice";
import { setUser } from "../redux/userSlice";
import { backend_url } from "../../config";

export const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isPageLoading, setPageLoading] = useState(true);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();

  const handlePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const onSubmit = async (data) => {
    try {
      setIsButtonLoading(true);
      setError("");
      const res = await axios.post(
        `${backend_url}/user/signup`,
        data
      );

      if (res.data.message) {
        dispatch(
          setUser({
            userId: res.data.userId,
            userEmail: res.data.userEmail,
            userName: res.data.userName,
            userRole: res.data.userRole,
          })
        );
        setIsButtonLoading(false);
        dispatch(setVerifyOtpPage());
        navigate("/verify-otp");
      }
    } catch (error) {
      setError(
        error.response.data.error || "An error occurred. Please try again."
      );
      setIsButtonLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = (await getme()).success;
      if (isAuthenticated) {
        navigate("/dashboard");
      }
      setPageLoading(false);
    };

    checkAuth();
    dispatch(resetVerifyOtpPage);
  }, [navigate]);

  return isPageLoading ? (
    <div className="bg-black flex justify-center items-center h-screen">
      <Loader size="lg" />
    </div>
  ) : (
    <div className="grid md:grid-cols-2 items-center">
      <div className="hidden md:block">
        <Image />
      </div>
      <div className="flex flex-col h-screen justify-center items-center">
        <h2 className="font-bold text-3xl">Sign up</h2>
        <span>Create your Indigo Hack account</span>
        <form
          className="flex flex-col mt-10 w-7/12"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Harsh"
            className="border border-gray-400 p-2 my-2 rounded-lg"
            {...register("name", {
              required: "Name is required",
            })}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="abc@gmail.com"
            className="border border-gray-400 p-2 my-2 rounded-lg"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          <label htmlFor="password">Password</label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="********"
              className="border border-gray-400 p-2 my-2 rounded-lg w-full"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
            <i
              className={`bx ${
                isPasswordVisible ? "bx-show" : "bx-hide"
              } absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl`}
              onClick={handlePasswordVisibility}
            ></i>
          </div>
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}

          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-black text-white p-2 my-2 rounded-lg flex justify-center hover:bg-gray-900"
          >
            {isButtonLoading ? <Loader size="sm" /> : "Sign Up"}
          </button>

          <Link to="/signin" className="underline mt-2">
            Already have an account? Sign In
          </Link>
        </form>
      </div>
    </div>
  );
};
