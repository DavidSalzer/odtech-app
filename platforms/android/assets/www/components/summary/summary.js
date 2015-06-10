torScoreApp.controller('summary', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
   
    $scope.fieldsDataServing = { catName: 'הגשה' };
    $scope.fieldsDataSanitation = { catName: 'סנטציה' };
   
    //if there is local storage data for summary
    $scope.fieldsData =localStorage.getItem('summaryData') && localStorage.getItem('summaryData') !="" ? JSON.parse(localStorage.getItem('summaryData')):[]
    $scope.mealId = $rootScope.mealId//$scope.fieldsData?$scope.fieldsData.mealId: "";
    $scope.fieldsOpenStatus = [false, false, false, false, false, false]//set the open/close accordion
    $scope.oneAtATime = true;
    $scope.sanitationClicked = function () {
        $state.transitionTo('sanitation');
    }
    $scope.servingClicked = function () {
        $state.transitionTo('service');
    }
    $scope.finish = function () {
        alert("תודה רבה, הדיווח נשלח");
        $state.transitionTo('login');
    }
    $scope.exit = function () {
        $state.transitionTo('login');
    }
    $scope.goToCategoryReport = function (catId) {
        $state.transitionTo('categoryReport', { mealId: $scope.mealId, catId:catId});
    }
    $scope.editFieldInCategory = function (id) {
        //go to the category page with const index
        $state.transitionTo('categoryReport', { mealId:$scope.mealId, catId: id });

    }
} ]);