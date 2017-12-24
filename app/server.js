var express = require("express");
var app = express();
var router = require("./root.route.js");

const SERVER = {
    NAME: process.env.NAME || "Diceware API",
    PORT: process.env.PORT || 8080,
};

// Log incoming request
app.use(function (req, res, next) {
    var date = new Date();
    console.log('%s: FROM %s TO %s %s', date.toLocaleString(), req.ip, req.method, req.path);
    next();
});

// Set headers
app.use(function (req, res, next) {
    //res.header('Cross')
    res.header('Access-Control-Allow-Origin', '*');
    return next();
});

app.use("/", router);

app.listen(SERVER.PORT, function () {
    console.log(`${SERVER.NAME} listening on port ${SERVER.PORT}`);
});
