// User related routes

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Sign-Up User Post
router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (error, hash) => {
    if (error) {
      return res.status(500).json({
        error: error,
      });
    } else {
      const user = new User({
        _id: mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash,
      });
    }
  });
});

module.exports = router;
