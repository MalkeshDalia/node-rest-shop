// Product related routes

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    // const date = new Date().toISOString();
    // console.log(date);
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// Get All Request
router.get("/", async (req, res, next) => {
  await Product.find()
    .select("name price _id productImage")
    .exec()
    .then((docs) => {
      console.log("Getting all data", docs);
      res.status(200).json({
        message: "Handling GET All requests to /products",
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            request: {
              type: "GET",
              url: "localhost:3000/products/" + doc._id,
            },
          };
        }),
      });
    })
    .catch(
      (err) => console.log(err),
      res.status(500).json({
        error: err,
      })
    );
});

// Post Request
router.post("/", upload.single("productImage"), (req, res, next) => {
  // console.log(req.file);
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product.save().then(
    (result) => console.log("Posted Successfully", product),
    res.status(201).json({
      message: "Handling POST requests to /products",
      createProduct: {
        name: product.name,
        price: product.price,
        productImage: product.productImage,
        _id: product._id,
        request: {
          type: "GET",
          url: "localhost:3000/products/" + product._id,
        },
      },
    })
  );
});

// Get By ID Request
router.get("/:productId", async (req, res, next) => {
  const id = req.params.productId;
  await Product.findById(id)
    .select("name price _id productImage") // to remove field we don't want to
    .exec()
    .then((doc) => {
      console.log("ID From Database", doc);
      if (doc) {
        res.status(201).json({
          message: "Handling GET by ID requests to /products",
          product: doc,
          request: {
            type: "GET",
            url: "localhost:3000/products/" + doc._id,
          },
        });
      } else {
        res.status(404).json({
          message: `Invalid Id, data is ${doc}`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// Patch Request
router.patch("/:productId", (req, res, next) => {
  id = req.params.productId;
  // const { name, price } = req.body;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log("Successfully Updated", result);
      res.status(200).json({
        massage: "Handling PATCH requests to /products",
        request: {
          type: "GET",
          url: "localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Delete Request
router.delete("/:productId", async (req, res, next) => {
  id = req.params.productId;
  await Product.remove({ _id: id })
    .exec()
    .then((result) => {
      console.log("ID Successfully Deleted", result);
      res.status(200).json({
        massage: "Handling DELETE requests to /products",
        request: {
          type: "POST",
          url: "localhost:3000/products",
          body: {
            name: "String",
            price: "Number",
          },
        },
      });
    })
    .catch((err) => {
      console.log("Delete didn't happen", err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
