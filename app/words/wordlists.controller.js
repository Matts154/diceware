var Promise = require("bluebird");
var model = Promise.promisifyAll(require("./wordlists.model.js"));

exports.all = function (req, res, next) {
    res.send(model.getAll());
    return next();
}

exports.one = function (req, res, next) {
    model.get(req.params.name)
        .then(data => res.json(data))
        .catch(err => { res.sendStatus(400); });
    //.finally(() => next());
}