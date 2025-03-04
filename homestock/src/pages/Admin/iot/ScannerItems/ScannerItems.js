import React, { useEffect, useRef, useState } from "react";
import Quagga from "quagga";
import axios from "axios";

const BarcodeScanner = ({ onDetected }) => {
  const scannerRef = useRef(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [scannedBarcodes, setScannedBarcodes] = useState([]);
  const [lastScanned, setLastScanned] = useState(null);
  const [productDetails, setProductDetails] = useState(null);

  const handleDetected = (code) => {
    console.log("Detected barcode:", code);
    checkExpiryAndSaveBarcode(code);
    setScannedBarcodes((prev) => [...prev, code]);
    setLastScanned(code);
  };

  const checkExpiryAndSaveBarcode = async (barcode) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/product/${barcode}`);
      const product = response.data;
      if (product) {
        const currentDate = new Date();
        const expiryDate = new Date(product.expiryDate);
        if (expiryDate < currentDate) {
          alert("This product has expired!");
        } else {
          saveBarcodeToDatabase(barcode, product);
          setProductDetails(product);
        }
      } else {
        console.log("Product not found.");
      }
    } catch (error) {
      console.error("Error checking expiry date:", error);
    }
  };

  const saveBarcodeToDatabase = async (barcode, product) => {
    try {
      await axios.post("http://localhost:5000/api/save-scan", {
        barcode,
        product,
      });
    } catch (error) {
      console.error("Error saving barcode:", error);
    }
  };

  useEffect(() => {
    if (isWebcamActive) {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            constraints: {
              width: 640,
              height: 480,
              facingMode: "environment",
            },
            target: scannerRef.current,
          },
          decoder: {
            readers: ["ean_reader", "code_128_reader", "upc_reader", "code_39_reader", "codabar_reader"],
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
            handleDetected(detectedBarcode);
          }, 1500);
        }
      });
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isWebcamActive, lastScanned]);

  const stopScanner = () => {
    if (Quagga) {
      try {
        Quagga.stop();
      } catch (error) {
        console.warn("Quagga stop error:", error);
      }
    }
  };

  const toggleScanner = () => {
    setIsWebcamActive((prev) => !prev);
  };

  const disableWebcam = () => {
    setIsWebcamActive(false);
  };

  return (
    <div className="p-4 max-w-full mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-bold text-center mb-2">Barcode Scanner</h2>
          <div
            ref={scannerRef}
            className={`w-full h-40 bg-gray-200 rounded-lg ${isWebcamActive ? "block" : "hidden"}`}
          />
          <button
            onClick={toggleScanner}
            className={`w-full py-2 mt-2 rounded ${isWebcamActive ? "bg-red-500" : "bg-green-500"} text-white`}
          >
            {isWebcamActive ? "Stop Scanner" : "Start Scanner"}
          </button>
          {isWebcamActive && (
            <button
              onClick={disableWebcam}
              className="w-full py-2 mt-2 rounded bg-yellow-500 text-white"
            >
              Disable Webcam
            </button>
          )}
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-bold mb-2">Scanned Barcodes</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">No</th>
                <th className="px-4 py-2 text-left">Barcode</th>
              </tr>
            </thead>
            <tbody>
              {scannedBarcodes.map((barcode, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 text-gray-700">{barcode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
