var Diceware = {};

Diceware.generateWords = function(wordlists, numWords) {
    // Input validation
    if (
        typeof wordlists !== "object" ||
        selectedWordlists.length === 0 ||
        typeof numWords !== "number" ||
        numWords <= 0
    ) {
        return;
    }

    Promise.resolve(this.getWordlists(selectedWordlists))
        .then(data => new Array().concat(...data))
        .then(data => shuffleArray(data))
        .then(data => {
            updatePhraseNumber(data.length, numWords);
            return data;
        })
        .then(data => {
            var uIntNumbers = getRandomNumbers(numWords);
            var numbers = Array.prototype.slice.call(uIntNumbers);
            return numbers.map(n => {
                n = n % data.length;
                return data[n];
            });
        })
        .then(result => result.join(" "))
        .then(result => updatePassphrase(result))
        .catch(err => console.log(err));
};

Diceware.getWordlists = function(names) {
    return Promise.all(names.map(name => getWordlist(name)));
};

Diceware.getWordlist = function(name) {
    var options = {
        method: "GET",
        cors: "no-cors"
    };

    return fetch(`http://localhost:8080/wordlist/${name}`, options)
        .then(data => data.json())
        .catch(err => console.error(err.message));
};

Diceware.shuffleArray = function(arr) {
    // https://rosettacode.org/wiki/Sorting_algorithms/Bogosort#JavaScript
    for (
        var j, x, i = arr.length;
        i;
        j = Math.floor(Math.random() * i),
            x = arr[--i],
            arr[i] = arr[j],
            arr[j] = x
    );
    return arr;
};

Diceware.getRandomNumbers = function(length) {
    var numbers;

    if (typeof crypto !== "undefined") {
        numbers = new Uint32Array(length);
        crypto.getRandomValues(numbers);
    } else {
        numbers = new Array(length);
        for (var i = 0; i < length; i++) {
            numbers[i] = Math.floor(Math.random() * 1000000);
        }
    }

    return numbers;
};

Diceware.updatePassphrase = function(phrase) {
    var phraseElement = document.getElementById("phrase");
    phraseElement.innerText = phrase;
};

Diceware.updatePhraseNumber = function(arrLength, numWords) {
    var element = document.getElementById("possible-phrases");
    element.innerText = Math.pow(arrLength, numWords).toLocaleString();
};
