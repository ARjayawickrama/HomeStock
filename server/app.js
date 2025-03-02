
const express = require("express");
const connectDB = require("./configuration/dbConfig");
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());

app.use(bodyParser.json());

// Use the signup route for "/user"
app.use("/user", signupRouter);
app.use("/auth", loginRouter);

// Connect to the database
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
