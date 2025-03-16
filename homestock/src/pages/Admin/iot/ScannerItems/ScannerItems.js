import React, { useEffect, useState } from "react";
import axios from "axios";

const BarcodeTable = () => {
  const [barcodes, setBarcodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []); // Runs only on initial load

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center font-medium mt-4">{error}</div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        📌 Scanned Barcodes
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead>
          <tr className="bg-gradient-to-r from-black to-indigo-900 text-white">

              <th className="py-3 px-6 text-left">📌 Barcode</th>
              <th className="py-3 px-6 text-left">📅 Date Scanned</th>
            </tr>
          </thead>
          <tbody>
            {barcodes.length > 0 ? (
              barcodes.map((barcode) => (
                <tr key={barcode._id} className="hover:bg-gray-100 transition">
                  <td className="border border-gray-300 px-6 py-3">
                    {barcode.code}
                  </td>
                  <td className="border border-gray-300 px-6 py-3">
                    {barcode.createdAt
                      ? new Date(barcode.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="2"
                  className="border border-gray-300 px-6 py-3 text-center text-gray-500"
                >
                  No barcodes available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BarcodeTable;
