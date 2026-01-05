const express = require("express");
const cookieParser = require("cookie-parser");
const authHandler = require("./auth/authentication");
require("dotenv").config();
const app = express();
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
});
app.use("/auth", limiter);

app.use("/auth", authHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
