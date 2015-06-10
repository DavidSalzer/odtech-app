odtechApp.directive('checkNetwork', ['$state', '$rootScope', '$timeout', function ($state, $rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './directives/checkNetwork/checkNetwork.html',
        link: function (scope, el, attrs) {
            scope.showCheckNetwork = false;
            scope.$on('networkFail', function (event, data) {
                $timeout(function () {
                    scope.contentNum = parseInt(Math.random()*3);
                    scope.showCheckNetwork = true;
                }, 0)
            });
            scope.$on('hasNetwork', function (event, data) {
                $timeout(function () {
                    scope.showCheckNetwork = false;
                }, 0)
            });
        },
        replace: true
    };

} ]);