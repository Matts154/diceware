String.prototype.toTitleCase = function() {
    var str = this;
    var acronyms = {
        "3d": "3D",
        eff: "EFF",
        usa: "USA"
    };
    var ignoredWords = [
        "a",
        "for",
        "so",
        "an",
        "in",
        "the",
        "and",
        "nor",
        "to",
        "at",
        "of",
        "up",
        "but",
        "on",
        "yet",
        "by",
        "or"
    ];

    return this.split(" ")
        .map(word => {
            if (Object.keys(acronyms).indexOf(word) >= 0) {
                return acronyms[word];
            }

            if (ignoredWords.indexOf(word) >= 0) {
                return word;
            }

            var first = word.slice(0, 1).toUpperCase();
            var rest = word.slice(1);

            return first.concat(rest);
        })
        .join(" ");
};
