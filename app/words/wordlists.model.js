var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

var WORDLIST_PATH = "./wordlists"
var wordlists = [
    { name: "test", path: `${WORDLIST_PATH}/test.txt` },
    { name: "eff", path: `${WORDLIST_PATH}/eff.txt` },
    { name: "lotr-elven", path: `${WORDLIST_PATH}/lotr-elven.txt` },
];

exports.getAll = function () {
    return wordlists;
}

exports.get = function (name) {
    var wordlist, filteredList = wordlists.filter(list => list.name == name);

    if (filteredList.length === 0) { return Promise.reject("Invalid wordlist name"); }
    else { wordlist = filteredList[0]; }

    return fs.readFileAsync(wordlist.path, 'utf8')
        .then(data => data.split("\r\n"));
}