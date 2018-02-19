var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

var WORDLIST_PATH = "./wordlists";

var wordlists = fs
    .readdirSync(WORDLIST_PATH)
    .filter(fileName => fileName.indexOf(".txt") > 0)
    .map(fileName => {
        return {
            name: fileName.replace(".txt", ""),
            // category: fileName.
            path: `${WORDLIST_PATH}/${fileName}`
        };
    });

exports.getAll = function() {
    return wordlists.map(wordlist => wordlist.name);
};

exports.get = function(name) {
    var wordlist,
        filteredList = wordlists.filter(list => list.name == name);

    if (filteredList.length === 0) {
        return Promise.reject("Invalid wordlist name");
    } else {
        wordlist = filteredList[0];
    }

    return fs
        .readFileAsync(wordlist.path, "utf8")
        .then(data => data.split("\n"))
        .catch(err => Promise.reject(err));
};
