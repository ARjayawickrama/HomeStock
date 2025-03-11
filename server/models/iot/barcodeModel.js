const mongoose = require("mongoose");

const barcodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  productNumber: { type: String, required: true },
  month: { type: String, required: true },
  day: { type: String, required: true },
  year: { type: String, required: true },
});

module.exports = mongoose.model("Barcode", barcodeSchema);
