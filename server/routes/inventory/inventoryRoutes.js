const express = require('express');
const router = express.Router();
const InventoryController = require('../../controllers/inventory/inventoryController'); // Adjust the path as needed

// Get all inventory
router.get('/', inventory.getinventory);

// Get inventory by ID
router.get('/:id', inventory.getInventoryById);

// Add new inventory
router.post('/', inventory.addInventory);

// Update inventory
router.put('/:id', inventory.updateInventory);

// Delete inventory
router.delete('/:id', inventory.deleteInventory);

module.exports = router;
