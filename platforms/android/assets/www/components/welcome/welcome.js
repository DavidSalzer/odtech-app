torScoreApp.controller('welcome', ['$rootScope', '$scope', '$state', '$timeout', function ($rootScope, $scope, $state, $timeout) {

    //$scope.opts = ['*סוג ארוחה', 'חלבי', 'בשרי', 'פרווה'];
    $scope.opts = meals;
    $rootScope.mealId = "";
    $timeout(function () {
        $scope.kindOfMeal = $scope.opts[0];
    }, 0);
    $scope.startReport = function () {
        if ($scope.kindOfMeal.id == 0) {
            if ($scope.notValidNo) {
                $("#meal-type").removeClass('not-valid');
                $("#meal-type").addClass('not-valid');
                $("#meal-type").removeClass('not-valid');
                $timeout(function () {
                    $("#meal-type").addClass('not-valid');
                }, 100);
            }
            // $("#input-meal").addClass('not-valid');
            $timeout(function () {
                $scope.opts[0] = { id: '0', name: '*לא הוזן שדה הארוחה ' };
                $scope.kindOfMeal = $scope.opts[0];
            }, 0);

            $scope.notValid = true;
            $scope.notValidNo = 1;
            return;
        }

        //init the summary local storage
        localStorage.setItem('summaryData', "");
        $rootScope.mealId = $scope.kindOfMeal.id;
        $state.transitionTo('categoryReport', { mealId: $scope.kindOfMeal.id }, { notify: false });
    }
    $scope.selectChanged = function () {
        $scope.notValid = false;
        $scope.notValidNo = 0;
    }
} ]);