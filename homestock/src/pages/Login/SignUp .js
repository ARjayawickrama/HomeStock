import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { HiHome } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../../src/assets/4.jpg";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:5004/user/register", data);
      console.log("Signup successful:", response.data);
      alert("Signup successful");
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      alert("Signup failed");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      <div className="relative z-10 bg-white/90 p-8 rounded-lg shadow-lg w-96">
        <div className="flex justify-center">
          <HiHome className="text-5xl text-black" />
        </div>
        <h2 className="text-2xl font-bold text-center text-black mt-2">
          Sign up for Home Stock
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              {...register("name", { required: "Full name is required" })}
            />
            {errors.name && <span className="text-red-400 text-sm">{errors.name.message}</span>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}
          </div>

          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              {...register("phone", { required: "Phone number is required" })}
            />
            {errors.phone && <span className="text-red-400 text-sm">{errors.phone.message}</span>}
          </div>

          <div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters long" },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-gray-400 ml-2"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && <span className="text-red-400 text-sm">{errors.password.message}</span>}
          </div>

          <div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === watch("password") || "Passwords do not match",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-sm text-gray-400 ml-2"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
            {errors.confirmPassword && <span className="text-red-400 text-sm">{errors.confirmPassword.message}</span>}
          </div>

          <div className="text-right">
            <a href="/" className="text-blue-400 hover:underline">
              Already have an account? Login
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;