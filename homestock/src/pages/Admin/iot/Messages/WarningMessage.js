import React, { useEffect, useState } from "react";

const WarningMessage = () => {
  const [warningMessage, setWarningMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWarningMessage = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://192.168.181.103/warning");
      const data = await response.json();

      if (data.warning_message?.trim()) {
        setWarningMessage(data.warning_message);
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setTimeout(() => setWarningMessage(""), 300);
      }
    } catch (error) {
      console.error("Error fetching warning message:", error);
      setIsVisible(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWarningMessage();
    const interval = setInterval(fetchWarningMessage, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Loading State */}
      {isLoading && (
        <div className="bg-gray-100 text-gray-600 p-4 rounded-xl shadow-sm flex items-center space-x-3">
          <div className="animate-pulse h-6 w-6 rounded-full bg-gray-300"></div>
          <span className="text-sm font-medium">Checking system status...</span>
        </div>
      )}

      {/* Warning State */}
      {!isLoading && warningMessage && (
        <div
          className={`bg-white border-l-4 border-red-500 text-gray-800 p-4 rounded-r-xl shadow-sm
            flex items-start space-x-3 transform transition-all duration-300 ease-out
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
        >
          <div className="relative flex-shrink-0">
            <div className="absolute animate-ping w-5 h-5 rounded-full bg-red-400 opacity-75"></div>
            <div className="relative p-1 rounded-full bg-red-100 text-red-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900">System Alert</h3>
            <p className="mt-1 text-sm text-gray-600">{warningMessage}</p>
            <div className="mt-2 flex space-x-3">
              <button className="text-xs font-medium text-red-600 hover:text-red-700">
                View details
              </button>
              <button className="text-xs font-medium text-gray-500 hover:text-gray-700">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Clear State */}
      {!isLoading && !warningMessage && (
        <div
          className={`bg-white border-l-4 border-green-500 text-gray-800 p-4 rounded-r-xl shadow-sm
            flex items-center space-x-3 transform transition-all duration-300 ease-out  
            ${
              !warningMessage
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
        >
          <div className="p-1 rounded-full bg-green-100 text-green-500">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="flex-1">
            <span className="font-medium text-gray-900">
              All systems operational
            </span>
            <p className="mt-1 text-xs text-gray-500">Last checked: Just now</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarningMessage;
