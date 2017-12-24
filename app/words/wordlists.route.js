var express = require("express");
var wordlists = require("./wordlists.controller.js");
var router = express.Router();

router.route("/")
    .get(wordlists.all);

router.route("/:name")
    .get(wordlists.one);

module.exports = router;