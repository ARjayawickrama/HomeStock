import React from "react";

const Order = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold">Order Page</h2>
      <div className="mt-4">
        <p className="text-lg">Manage and view your orders here.</p>
        {/* Add your order details or any content here */}
        <ul className="mt-2 space-y-2">
          <li className="p-2 bg-gray-200 rounded">Order 1</li>
          <li className="p-2 bg-gray-200 rounded">Order 2</li>
          <li className="p-2 bg-gray-200 rounded">Order 3</li>
        </ul>
      </div>
    </div>
  );
};

export default Order;
