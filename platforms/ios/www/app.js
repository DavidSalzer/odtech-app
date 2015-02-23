var domain = "http://odtech.co.il.tigris.nethost.co.il/dataManagement/json.api.php";
var imgDomain = "http://odtech.co.il.tigris.nethost.co.il/";
var cid = 1;

var odtechApp = angular.module('odtechApp', ['ui.router', 'uiGmapgoogle-maps'])

/**** UI Router ****/
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/mainNav");

    $stateProvider
		.state("login", {
		    url: "/login",
		    views: {
		        "main": {
		            templateUrl: "./components/login/login.html",
		            controller: "login"
		        }
		    }
		})
    //.state("dayDescription", {
    //    url: "/dayDescription",
    //    views: {
    //        "main": {
    //            templateUrl: "./components/dayDescription/dayDescription.html",
    //            controller: "dayDescription"
    //        }
    //    }
    //})
        .state("mainNav", {
            url: "/mainNav",
            views: {
                "main": {
                    templateUrl: "./components/mainNav/mainNav.html",
                    controller: "mainNav"
                }
            }
        })
         .state("mission", {
             url: "/mission/:missionId",
             views: {
                 "main": {
                     templateUrl: "./components/mission/mission.html",
                     controller: "mission"
                 }
             }
         })
});

//for google maps
odtechApp.config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})

odtechApp.run(function ($rootScope) {
    $rootScope.getAndoidVersion = function () {
        var ua = ua || navigator.userAgent;
        var match = ua.match(/Android\s([0-9\.]*)/);
        return match ? match[1] : false;
    };

    $rootScope.androidVersion = $rootScope.getAndoidVersion();
});


