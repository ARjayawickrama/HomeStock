const mongoose = require('mongoose');

const barcodeSchema = new mongoose.Schema({
    barcode: {
        type: String,
        required: [true, '❌ Barcode is required'],  // ✅ Ensure barcode is required
        unique: true,  // ✅ Prevent duplicate barcodes
        trim: true,
    }
});

module.exports = mongoose.model('Barcode', barcodeSchema);
