odtechApp.directive('scala', [function () {
    return {
        restrict: 'E',
        templateUrl: './features/scala/scala.html',
        link: function (scope, el, attrs) {
            scope.results = {};
            scope.results.answer;
            scope.results.points = 0;

          

            scope.$on('closeMission', function (event, data) {
                scope.endMission(scope.results);
            });
        },
        replace: true
    };
} ]);