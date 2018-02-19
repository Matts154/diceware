var app = angular.module("diceware");

app.factory("wordlistService", [
    "$log",
    "$http",
    function($log, $http) {
        var service = {};
        var METHOD = {
            GET: "GET",
            POST: "POST"
        };

        function httpFactory(path, method) {
            var hostname = "localhost";
            var port = 8080;
            var params = {
                url: `http://${hostname}:${port}/${path}`,
                method: method,
                cors: "no-cors"
            };

            function checkStatus(response) {
                if (response.status === 200) {
                    return Promise.resolve(response);
                } else {
                    return Promise.reject(
                        `Status ${response.status}: ${response.statusText}`
                    );
                }
            }

            return $http(params)
                .then(checkStatus)
                .then(res => res.data);
        }

        service.getAvailableWordlists = function() {
            return httpFactory(`wordlist`, METHOD.GET);
        };

        service.getWordlists = function(arr) {
            return Promise.all(arr.map(name => this.getWordlist(name))).then(
                data => new Array().concat(...data)
            );
        };

        service.getWordlist = function(name) {
            return httpFactory(`wordlist/${name}`, METHOD.GET);
        };

        return service;
    }
]);
