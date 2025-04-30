import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import axios from "axios";

function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/groceries/archived")
      .then((res) => {
        setItems(res.data);
        // Assuming res.data is an array of archived items
        setNotifications(
          res.data.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            category: item.category,
          }))
        );
      })
      .catch((err) => console.error(err));
  }, []);

  const toggleNotification = () => setIsOpen(!isOpen);
  const clearNotifications = () => setNotifications([]);

  return (
    <div className="relative w-full">
      {/* Bell Button */}
      <div className="fixed  top-20 right-72 z-50">
        <button
          className="relative p-3 bg-white rounded-full shadow hover:bg-gray-100 transition duration-200"
          onClick={toggleNotification}
          aria-label="Notifications"
        >
          <FaBell className="text-red-600 text-3xl" />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="mt-3 w-80 bg-white border border-gray-200 rounded-lg shadow-lg animate-fade-in z-50 absolute right-0">
            <div className="flex justify-between items-center px-4 py-3 bg-gray-100 border-b">
              <h3 className="text-sm font-semibold text-gray-700">
                Notifications
              </h3>
              <button
                className="text-xs text-indigo-600 hover:underline"
                onClick={clearNotifications}
              >
                Clear All
              </button>
            </div>
            {notifications.length > 0 ? (
              <ul className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                {notifications.map((note, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-3 hover:bg-gray-50 text-sm text-gray-800"
                  >
                    <div>
                      <strong>Name:</strong> {note.name}
                    </div>
                    <div>
                      <strong>Quantity:</strong> {note.quantity}
                    </div>
                    <div>
                      <strong>Category:</strong> {note.category}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No new notifications
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notification;
