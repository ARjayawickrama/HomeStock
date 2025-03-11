
const express = require("express");
const connectDB = require("./configuration/dbConfig");
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const barcodeRoutes = require("./routes/iot/barcodeRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.json());

app.use("/api", signupRouter);
app.use("/auth", loginRouter);
app.use("/barcode", barcodeRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
