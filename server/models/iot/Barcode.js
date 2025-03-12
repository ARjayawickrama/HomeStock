const mongoose = require("mongoose");

// Define your schema
const barcodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,  // Ensure that code is unique
  },
  // other fields...
});

// Model
const Barcode = mongoose.model("Barcode", barcodeSchema);

const insertBarcode = async (barcodeData) => {
  try {
    // Validate the barcodeData
    if (!barcodeData.code) {
      console.error("Error: Barcode code is required.");
      return;
    }

    // Try inserting data
    const barcode = new Barcode(barcodeData);
    await barcode.save();
    console.log("Barcode inserted successfully.");
  } catch (error) {
    if (error.code === 11000) {
      console.error("Error: Duplicate barcode code.");
    } else {
      console.error("Error inserting barcode:", error);
    }
  }
};

// Example usage
const newBarcode = {
  code: "12345", // Ensure this is a valid, unique code
};

insertBarcode(newBarcode);
