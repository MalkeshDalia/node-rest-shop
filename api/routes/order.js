

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

// Get All Request
router.get("/", async (req, res, next) => {
  await Order.find()
    .select("_id productId quantity")
    .populate("productId")
    .exec()
    .then((docs) => {
      console.log("Getting all data", docs);
      res.status(200).json({
        message: "Handling GET All requests to /orders",
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            productId: doc.productId,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

// Post Request
router.post("/", async (req, res, next) => {
  // Catching Invalid Product ID
  id = req.body.productId;
  await Product.findById(id)
    .then((product) => {
      if (!product) {
        res.status(404).json({
          message: "Product Not Found",
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        productId: req.body.productId,
        quantity: req.body.quantity,
      });
      return order.save();
    })
    .then((result) => {
      console.log("Posted Successfully", result);
      res.status(201).json({
        message: "Handling POST requests to /orders",
        createOrder: {
          _id: result._id,
          productId: result.productId,
          quantity: result.quantity,
          request: {
            type: "GET",
            url: "localhost:3000/orders/" + result._id,
          },
        },
      });
    })
    .catch((error) => {
      console.log("Creating Order Error", error);
      res.status(500).json({
        error: error,
      });
    });
});

// Get By ID Request
router.get("/:orderId", async (req, res, next) => {
  id = req.params.orderId;
  await Order.findById(id)
    .select("-__v") // to remove field we don't want to
    .populate("productId")
    .exec()
    .then((order) => {
      console.log("Id From Database", order);
      if (order) {
        res.status(200).json({
          message: "Handling GET by ID requests to /orders",
          order: order,
          request: {
            type: "GET",
            url: "localhost:3000/orders/" + order._id,
          },
        });
      } else {
        res.status(404).json({
          message: `Invalid Id, data is ${order}`,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

// Delete Request
router.delete("/:orderId", async (req, res, next) => {
  id = req.params.orderId;
  await Order.remove({ _id: id })
    .exec()
    .then((result) => {
      console.log("ID Successfully Deleted", result);
      res.status(200).json({
        massage: "Handling DELETE requests to /orders",
        request: {
          type: "POST",
          url: "localhost:3000/orders",
          body: {
            productID: "ID",
            quantity: "Number",
          },
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

module.exports = router;
