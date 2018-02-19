var express = require("express");
// var https = require("https");
var app = express();
var router = require("./root.route.js");

const SERVER = {
    NAME: process.env.NAME || "Diceware API",
    PORT: process.env.PORT || 8080
};

// Log incoming requests
app.use(function(req, res, next) {
    var date = new Date();
    console.log(
        "%s: FROM %s TO %s %s %s",
        date.toLocaleString(),
        req.ip,
        req.protocol,
        req.method,
        req.path
    );
    next();
});

// Set headers
app.use(function(req, res, next) {
    //res.header('Cross')
    res.header("Access-Control-Allow-Origin", "*");
    return next();
});

app.use("/", router);

app.listen(SERVER.PORT, function() {
    console.log(`${SERVER.NAME} listening on port ${SERVER.PORT}`);
});

// https.createServer(options, app).listen(443);
