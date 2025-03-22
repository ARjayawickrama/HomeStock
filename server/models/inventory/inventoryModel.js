// models/inventoryModel.js

const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemNumber: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  manufactureDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  temperature: { type: String, required: true },
  status: { type: String, default: "Available" },
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
