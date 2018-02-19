angular.module("diceware").component("root", {
    templateUrl: "./ng/root.template.html",
    controller: rootController
});

function rootController($scope, $mdToast, $mdDialog, wordlistService) {
    var ctrl = this;

    // App variables
    $scope.loading = false;
    $scope.hasError = true;

    // Diceware variables
    ctrl.wordlist = [];
    $scope.numWords = 4;

    // View variables
    ctrl.readonly = false;
    ctrl.selectedItem = null;
    ctrl.searchText = null;
    ctrl.selectedLists = [];
    ctrl.autocompleteRequireMatch = true;

    ctrl.querySearch = querySearch;
    ctrl.transformChip = transformChip;

    ctrl.$onInit = function() {
        wordlistService
            .getAvailableWordlists()
            .then(res => (ctrl.wordlists = res))
            .then(() => ($scope.hasError = false))
            .catch(err =>
                showAlert("Error", `${err.statusText || "Connection refused"}`)
            );
    };

    $scope.go = function() {
        if (ctrl.selectedLists.length === 0) {
            showAlert("", "Choose at least one wordlist");
            return;
        }

        generateWordlist().then(generatePassphrase);
    };

    /**
     * Return the proper object when the append is called.
     */
    function transformChip(chip) {
        // If it is an object, it's already a known chip
        if (angular.isObject(chip)) {
            return chip;
        }

        // Otherwise, create a new one
        return { name: chip, type: "new" };
    }

    /**
     * Search for vegetables.
     */
    function querySearch(query) {
        var results = query
            ? ctrl.wordlists.filter(createFilterFor(query))
            : [];
        return results;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(list) {
            return list.indexOf(lowercaseQuery) === 0;
        };
    }

    function shuffleArray(arr) {
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
    }

    function getRandomNumbers(length) {
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
    }

    function updatePhraseNumber(arrLength, numWords) {
        var element = document.getElementById("possible-phrases");
        element.innerText = Math.pow(arrLength, numWords).toLocaleString();
    }

    function generatePassphrase() {
        if (ctrl.wordlist.length === 0) {
            return;
        }

        return Promise.resolve(ctrl.wordlist)
            .then(data => {
                var uIntNumbers = getRandomNumbers($scope.numWords);
                var numbers = Array.prototype.slice.call(uIntNumbers);
                return numbers.map(n => {
                    n = n % data.length;
                    return data[n];
                });
            })
            .then(result => result.join(" "))
            .then(result => showDialog("Passphrase", result));
    }

    function generateWordlist() {
        ctrl.wordlist = [];
        return wordlistService
            .getWordlists(ctrl.selectedLists)
            .then(data => shuffleArray(data))
            .then(data => (ctrl.wordlist = data))
            .catch(err => {
                $scope.hasError = true;
                showAlert("Error", err.message || "Connection refused");
            });
    }

    function shuffleArray(arr) {
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
    }

    function showDialog(title, message) {
        var dialogConfig = $mdDialog
            .confirm()
            // .clickOutsideToClose(true)
            .hasBackdrop(false)
            .title(title)
            .textContent(message)
            .ok("Got it!")
            .cancel("Reroll");

        $mdDialog.show(dialogConfig).then(function() {}, generatePassphrase);
    }

    function showAlert(title, message) {
        var dialogConfig = $mdDialog
            .alert()
            // .clickOutsideToClose(true)
            .hasBackdrop(false)
            .title(title)
            .textContent(message)
            .ok("Got it!");

        $mdDialog.show(dialogConfig);
    }
}
