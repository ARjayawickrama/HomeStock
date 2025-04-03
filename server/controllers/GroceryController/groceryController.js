const Grocery = require('../../models/GroceryModel/Grocery');

// Get all groceries
exports.getAllGroceries = async (req, res) => {
  try {
    const groceries = await Grocery.find().sort({ dateAdded: -1 });
    res.json(groceries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new grocery item
exports.addGrocery = async (req, res) => {
  const { name, quantity, category } = req.body;
  
  try {
    const newGrocery = new Grocery({
      name,
      quantity,
      category
    });

    const grocery = await newGrocery.save();
    res.status(201).json(grocery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update grocery item
exports.updateGrocery = async (req, res) => {
  const { name, quantity, category, completed } = req.body;
  
  try {
    let grocery = await Grocery.findById(req.params.id);
    if (!grocery) return res.status(404).json({ message: 'Item not found' });

    grocery.name = name || grocery.name;
    grocery.quantity = quantity || grocery.quantity;
    grocery.category = category || grocery.category;
    grocery.completed = completed !== undefined ? completed : grocery.completed;

    const updatedGrocery = await grocery.save();
    res.json(updatedGrocery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete grocery item
exports.deleteGrocery = async (req, res) => {
  try {
    const grocery = await Grocery.findById(req.params.id);
    if (!grocery) return res.status(404).json({ message: 'Item not found' });

    await grocery.remove();
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};