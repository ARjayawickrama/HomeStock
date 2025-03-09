const Barcode = require("../../models/iot/barcodeModel");

// Fetch all barcodes
exports.getAllBarcodes = async (req, res) => {
  try {
    const barcodes = await Barcode.find();
    res.json(barcodes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching barcodes", error });
  }
};

// Save a new barcode
exports.addBarcode = async (req, res) => {
  try {
    const { code, productNumber, month, day, year } = req.body;
    const newBarcode = new Barcode({ code, productNumber, month, day, year });
    await newBarcode.save();
    res.status(201).json(newBarcode);
  } catch (error) {
    res.status(500).json({ message: "Error saving barcode", error });
  }
};

// Delete a barcode
exports.deleteBarcode = async (req, res) => {
  try {
    const { id } = req.params;
    await Barcode.findByIdAndDelete(id);
    res.json({ message: "Barcode deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting barcode", error });
  }
};

// Update a barcode
exports.updateBarcode = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedBarcode = await Barcode.findByIdAndUpdate(id, updatedData, { new: true });
    res.json(updatedBarcode);
  } catch (error) {
    res.status(500).json({ message: "Error updating barcode", error });
  }
};
