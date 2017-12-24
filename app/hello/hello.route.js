var express = require("express");
var hello = require("./hello.controller.js");
var helloRouter = express.Router();

helloRouter.route("/:name")
    .get(hello.world);

module.exports = helloRouter;
