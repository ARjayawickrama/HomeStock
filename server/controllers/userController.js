const userService = require("../services/signup");

async function createUser(req, res) {
  try {
    const userData = req.body;
    const user = await userService.createUser(userData);

    res.status(201).json({
      user: user,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}

async function getAllUsers(req, res) {
    try {
      const users = await User.find();
      console.log(users); 
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  

// Get a user by ID
async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}

// Update a user
async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const updatedData = req.body;
    const updatedUser = await userService.updateUser(userId, updatedData);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}

// Delete a user
async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    const deletedUser = await userService.deleteUser(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
