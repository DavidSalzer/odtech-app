
var odtechApp = angular.module('odtechApp', ['ui.router', 'uiGmapgoogle-maps', 'ngAnimate','ngSanitize','ngDraggable'])

/**** UI Router ****/
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/login");

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
          .state("group", {
              url: "/group",
              views: {
                  "main": {
                      templateUrl: "./components/group/group.html",
                      controller: "group"
                  }
              }
          })
         .state("groupsScore", {
             url: "/groupsScore",
             views: {
                 "main": {
                     templateUrl: "./components/group/groupsScore.html",
                     controller: "groupsScore"
                     //type:"score"
                 }
             }
         })
         .state("info", {
             url: "/info",
             views: {
                 "main": {
                     templateUrl: "./components/info/info.html",
                     controller: "info"
                     //type:"score"
                 }
             }
         })

         .state("stages", {
             url: "/stages",
             views: {
                 "main": {
                     templateUrl: "./components/stages/stages.html",
                     controller: "stages"
                     //type:"score"
                 }
             }
         });
});

//for google maps
odtechApp.config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})



