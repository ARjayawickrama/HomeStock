import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import backgroundImage from '../../../src/assets/3.jpg';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleShowClick = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5004/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      setTimeout(() => {
        setError("Invalid email or password");
        setLoading(false);
      }, 1500);
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center w-screen h-screen p-4 bg-cover bg-center bg-black"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="w-full max-w-md bg-black bg-opacity-50 p-6 rounded-lg">
        <form onSubmit={handleSubmit}>
          {/* <div className="mb-4">
            <label htmlFor="email" className="block text-white mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              className="w-full p-3 text-white bg-transparent border-b-2 border-white focus:outline-none focus:border-teal-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div> */}
          <div class="mb-6">
        <label htmlFor="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
        <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" required />
    </div> 

          <div className="mb-4">
            <label htmlFor="password" className="block text-white mb-2">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 text-white bg-transparent border-b-2 border-white focus:outline-none focus:border-teal-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white"
                onClick={handleShowClick}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="text-right mt-2">
              <a href="/signup" className="text-white">Don't have an account? Sign Up</a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-3 mt-4 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-600 focus:outline-none flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
