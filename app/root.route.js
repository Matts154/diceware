var express = require("express");
var router = express.Router();

router.use("/hello", require("./hello/hello.route.js"));
router.use("/wordlist", require("./words/wordlists.route.js"));

module.exports = router;
