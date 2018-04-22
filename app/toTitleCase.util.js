function toTitleCase() {
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

    return str
        .split(" ")
        .map((word, index) => {
            if (Object.keys(acronyms).includes(word)) {
                return acronyms[word];
            }

            if (ignoredWords.includes(word) && index > 0) {
                return word;
            }

            var first = word.slice(0, 1).toUpperCase();
            var rest = word.slice(1).toLowerCase();

            return first.concat(rest);
        })
        .join(" ");
}

String.prototype.toTitleCase = toTitleCase;
