const Inventory = require('../../model/inventory/inventoryModel');


// Get all inventory items
exports.getinventoryController = async (req, res) => {
    try {
        const inventories = await Inventory.find(); // Fetch all inventories
        res.status(200).json(inventories); // Return as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors
    }
};

// Get a specific inventory item by ID
exports.getInventoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const inventory = await Inventory.findById(id); // Fetch item by ID
        if (!inventory) return res.status(404).json({ message: 'Inventory item not found' }); // Handle not found
        res.status(200).json(inventory); // Return the found item
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors
    }
};

// Add a new inventory item
exports.addInventory = async (req, res) => {
    try {
        const newInventory = new Inventory(req.body); // Create a new inventory item
        const savedInventory = await newInventory.save(); // Save to the database
        res.status(201).json(savedInventory); // Return the saved item
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors
    }
};

// Update an existing inventory item by ID
exports.updateInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedInventory = await Inventory.findByIdAndUpdate(id, req.body, { new: true }); // Update item
        if (!updatedInventory) return res.status(404).json({ message: 'Inventory item not found' }); // Handle not found
        res.status(200).json(updatedInventory); // Return the updated item
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors
    }
};

// Delete an inventory item by ID
exports.deleteInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedInventory = await Inventory.findByIdAndDelete(id); // Delete item by ID
        if (!deletedInventory) return res.status(404).json({ message: 'Inventory item not found' }); // Handle not found
        res.status(200).json({ message: 'Inventory item deleted successfully' }); // Return success message
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors
    }
};
