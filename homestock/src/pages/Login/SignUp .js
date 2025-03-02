import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";


import backgroundImage from "../../../src/assets/3.jpg"; 

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      alert("Signup failed");
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center w-full h-screen p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }} 
    >
      <div className="w-full max-w-md bg-black bg-opacity-50 p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-white">Sign Up</h1>
        <div className="min-w-[300px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
             
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-2 bg-transparent text-white border-b-2 border-white placeholder:text-white"
                {...register("name", { required: "Full name is required" })}
              />
              {errors.name && <span className="text-red-500">{errors.name.message}</span>}
            </div>

            <div className="mb-4">
           
              <input
                type="email"
                placeholder="Email Address"

               className="w-full p-2 bg-transparent text-white border-b-2 border-white placeholder:text-white"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email format",
                  },
                })}
              />
              {errors.email && <span className="text-red-500">{errors.email.message}</span>}
            </div>

            <div className="mb-4">
            
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-2 bg-transparent text-white border-b-2 border-white placeholder:text-white"
                {...register("phone", { required: "Phone number is required" })}
              />
              {errors.phone && <span className="text-red-500">{errors.phone.message}</span>}
            </div>

            <div className="mb-4">
             
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-2 bg-transparent text-white border-b-2 border-white placeholder:text-white"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="bg-transparent border-none text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            </div>

            <div className="mb-4">
        
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full p-2 bg-transparent text-white border-b-2 border-white placeholder:text-white"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === watch("password") || "Passwords do not match", // Use watch here
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="bg-transparent border-none text-white"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
              {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
            </div>
              {/* Login Text Aligned Right */}
          <div className="text-right mb-4">
            <a href="/" className="text-teal-500">Login</a>
          </div>
            <button
              type="submit"
              className="w-full p-3 bg-teal-500 text-white rounded-lg text-lg font-semibold"
            >
              Sign Up
            </button>
            
          </form>
       
        </div>
      </div>
     
    </div>
  );
};

export default SignUp;
