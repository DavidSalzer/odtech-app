var odtechApp = angular
  .module('odtechApp', [
    'ui.router',
    'ngAnimate',
    'ngSanitize',
    'ngDraggable',
    'ngIOS9UIWebViewPatch',
    'ngMap'
  ])

  /**** UI Router ****/
  .config(function($stateProvider, $urlRouterProvider) {
    var otherwisePage = isPreLoginPage ? '/userLogin' : '/login';
    $urlRouterProvider.otherwise(otherwisePage);

    $stateProvider
      .state('login', {
        url: '/login',
        views: {
          main: {
            templateUrl: './components/login/login.html',
            controller: 'login'
          }
        }
      })
      .state('userLogin', {
        url: '/userLogin',
        views: {
          main: {
            templateUrl: './components/login/userLogin.html',
            controller: 'userLogin'
          }
        }
      })
      .state('pushMessages', {
        url: '/pushMessages',
        views: {
          main: {
            templateUrl: './components/pushMessages/pushMessages.html',
            controller: 'pushMessages'
          }
        }
      })
      .state('mainNav', {
        url: '/mainNav/:stageId',
        views: {
          main: {
            templateUrl: './components/mainNav/mainNav.html',
            controller: 'mainNav'
          }
        }
      })
      .state('mission', {
        url: '/mission/:missionId',
        views: {
          main: {
            templateUrl: './components/mission/mission.html',
            controller: 'mission'
          }
        }
      })
      .state('group', {
        url: '/group',
        views: {
          main: {
            templateUrl: './components/group/group.html',
            controller: 'group'
          }
        }
      })
      .state('groupsScore', {
        url: '/groupsScore',
        views: {
          main: {
            templateUrl: './components/group/groupsScore.html',
            controller: 'groupsScore'
            //type:"score"
          }
        }
      })
      .state('info', {
        url: '/info',
        views: {
          main: {
            templateUrl: './components/info/info.html',
            controller: 'info'
            //type:"score"
          }
        }
      })

      .state('stages', {
        url: '/stages',
        views: {
          main: {
            templateUrl: './components/stages/stages.html',
            controller: 'stages'
            //type:"score"
          }
        }
      })

      .state('map', {
        url: '/map',
        views: {
          main: {
            templateUrl: './components/mapDisplay/mapDisplay.html',
            controller: 'mapDisplay'
          }
        }
      })
      .state('main', {
        url: '/main',
        views: {
          main: {
            templateUrl: './components/main/main.html',
            controller: 'main'
          }
        }
      });
  });
