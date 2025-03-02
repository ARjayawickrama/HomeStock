import React from "react";

const Inventory = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold">Inventory Page</h2>
      <div className="mt-4">
        <p className="text-lg">Here you can manage your inventory items.</p>
        
        {/* Grid Layout for Inventory Items */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-200 rounded">
            <h3 className="font-semibold">Item 1</h3>
            <p>Details about item 1</p>
          </div>
          <div className="p-4 bg-gray-200 rounded">
            <h3 className="font-semibold">Item 2</h3>
            <p>Details about item 2</p>
          </div>
          <div className="p-4 bg-gray-200 rounded">
            <h3 className="font-semibold">Item 3</h3>
            <p>Details about item 3</p>
          </div>
          <div className="p-4 bg-gray-200 rounded">
            <h3 className="font-semibold">Item 4</h3>
            <p>Details about item 4</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
