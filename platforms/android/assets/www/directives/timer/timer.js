odtechApp.directive('timer', [ function () {
    return {
        restrict: 'E',
        templateUrl: './directives/timer/timer.html',
        link: function (scope, el, attrs) {           
        },
        replace: true
    };
} ]);