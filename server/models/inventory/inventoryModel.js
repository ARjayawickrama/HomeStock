const mongoose = require('mongoose');

// Define the schema for Inventory
const InventorySchema = new mongoose.Schema({
    productId: { type: String, required: true },
    itemName: { type: String, required: true },
    category: {type: String, required: true},
    quantity: { type: Number, required: true },
    manufactureDate: { type: String, required: true },
    expireDate: { type: String, required: true },
    temperature: { type: String, required: true },

    
});

// Create the model using the schema
const Inventory = mongoose.model('Inventory', InventorySchema);

module.exports = Inventory;
