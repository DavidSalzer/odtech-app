odtechApp.directive('endActivity', ['$state', '$rootScope', '$timeout', function ($state, $rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './directives/endActivity/endActivity.html',
        link: function (scope, el, attrs) {
            scope.showEndActivity = false;
            scope.lastMissionShowed = false;
            scope.$on('lastMissionFinished', function (event, data) {
                $timeout(function () {
                    if (!scope.lastMissionShowed) {
                        //scope.showEndActivity = true;
                        scope.lastMissionShowed = true;
                    }
                }, 0)
            });

            scope.hideEndActivity = function () {
                $timeout(function () {
                    scope.showEndActivity = false;
                }, 0)
            }
        },
        replace: true
    };

} ]);