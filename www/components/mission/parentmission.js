odtechApp.directive('parentmission', ['$state', '$rootScope', '$timeout', function ($state, $rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './components/mission/parentmission.html',

        link: function (scope, el, attrs) {

            // scope.showMissionTab = false;
            scope.showInstructionTab = false;

            scope.goToMissionTab = function () {

                scope.hideIntroductionPage()
            }

            scope.goToInstructionTab = function () {

                scope.showInstructionTab = true;
                if (scope.subMissionOpen == -1) {
                    scope.showMissionTab = false;
                }
                else {
                    scope.subShowMissionTab = false
                }

               
            }



            /******help popup******/

            scope.$on('showPopupHelp', function (event, data) {
                scope.showHelpPopup = true;

            });
            scope.hideHelpPopup = function () {
                scope.showHelpPopup = false;
            }
             scope.endMissionByHelp = function () {
                scope.closeMission()
            }

        },
        replace: true
    };

} ]);