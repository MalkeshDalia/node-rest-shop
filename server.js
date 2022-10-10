// Here I will set up all the code for node.js server

const http = require("http");
const app = require("./app");

const port = process.env.PORT || 5000;

const server = http.createServer(app).listen(port, console.log("Server Started on 5000 Port"));
