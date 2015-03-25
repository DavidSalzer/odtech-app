odtechApp.directive('missionDeatails', ['$state', function ($state) {
    return {
        restrict: 'E',
        templateUrl: './directives/missionDeatails/missionDeatails.html',
        link: function (scope, el, attrs) {
            scope.showDeatails = true;

            $(".clock").on('touchstart', scope.startTimingPress);
            $(".clock").on('touchend', scope.checkTimingPress);

            //start timing touch on clock to return to main nav
            scope.startTimingPress = function () {
                returnMainNav =
         setTimeout(function () {
             $state.transitionTo('mainNav');
         }, 3000);
            }

            //check touch timing on clock
            scope.checkTimingPress = function () {
                clearTimeout(adminBreturnMainNavuttonTimer);
            }
        },
        replace: true
    };

    //מציג את הטיימר למטה עם האיקון
    //משתמש בדירקטיבים של טיימר ואייקון
    //מציג את התאור במדיה ולוחצים על האיקון
    //לוחצים על איקס של התארו מעלים את התאור

} ]);