import React, { useEffect, useRef, useState } from "react";
import { FaBarcode, FaPlay, FaStop } from "react-icons/fa"; // Import icons from react-icons
import Quagga from "quagga";
import axios from "axios";

const BarcodeScanner = ({ onDetected }) => {
  const scannerRef = useRef(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [scannedBarcodes, setScannedBarcodes] = useState([]);
  const [lastScanned, setLastScanned] = useState(null);

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
            setScannedBarcodes((prev) => [...prev, detectedBarcode]);
            setLastScanned(detectedBarcode);
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

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Scanner Section */}
        <div className="border rounded-lg p-4 shadow-md bg-white">
          <h2 className="text-lg font-bold text-center mb-3">
            <FaBarcode className="inline-block mr-2" /> Barcode Scanner
          </h2>
          
          {/* Responsive Scanner Box */}
          <div
            ref={scannerRef}
            className={`w-full h-14 sm:h-52 bg-gray-200 rounded-lg flex items-center ${
              isWebcamActive ? "block" : "hidden"
            }`}
          />

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <button
              onClick={toggleScanner}
              className={`flex-1 py-2 text-white font-semibold rounded ${
                isWebcamActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isWebcamActive ? (
                <>
                  <FaStop className="inline-block mr-2" />
                  Stop Scanner
                </>
              ) : (
                <>
                  <FaPlay className="inline-block mr-2" />
                  Start Scanner
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scanned Barcodes */}
        <div className="border rounded-lg p-4 shadow-md bg-white">
          <h2 className="text-lg font-bold mb-3">Scanned Barcodes</h2>
          <div className="overflow-auto max-h-64">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm">No</th>
                  <th className="px-4 py-2 text-left text-sm">Barcode</th>
                </tr>
              </thead>
              <tbody>
                {scannedBarcodes.map((barcode, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 text-sm">{index + 1}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{barcode}</td>
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

export default BarcodeScanner;
