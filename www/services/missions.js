odtechApp.factory('missions', ['$rootScope', '$stateParams', '$http', '$q', function ($rootScope, $stateParams, $http, $q) {

    //var domain = "http://odtech.com.tigris.nethost.co.il/";
    var domain = "http://odtech.co.il.tigris.nethost.co.il/dataManagement/json.api.php";

    //var allTags = [];

    return {

        getMissions: function (dayId) {

            var deferred = $q.defer();

            $http({
                url: domain + "api/cube/get_mission_date/?id=" + dayId + "",
                contentType: "application/json",
                dataType: 'jsonp'
            }).
            success(function (json) {
                deferred.resolve(json);
                console.log(json);
            }).
            error(function (data) {
                deferred.resolve(data);
                console.log(data);
            });

            return deferred.promise;


        },

        test:function(){
             var deferred = $q.defer();
            $http({
                url: domain ,
                method:"POST",
                data:{"type":"getMissionOfActivitie","req":{"aid":"2"}},
                contentType: "application/json"
                //dataType: 'jsonp'
            }).
            success(function (json) {
                deferred.resolve(json);
                console.log(json);
            }).
            error(function (data) {
                deferred.resolve(data);
                console.log(data);
            });

            return deferred.promise;
        }


    }
} ]);