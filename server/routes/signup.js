const express = require("express");
const signupController = require("../controllers/signup");

const router = express.Router();

// POST - Create a new user
router.post("/register", signupController.createUser);

// GET - Retrieve all users
router.get("/", signupController.getAllUsers);

// GET - Retrieve a single user by ID
router.get("/:id", signupController.getUserById);

// PUT - Update user details by ID
router.put("/:id", signupController.updateUser);

// DELETE - Remove a user by ID
router.delete("/:id", signupController.deleteUser);

module.exports = router;
