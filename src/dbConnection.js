const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "rootUser",
  password: "rootUser123",
  database: "users",
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    return;
  }

  console.log("✅ Database connected successfully");
  connection.release(); // return connection to pool
});

module.exports = pool;
