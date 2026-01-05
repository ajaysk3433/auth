const express = require("express");
const router = express.Router();
const pool = require("../dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const insertNewUser = `INSERT INTO users (name, mobile, email, class, gender, password) 
               VALUES (?, ?, ?, ?, ?, ?)`;

const checkMobileNumberSql = `SELECT id FROM users WHERE mobile = ?`;

const saltRounds = 10;

router.post("/signUp", (req, res) => {
  const newUser = req.body;

  //check all field has value

  for (let key in newUser) {
    if (!newUser[key]) {
      return res.status(400).send(`Field "${key}" is required`);
    }
  }

  //check if mobile no. already exist in DB

  pool.query(checkMobileNumberSql, [newUser.mobile], (err, results) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).send("something went wrong, try again later");
    }

    if (results.length > 0) {
      return res
        .status(400)
        .send(
          "Mobile number already exists. Kindly retry with diffrent mobile no."
        );
    }
  });

  //password hashing
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(newUser.password, salt);
  console.log(hash);

  const values = [
    newUser.name,
    newUser.mobile,
    newUser.email,
    newUser.class,
    newUser.gender,
    hash,
  ];

  //register new user
  pool.query(insertNewUser, values, (err, results) => {
    if (err) {
      console.error("Error inserting user:", err.message);
      return res.status(500).send("something went wrong, try again later");
    }
    console.log("User inserted successfully, ID:", results.insertId);
    //generating token
    const token = jwt.sign({ mobile: newUser.mobile }, "secret key");
    //storing token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });
    return res.status(200).send("New user added successfully");
  });
});

//user login

module.exports = router;
