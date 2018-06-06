odtechApp.directive('menu', [
  '$state',
  'server',
  'camera',
  '$rootScope',
  '$timeout',
  function($state, server, camera, $rootScope, $timeout) {
    return {
      restrict: 'E',
      templateUrl: './directives/menu/menu.html',
      link: function(scope, el, attrs) {
        scope.$state = $state;

        $('.menu-mask').click(function(e) {
          $('.menu-wrap').removeClass('openMenu');

          $timeout(function() {
            scope.showMenu = false;
            $rootScope.clearMap();
            $rootScope.$broadcast('menuClosed', {});
          }, 0);
          e.preventDefault();
          e.stopPropagation();
          return false;
        });

        scope.logout = function() {
          $timeout(function() {
            scope.showMenu = !scope.showMenu;
          }, 0);
          //if there is main page - go to user login page
          if ($rootScope.isPreLoginPage) {
            $state.transitionTo('userLogin');
          } else {
            $state.transitionTo('login');
          }

          server
            .request({ type: 'appUserLogout', req: {} })
            .then(function(data) {
              $rootScope.missionIdLastShown = 0;
            });

          $rootScope.$broadcast('stopMusic');
          $rootScope.$broadcast('logout');
        };
        var goRight = true;

        scope.showMenuFunc = function(e) {
          $timeout(function() {
            scope.showMenu = !scope.showMenu;
            $rootScope.$broadcast('toggleMenu', { isShow: scope.showMenu });
          }, 0);
          e.preventDefault();
          e.stopPropagation();
          return false;
        };

        scope.goToScorePage = function() {
          $timeout(function() {
            scope.showMenu = !scope.showMenu;
          }, 0);
          $rootScope.clearMap();
          $state.transitionTo('groupsScore');
        };

        scope.goToMapPage = function() {
          $timeout(function() {
            scope.showMenu = !scope.showMenu;
          }, 0);
          $state.transitionTo('map');
        };

        scope.goToMaiNav = function() {
          $timeout(function() {
            scope.showMenu = !scope.showMenu;
          }, 0);

          if ($rootScope.isStationArch) {
            $state.transitionTo('mainNav', {
              stageId: $rootScope.currentStage
            });
          }
          //else - go to mainNav
          else {
            $state.transitionTo('mainNav');
          }
          $rootScope.clearMap();
        };
        scope.goToStagesPage = function() {
          $timeout(function() {
            scope.showMenu = !scope.showMenu;
          }, 0);
          $state.transitionTo('stages');
          $rootScope.clearMap();
        };
        scope.goToMainPage = function() {
          $timeout(function() {
            scope.showMenu = !scope.showMenu;
          }, 0);
          $state.transitionTo('main');
          $rootScope.clearMap();
        };
        scope.pictures = {};
        //capture the images
        //scope.takePhotoByMenu = function () {
        //    camera.captureImage('photoCenter')
        //    .then(function (data) {
        //        scope.pictures = camera.getPictures();
        //        scope.uploadImagesByMenu();
        //    });
        //}
        ////upload the images
        //scope.uploadImagesByMenu = function () {

        //    //if this is a application version
        //    if (isApp()) {
        //        camera.uploadPhoto(scope.pictures, "img", 1, 'generalCapture')
        //                .then(function (data) {
        //                    //success to upload img
        //                });
        //    }

        //}

        $rootScope.clearMap = function() {
          if ($rootScope.map != undefined) {
            $rootScope.map.clear();
          }
        };
      },
      replace: true
    };
  }
]);
