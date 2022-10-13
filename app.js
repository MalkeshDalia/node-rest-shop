// Express.js application for all kind of utility methods

const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser"); // Parsing incoming request bodies so we can access easily
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/product");
const orderRoutes = require("./api/routes/order");
const userRoutes = require("./api/routes/user");

// Connect with MongoDB
mongoose
  .connect(
    "mongodb+srv://user:" +
      process.env.MONGO_ATLAS_PASSWORD +
      "@node-rest-shop.npeu0da.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Database Connected"))
  .catch(() => console.log("Something Went Wrong"));

// Log Middleware
app.use(morgan("dev"));

// Body Parsing Middleware
app.use("/uploads", express.static("uploads")); // Make uploads folder available publicly
app.use(bodyParser.urlencoded({ extended: false })); // false will only give simple bodies
app.use(bodyParser.json());

// Disabling CORS mechanism
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

// Routes for Error Handling
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
