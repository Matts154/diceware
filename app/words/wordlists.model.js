var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

require("../toTitleCase.util.js");

var WORDLIST_PATH = "./wordlists";

var wordlists = fs
    .readdirSync(WORDLIST_PATH)
    .filter(fileName => fileName.indexOf(".txt") > 0)
    .map(fileName => {
        return {
            id: fileName.replace(".txt", ""),
            name: fileName
                .replace(".txt", "")
                .replace("_", " ")
                .toTitleCase(),
            // category: TBD
            path: `${WORDLIST_PATH}/${fileName}`
        };
    });

exports.getAll = function() {
    return wordlists.map(data => ({ id: data.id, name: data.name }));
};

exports.get = function(id) {
    var wordlist,
        filteredList = wordlists.filter(list => list.id == id);

    if (filteredList.length === 0) {
        return Promise.reject("Invalid wordlist id");
    } else {
        wordlist = filteredList[0];
    }

    return fs
        .readFileAsync(wordlist.path, "utf8")
        .then(data => data.replace(/\r/g, "").split("\n"))
        .catch(err => Promise.reject(err));
};
