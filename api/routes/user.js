// User related routes

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Sign-Up User Post
router.post("/signup", (req, res, next) => {
  // Checking If Email already Exists then we will execute further process
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email Already Exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (error, hash) => {
          if (error) {
            return res.status(500).json({
              errors: error,
            });
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log("User Created Successfully", result);
                res.status(201).json({
                  message: "User Created",
                });
              })
              .catch((error) => {
                console.log("Something Wrong with Creating User", error);
                res.status(500).json({
                  error: error,
                });
              });
          }
        });
      }
    });
});

router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      console.log("User Deleted", result);
      res.status(200).json({
        message: "User Deleted",
        request: {
          type: "POST",
          url: "localhost:3000/user/signup",
          body: {
            productID: "ID",
            quantity: "Number",
          },
        },
      });
    })
    .catch((error) => {
      console.log("Something Went Wrong with User Delete", error);
      res.status(500).json({
        error: error,
      });
    });
});

module.exports = router;
