odtechApp.factory('server', ['$rootScope', '$stateParams','$http', '$q', function ($rootScope, $stateParams,$http, $q) {

     //var domain = "http://odtech.com.tigris.nethost.co.il/";
    var domain = "http://odtech.co.il.tigris.nethost.co.il/dataManagement/json.api.php";

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
                deferred.resolve(data);
                //console.log(data);
            });

            return deferred.promise;
        }
    }
} ]);