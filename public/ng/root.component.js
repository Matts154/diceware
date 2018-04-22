angular.module("diceware").component("root", {
    templateUrl: "./ng/root.template.html",
    controller: rootController
});

function rootController($scope, $q, $mdToast, $mdDialog, wordlistService) {
    var ctrl = this;

    // App variables
    $scope.loading = true;
    $scope.hasError = false;

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
        $scope.loading = true;
        wordlistService
            .getAvailableWordlists()
            .then(res => (ctrl.wordlists = res))
            .then(() => ($scope.loading = false))
            .catch(err => showAlert("Error", getErrorMessage(err.status)))
            .then(() => ($scope.loading = false));
    };

    $scope.go = function() {
        if (ctrl.selectedLists.length === 0) {
            showAlert("", "Choose at least one wordlist");
            return;
        }

        $scope.loading = true;

        generateWordlist()
            .then(generatePassphrase)
            .then(() => ($scope.loading = false));
    };

    $scope.viewWordlists = function() {
        var title = "Available Wordlists";
        var body = `<ul class='wordlist-list'>
            ${ctrl.wordlists.map(list => `<li>${list.name}</li>`).join("\n")}
        </ul>`;
        showAlert(title, body);
    };

    $scope.showHelp = function() {
        var title = "Help";
        var body = `These are categories of words used to generate your passphrase.<br />
            Choose some things that you like!`;
        showAlert(title, body);
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
            ? Object.values(ctrl.wordlists).filter(createFilterFor(query))
            : [];
        return results;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(list) {
            return angular.lowercase(list.name).indexOf(lowercaseQuery) === 0;
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

        return $q
            .resolve(ctrl.wordlist)
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
        return $q
            .resolve(ctrl.selectedLists.map(list => list.id))
            .then(lists => wordlistService.getWordlists(lists))
            .then(data => shuffleArray(data))
            .then(data => (ctrl.wordlist = data))
            .catch(err => {
                $scope.loading = false;
                showAlert("Error", err.message || "An error occurred.");
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
            .hasBackdrop(false) // Off due to flashing
            .title(title)
            .htmlContent(message)
            .ok("Got it!")
            .cancel("Reroll");

        return $mdDialog
            .show(dialogConfig)
            .then(function() {}, generatePassphrase);
    }

    function showAlert(title, message) {
        var dialogConfig = $mdDialog
            .alert()
            .clickOutsideToClose(true)
            .hasBackdrop(false) // Off due to flashing
            .title(title)
            .htmlContent(message)
            .ok("Got it!");

        return $mdDialog.show(dialogConfig);
    }

    function getErrorMessage(status) {
        switch (status) {
            case -1:
                return "The wordlist server is offline. Try again later.";
            case 400:
                return "Invalid wordlist. Try again.";
            case 500:
                return "An error occurred while retreiving your wordlists. Try again later.";
            default:
                return "A new error occurred.";
        }
    }
}
