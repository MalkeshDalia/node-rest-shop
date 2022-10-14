// User related routes

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Post Request and Sign-Up for User
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

// Post Request and Login for User
router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (error, result) => {
        if (error) {
          return res.status(401).json({
            message: "Auth Failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth Successfully",
            token: token,
          });
        }
        res.status(401).json({
          message: "Auth Failed",
        });
      });
    })
    .catch((error) => {
      console.log("Something Went Wrong with User Delete", error);
      res.status(500).json({
        error: error,
      });
    });
});

// Delete Request
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
