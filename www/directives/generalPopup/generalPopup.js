odtechApp.directive('generalPopup', ['$state', '$rootScope', '$timeout', function ($state, $rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './directives/generalPopup/generalPopup.html',
        link: function (scope, el, attrs) {
            scope.showGeneralPopup = false;
            scope.generalPopupText = "";

            if ($rootScope.generalPopupArgs && $rootScope.generalPopupArgs.generalPopupEvent) {
                $timeout(function () {
                    scope.generalPopupText = $rootScope.generalPopupArgs.generalPopupText;
                    scope.showGeneralPopup = true;
                    $rootScope.generalPopupArgs = {};
                }, 0)
            }

            scope.hideGeneralPopup = function () {
                $timeout(function () {
                    scope.showGeneralPopup = false;
                }, 0)

            }

            scope.$on('displayGeneralPopup', function (event, args) {
                $timeout(function () {
                    scope.generalPopupText = args.generalPopupText;
                    scope.showGeneralPopup = true;
                }, 0)
            });

        },
        replace: true
    };

    //מופיע במידה וקיים.
    //מציג לאחר סיום המשימה

} ]);