const Barcode = require("../../models/iot/barcodeModel");

// Add a new barcode
exports.addBarcode = async (req, res) => {
  try {
    const { code } = req.body;
    const existingBarcode = await Barcode.findOne({ code });

    if (existingBarcode) {
      return res.status(400).json({ message: "Barcode already exists." });
    }

    const newBarcode = new Barcode({ code });
    await newBarcode.save();

    res.status(201).json({ message: "Barcode added successfully!", barcode: newBarcode });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all barcodes
exports.getAllBarcodes = async (req, res) => {
  try {
    const barcodes = await Barcode.find().sort({ scannedAt: -1 });
    res.json(barcodes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a barcode
exports.updateBarcode = async (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.body;

    const updatedBarcode = await Barcode.findByIdAndUpdate(id, { code }, { new: true });

    if (!updatedBarcode) {
      return res.status(404).json({ message: "Barcode not found" });
    }

    res.json({ message: "Barcode updated successfully!", barcode: updatedBarcode });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a barcode
exports.deleteBarcode = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBarcode = await Barcode.findByIdAndDelete(id);

    if (!deletedBarcode) {
      return res.status(404).json({ message: "Barcode not found" });
    }

    res.json({ message: "Barcode deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
