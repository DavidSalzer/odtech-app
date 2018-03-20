odtechApp.directive('timeline', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'E',
        templateUrl: './directives/timeline/timeline.html',
        scope: true,
        link: function (scope, el, attrs) {
            scope.pointsNumber = [1, 2, 3, 4, 5, 6, 7, 8];
            scope.active = function (index) {
                scope.selectedPoints = index;
            }
        },
        replace: true

    };

} ]);