const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { barcode } = req.body;
    console.log(barcode);
    if (!barcode) {
        return res.status(400).json({ error: 'Barcode is required' });
    }
    res.status(201).json({ message: 'Barcode saved successfully', barcode });
});

module.exports = router;
