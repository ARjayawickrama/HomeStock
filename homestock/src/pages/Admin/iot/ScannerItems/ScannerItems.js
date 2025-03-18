import React, { useEffect, useState } from "react";
import axios from "axios";

const BarcodeTable = () => {
  const [barcodes, setBarcodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch barcodes from backend
  useEffect(() => {
    const fetchBarcodes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/barcodes");
        setBarcodes(response.data.barcodes);
      } catch (err) {
        setError("Error fetching data");
        console.error("❌ Error fetching barcodes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBarcodes();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const checkIfExpired = (expiryDate) => {
    const today = new Date();
    const expDate = new Date(expiryDate);
    return expDate < today; // Expired නම් true වේ
  };

  const formatExpiryDate = (barcode) => {
    // Item Number: 20 | Month: 03 | Day: 18 | Year: 2025
    const itemNumber = barcode.slice(0, 2);
    const month = barcode.slice(2, 4);
    const day = barcode.slice(4, 6);
    const year = barcode.slice(6, 10);

    // Formatted Expiry Date
    const expiryDate = `${month}/${day}/${year}`;
    const isExpired = checkIfExpired(expiryDate);

    return (
      <span className={isExpired ? "text-red-500 font-bold" : "text-green-500"}>
        {expiryDate} {isExpired ? "(Expired)" : "(Valid)"}
      </span>
    );
  };

  const filteredBarcodes = barcodes.filter(
    (barcode) =>
      barcode.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (barcode.createdAt &&
        new Date(barcode.createdAt)
          .toLocaleString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-gradient-to-r from-slate-300 to-slate-500 p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-extrabold text-white mb-6 text-center">
        Scanned Barcodes
      </h2>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          className="w-3/4 sm:w-1/2 p-4 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-gray-500"
          placeholder="Search by Barcode or Date"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Loading, Error, and Barcode Display */}
      {loading ? (
        <div className="text-center text-white font-semibold text-lg animate-pulse">
          Loading barcodes...
        </div>
      ) : error ? (
        <div className="text-center text-red-500 font-semibold text-lg">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBarcodes.length > 0 ? (
            filteredBarcodes.map((barcode) => (
              <div
                key={barcode._id}
                className="bg-white p-6 rounded-lg shadow-xl hover:scale-105 transform transition-all duration-300"
              >
                <p className="font-semibold text-gray-800 text-lg">
                  Barcode: {barcode.code}
                </p>
                <p className="text-gray-700 mb-2">
                  Expiry Date: {formatExpiryDate(barcode.code)}
                </p>
                <p className="text-gray-700">
                  Scanned At:{" "}
                  {barcode.createdAt
                    ? new Date(barcode.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500">
              No barcodes available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BarcodeTable;
