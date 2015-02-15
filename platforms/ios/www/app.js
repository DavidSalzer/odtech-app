var odtechApp = angular.module('odtechApp', ['ui.router'])

/**** UI Router ****/
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/welcome");

    $stateProvider
		.state("welcome", {
		    url: "/welcome",
		    views: {
		        "main": {
		            templateUrl: "./components/welcome/welcome.html",
		            controller: "welcome"
		        }
		    }
		})
        .state("dayDescription", {
		    url: "/dayDescription",
		    views: {
		        "main": {
		            templateUrl: "./components/dayDescription/dayDescription.html",
		            controller: "dayDescription"
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
});


