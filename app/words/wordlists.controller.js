var Promise = require("bluebird");
var model = Promise.promisifyAll(require("./wordlists.model.js"));

exports.all = function(req, res, next) {
    // res.send(model.getAll());
    // return next();

    Promise.resolve(model.getAll())
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ error: err }));
};

exports.one = function(req, res, next) {
    Promise.resolve(req.params.name)
        .then(name => model.get(name))
        .then(data => res.json(data))
        .catch(err => res.status(400).json({ error: err }))
        .finally(next);
};
