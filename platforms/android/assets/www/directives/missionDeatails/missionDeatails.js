odtechApp.directive('missionDeatails', ['$state', '$timeout', function ($state, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './directives/missionDeatails/missionDeatails.html',
        link: function (scope, el, attrs) {


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
            scope.showDetailAutomatic = function () {
                //show the details popup and hide it after 3 minutes
                scope.showDeatails = true;
                $timeout(function () {
                    scope.showDeatails = false;
                }, 3000)
            }
            scope.$watch('startMission', function () {
                //on start mission - show the mission details
                if(scope.startMission == true){
                     scope.showDetailAutomatic()
                }
               

            })
        },
        replace: true
    };

    //מציג את הטיימר למטה עם האיקון
    //משתמש בדירקטיבים של טיימר ואייקון
    //מציג את התאור במדיה ולוחצים על האיקון
    //לוחצים על איקס של התארו מעלים את התאור

} ]);