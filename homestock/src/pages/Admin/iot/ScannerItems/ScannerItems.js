import React, { useEffect, useState } from "react";
import axios from "axios";

const BarcodeTable = () => {
  const [barcodes, setBarcodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingBarcode, setDeletingBarcode] = useState(null);

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
    const [day, month, year] = expiryDate.split(/[-/]/).map(Number);
    const expiry = new Date(year, month - 1, day);
    const today = new Date();
    return expiry < today;
  };

  const formatExpiryDate = (barcode) => {
    const cleanedBarcode = barcode.replace(/[^0-9]/g, "");

    if (cleanedBarcode.length < 10) return "Invalid Barcode";

    const itemNumber = cleanedBarcode.slice(0, 2);
    const month = cleanedBarcode.slice(2, 4);
    const day = cleanedBarcode.slice(4, 6);
    const year = cleanedBarcode.slice(6, 10);

    const expiryDate = `${day}-${month}/${year}`;
    const isExpired = checkIfExpired(expiryDate);

    return (
      <span
        className={
          isExpired ? "text-red-500 font-bold" : "text-green-500 font-bold"
        }
      >
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

  const getBarcodeColor = (barcode) => {
    if (barcode.code.startsWith("A")) {
      return "bg-blue-500 text-white";
    } else if (barcode.code.startsWith("B")) {
      return "bg-yellow-500 text-white";
    }
    return "bg-gray-200 text-gray-800";
  };

  const deleteBarcode = async (barcodeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this barcode?"
    );
    if (!confirmed) return;

    try {
      setDeletingBarcode(barcodeId);
      await axios.delete(`http://localhost:5000/api/barcodes/${barcodeId}`);
      setBarcodes(barcodes.filter((barcode) => barcode._id !== barcodeId));
    } catch (err) {
      setError("❌ Error deleting barcode");
      console.error("❌ Error deleting barcode:", err);
    } finally {
      setDeletingBarcode(null);
    }
  };

  return (
    <div className="relative ">
      <div className="relative left-3/4 ml-20">
        <input
          type="text"
          className="p-4 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-gray-500"
          placeholder="Search by Barcode or Date"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <div className="text-center text-white font-semibold text-lg animate-pulse">
          Loading barcodes...
        </div>
      ) : error ? (
        <div className="text-center text-red-500 font-semibold text-lg">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4 text-left">Barcode</th>
                <th className="p-4 text-left">Expiry Date</th>
                <th className="p-4 text-left">Scanned At</th>
                <th className="p-4 text-left">Action</th>{" "}
              </tr>
            </thead>
            <tbody>
              {filteredBarcodes.length > 0 ? (
                filteredBarcodes.map((barcode) => (
                  <tr
                    key={barcode._id}
                    className={`hover:bg-gray-100 ${getBarcodeColor(barcode)}`}
                  >
                    <td className="p-4">{barcode.code}</td>
                    <td className="p-4">{formatExpiryDate(barcode.code)}</td>
                    <td className="p-4">
                      {barcode.createdAt
                        ? new Date(barcode.createdAt).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteBarcode(barcode._id)}
                        className={`bg-red-500 text-white p-2 rounded hover:bg-red-700 ${
                          deletingBarcode === barcode._id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={deletingBarcode === barcode._id} // Disable the button while deleting
                      >
                        {deletingBarcode === barcode._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 p-4">
                    No barcodes available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BarcodeTable;
