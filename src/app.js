const express = require("express");
const cookieParser = require("cookie-parser");
const authHandler = require("./auth/authentication");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authHandler);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
