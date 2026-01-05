const express = require("express");
const cookieParser = require("cookie-parser");
const authHandler = require("./auth/authentication");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
