exports.world = function (req, res, next) {
    let message = `Hello ${req.params.name}`;
    res.send(message);
    return next();
};
