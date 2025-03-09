import React, { useEffect, useRef, useState } from "react";
import { FaBarcode, FaPlay, FaStop, FaEdit, FaTrash } from "react-icons/fa";
import Quagga from "quagga";
import axios from "axios";

const API_URL = "http://localhost:5004/barcodes"; // Backend API

const ScannerItems = () => {
  const scannerRef = useRef(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [scannedBarcodes, setScannedBarcodes] = useState([]);
  const [lastScanned, setLastScanned] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    productNumber: "",
    month: "",
    day: "",
    year: "",
  });

  useEffect(() => {
    fetchBarcodes();
  }, []);

  useEffect(() => {
    if (isWebcamActive) {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            constraints: { width: 640, height: 480, facingMode: "environment" },
            target: scannerRef.current,
          },
          decoder: {
            readers: [
              "ean_reader",
              "code_128_reader",
              "upc_reader",
              "code_39_reader",
              "codabar_reader",
            ],
          },
        },
        (err) => {
          if (err) {
            console.error("Quagga initialization failed:", err);
            return;
          }
          Quagga.start();
        }
      );

      let scanTimeout;
      Quagga.onDetected((result) => {
        const detectedBarcode = result.codeResult.code;
        if (detectedBarcode !== lastScanned) {
          clearTimeout(scanTimeout);
          scanTimeout = setTimeout(() => {
            saveBarcode(detectedBarcode);
            setLastScanned(detectedBarcode);
          }, 1500);
        }
      });
    } else {
      stopScanner();
    }

    return () => stopScanner();
  }, [isWebcamActive, lastScanned]);

  // Fetch existing barcodes from backend
  const fetchBarcodes = async () => {
    try {
      const response = await axios.get(API_URL);
      setScannedBarcodes(response.data);
    } catch (error) {
      console.error("Error fetching barcodes:", error);
    }
  };

  // Save barcode with new format: "YYYY MM DD ProductNumber"
  const saveBarcode = async (code) => {
    console.log("Scanned Barcode:", code); // Log the barcode to check its format

    // Ensure barcode has the minimum expected length (adjust as needed)
    if (code.length < 9) {
      console.error("Invalid barcode format:", code);
      return;
    }

    const productNumber = code.slice(0, 1); // Extract first character as Product Number
    const month = code.slice(1, 3);
    const day = code.slice(3, 5);
    const year = code.slice(5, 9);

    // New Format: "YYYY MM DD ProductNumber"
    const formattedCode = `${year} ${month} ${day} ${productNumber}`;

    try {
      const response = await axios.post(API_URL, {
        code: formattedCode,
        productNumber,
        month,
        day,
        year,
      });
      setScannedBarcodes([...scannedBarcodes, response.data]);
    } catch (error) {
      console.error("Error saving barcode:", error);
    }
  };

  // Delete barcode
  const deleteBarcode = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setScannedBarcodes(scannedBarcodes.filter((barcode) => barcode._id !== id));
    } catch (error) {
      console.error("Error deleting barcode:", error);
    }
  };

  // Update barcode with new format
  const updateBarcode = async (id) => {
    const updatedCode = `${editData.year} ${editData.month} ${editData.day} ${editData.productNumber}`;

    try {
      const response = await axios.put(`${API_URL}/${id}`, { code: updatedCode, ...editData });
      setScannedBarcodes(
        scannedBarcodes.map((b) => (b._id === id ? response.data : b))
      );
      setEditId(null);
      setEditData({ productNumber: "", month: "", day: "", year: "" });
    } catch (error) {
      console.error("Error updating barcode:", error);
    }
  };

  // Stop the scanner
  const stopScanner = () => {
    if (Quagga) {
      try {
        Quagga.stop();
      } catch (error) {
        console.warn("Quagga stop error:", error);
      }
    }
  };

  // Handle edit input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Section */}
        <div className="border rounded-lg p-4 shadow-md bg-white">
          <h2 className="text-lg font-bold text-center mb-3">
            <FaBarcode className="inline-block mr-2" /> Barcode Scanner
          </h2>

          <div
            ref={scannerRef}
            className={`w-full h-14 sm:h-52 bg-gray-200 rounded-lg flex items-center ${
              isWebcamActive ? "block" : "hidden"
            }`}
          />

          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <button
              onClick={() => setIsWebcamActive(!isWebcamActive)}
              className={`flex-1 py-2 text-white font-semibold rounded ${
                isWebcamActive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isWebcamActive ? (
                <>
                  <FaStop className="inline-block mr-2" /> Stop Scanner
                </>
              ) : (
                <>
                  <FaPlay className="inline-block mr-2" /> Start Scanner
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scanned Barcodes */}
        <div className="border rounded-lg p-4 shadow-md bg-white">
          <h2 className="text-lg font-bold mb-3">Scanned Barcodes</h2>
          <div className="overflow-auto max-h-64">
            <table className="w-full border-collapse shadow-lg rounded-lg">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">#</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Barcode</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scannedBarcodes.map((barcode, index) => (
                  <tr
                    key={barcode._id}
                    className="border-t odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td className="px-6 py-3 text-sm">{index + 1}</td>
                    <td className="px-6 py-3 text-sm">{barcode.code}</td>
                    <td className="px-6 py-3 text-sm">
                      <button
                        onClick={() => deleteBarcode(barcode._id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerItems;
