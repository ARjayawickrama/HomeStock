const express = require("express");
const Barcode = require("../../models/iot/Barcode");  // Barcode Model

const router = express.Router();

router.post('/scan', async (req, res) => {
    try {
        const { barcode } = req.body;
        console.log('📌 Received barcode:', barcode);

        if (!barcode) {
            return res.status(400).json({ message: '❌ Barcode is required' });
        }

        const newBarcode = new Barcode({ barcode });
        await newBarcode.save();
        
        res.status(200).json({ message: '✅ Barcode saved successfully', barcode });
    } catch (err) {
        console.error('❌ Backend Error:', err);
        res.status(500).json({ message: '❌ Internal Server Error', error: err.message });
    }
});

router.get('/barcodes', async (req, res) => {
    try {
        const barcodes = await Barcode.find();
        if (barcodes.length === 0) {
            console.log('No barcodes found');
            return res.status(404).json({ message: '❌ No barcodes found' });
        }

        console.log('All barcodes:', barcodes);
        res.status(200).json({ message: 'All barcodes retrieved successfully', barcodes });
    } catch (err) {
        console.error('❌ Error retrieving barcodes:', err);
        res.status(500).json({ message: 'Error retrieving barcodes', error: err.message });
    }
});

module.exports = router;
