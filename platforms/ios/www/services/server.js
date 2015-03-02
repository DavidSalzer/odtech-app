odtechApp.factory('server', ['$rootScope', '$stateParams', '$http', '$q', function ($rootScope, $stateParams, $http, $q) {


    return {

        request: function (data) {

            var deferred = $q.defer();
            var httpDetails = {
                url: domain,
                method: "POST",
                data: data,
                contentType: "application/json"
            };

            if (!data.req) {//if it form data
                httpDetails.transformRequest = angular.identity;
                httpDetails.headers = { 'Content-Type': undefined };
                httpDetails.contentType = undefined;
            }

            $http(httpDetails).
            success(function (json) {
                deferred.resolve(json);
                //console.log(json);
            }).
            error(function (data) {
                deferred.reject(data);
                //console.log(data);
            });

            return deferred.promise;
        }
    }
} ]);