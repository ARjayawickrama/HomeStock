import React, { useEffect, useState } from "react";

const WarningMessage = () => {
  const [warningMessage, setWarningMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const fetchWarningMessage = async () => {
    try {
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
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchWarningMessage, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {warningMessage ? (
        <div
          className={`bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-xl shadow-lg
            flex items-start space-x-3 transform transition-all duration-300 ease-out
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
        >
          <div className="relative  ">
            <div className="absolute animate-ping w-6 h-6 rounded-full bg-red-400 opacity-75 "></div>
            <svg
              className="w-6 h-6 flex-shrink-0 relative"
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
          <div className="flex-1">
            <h3 className="font-semibold tracking-wide">System Alert</h3>
            <p className="mt-1 text-sm opacity-90">{warningMessage}</p>
          </div>
        </div>
      ) : (
        <div
          className={`bg-gradient-to-br from-green-400 to-green-500 text-white p-4 rounded-xl shadow-lg
            flex items-center space-x-3 transform transition-all duration-300 ease-out  
            ${
              !warningMessage
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
        >
          <svg
            className="w-16 h-11 flex-shrink-0 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">All systems operational</span>
        </div>
      )}
    </div>
  );
};

export default WarningMessage;
