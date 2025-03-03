import React, { useEffect, useRef, useState } from "react";
import Quagga from "quagga";
import axios from "axios";

const BarcodeScanner = ({ onDetected }) => {
  const scannerRef = useRef(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false); 
  const [scannedBarcodes, setScannedBarcodes] = useState([]); 
  const [lastScanned, setLastScanned] = useState(null);

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
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-bold text-center mb-4">Smart POS Barcode Scanner</h2>

    
      <div
        ref={scannerRef}
        className={`w-full h-64 bg-gray-200 rounded-lg ${isWebcamActive ? "block" : "hidden"}`}
      />
      
     
      <div className="mt-4 space-y-4">
        
        <button
          onClick={toggleScanner}
          className={`w-full py-2 px-4 rounded ${isWebcamActive ? "bg-red-500" : "bg-green-500"} text-white`}
        >
          {isWebcamActive ? "Stop Scanner" : "Start Scanner"}
        </button>

       
        {isWebcamActive && (
          <button
            onClick={disableWebcam}
            className="w-full py-2 px-4 rounded bg-yellow-500 text-white"
          >
            Disable Webcam
          </button>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-md font-semibold">Scanned Barcodes:</h3>
        <ul className="list-disc pl-4">
          {scannedBarcodes.map((barcode, index) => (
            <li key={index} className="text-sm text-gray-700">{barcode}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BarcodeScanner;
