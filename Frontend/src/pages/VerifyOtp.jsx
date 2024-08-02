import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { selectUserEmail } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "../components/Loader";
import { Image } from "../components/Image";
import {
  resetVerifyOtpPage,
  selectVerifyOtpPage,
} from "../redux/verifyOtpSlice";
import { toast } from "react-toastify";
import { backend_url } from "../../config";

export const VerifyOtp = () => {
  const [error, setError] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const userEmail = useSelector(selectUserEmail);
  const verifyOtpPage = useSelector(selectVerifyOtpPage);

  const onSubmit = async (data) => {
    try {
      const payload = {
        email: userEmail,
        otp: data.otp,
      };
      setIsButtonLoading(true);
      setError("");
      const res = await axios.post(
      `${backend_url}/user/verify-otp`,
        payload
      );
      if (res.data.isVerified) {
        setIsButtonLoading(false);
        dispatch(resetVerifyOtpPage);
        toast.success("OTP verified successfully, Please Log in");
        navigate("/signin");
      }
    } catch (error) {
      setError(
        error.response?.data?.error || "An error occurred. Please try again."
      );
      setIsButtonLoading(false);
    }
  };

  useEffect(() => {
    if (!verifyOtpPage) navigate("/signup");
  });

  return (
    <div className="grid md:grid-cols-2 items-center">
      <div className="hidden md:block">
        <Image />
      </div>
      <div className="flex flex-col h-screen justify-center items-center">
        <h2 className="font-bold text-3xl">Verify OTP</h2>
        <span>An OTP is sent to your email! Please verify</span>
        <form
          className="flex flex-col mt-10 w-7/12"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="otp">OTP</label>
          <input
            id="otp"
            name="otp"
            type="text"
            maxLength={6}
            placeholder="123456"
            className="border border-gray-400 p-2 my-2 rounded-lg"
            {...register("otp", {
              required: "OTP is required",
              minLength: {
                value: 6,
                message: "OTP must be at least 6 digits",
              },
              pattern: {
                value: /^\d+$/,
                message: "OTP must be a number",
              },
            })}
          />
          {errors.otp && <p className="text-red-500">{errors.otp.message}</p>}
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-black text-white p-2 my-2 rounded-lg flex justify-center hover:bg-gray-900"
          >
            {isButtonLoading ? <Loader size="sm" /> : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};
