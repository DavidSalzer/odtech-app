odtechApp.directive('dayDescription', [
  '$timeout',
  '$interval',
  '$rootScope',
  function($timeout, $interval, $rootScope) {
    return {
      restrict: 'E',
      templateUrl: './directives/dayDescription/dayDescription.html',
      link: function(scope, el, attrs) {
        $rootScope.dayDescriptionWasShown = false;
        scope.dayDescriptionText;
        scope.dayDescriptionAudio;
        scope.topImg;
        scope.bgImg;
        $rootScope.showDayDescription = true;
        scope.$on('getActivitiesData', function(event, data) {
          scope.dayDescriptionText = data.data.res.description;
          scope.dayDescriptionAudio = data.data.res.routeAudioUrl;
          scope.topImg = data.data.res.imgMap;
          scope.bgImg = data.data.res.imgBackground;
          if ($rootScope.dayDescriptionWasShown == false) {
            $rootScope.showDayDescription = true;
            $rootScope.dayDescriptionWasShown = true;
          }
        });
        scope.$on('getMissionsData', function(event, data) {
          scope.dayDescriptionText = data.data.res.description;
          scope.topImg = data.data.res.superActivity.imgMap;
          scope.bgImg = data.data.res.imgBackground;
          scope.dayDescriptionAudio = data.data.res.superActivity.routeAudioUrl;
          console.log(scope.topImg);

          if ($rootScope.dayDescriptionWasShown == false) {
            $rootScope.showDayDescription = true;
            $rootScope.dayDescriptionWasShown = true;
          }
        });

        (scope.closeDescription = function() {
          $rootScope.$broadcast('startDayClick', {
            audio: scope.dayDescriptionAudio
          });

          //   $state.transitionTo('homePage');

          $timeout(function() {
            $rootScope.showDayDescription = false;
          }, 0);
        }),
          scope.$on('logout', function() {
            $rootScope.showDayDescription = false;
            $rootScope.dayDescriptionWasShown = false;
          });
      },
      replace: true
    };
  }
]);
