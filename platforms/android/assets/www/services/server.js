odtechApp.factory('server', ['$rootScope', '$stateParams','$http', '$q', function ($rootScope, $stateParams,$http, $q) {


    return {

       request: function (data) {

            var deferred = $q.defer();

            $http({
                url: domain ,
                method:"POST",
                data:data,//{"type":"getMissionOfActivitie","req":{"aid":"2"}},
                contentType: "application/json"               
            }).
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