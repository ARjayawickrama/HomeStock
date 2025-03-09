const User = require("../models/user");
const bcrypt = require("bcrypt");

async function createUser(userData) {
  try {
    const { name, email, password, phone } = userData;

    // 🔹 1. Required Fields Validation
    if (!name || !email || !password || !phone) {
      throw new Error("All fields are required");
    }

    // 🔹 2. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    // 🔹 3. Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 4. Create a new user object
    const createdUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "customer",
    });

    // 🔹 5. Save user to the database
    const savedUser = await createdUser.save();

    return savedUser; 
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { createUser };
