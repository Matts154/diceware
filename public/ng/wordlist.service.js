var app = angular.module("diceware");

app.factory("wordlistService", [
    "$q",
    "$http",
    function($q, $http) {
        var service = {};
        var METHOD = {
            GET: "GET",
            POST: "POST"
        };

        function httpFactory(path, method) {
            var hostname = "wordlist-server.herokuapp.com";
            var port = 80;
            var params = {
                url: `https://${hostname}/${path}`,
                method: method,
                cors: "no-cors"
            };

            function checkStatus(response) {
                if (response.status === 200) {
                    return $q.resolve(response);
                } else {
                    return $q.reject({
                        status: response.status,
                        statusText: response.statusText
                    });
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
            return $q
                .all(arr.map(name => this.getWordlist(name)))
                .then(data => new Array().concat(...data));
        };

        service.getWordlist = function(name) {
            return httpFactory(`wordlist/${name}`, METHOD.GET);
        };

        return service;
    }
]);
