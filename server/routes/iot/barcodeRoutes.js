const express = require("express");
const router = express.Router();
const barcodeController = require("../../controllers/iot/barcodeController");

router.post("/", barcodeController.addBarcode);
router.get("/", barcodeController.getAllBarcodes);
router.put("/:id", barcodeController.updateBarcode);
router.delete("/:id", barcodeController.deleteBarcode);

module.exports = router;
