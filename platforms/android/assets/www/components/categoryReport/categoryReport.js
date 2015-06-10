torScoreApp.controller('categoryReport', ['$rootScope', '$scope', '$stateParams', '$timeout', '$location', '$state', function ($rootScope, $scope, $stateParams, $timeout, $location, $state) {

    ////set the meal id
    $scope.mealId = $stateParams.mealId;
    $scope.categories = categories; //set the categories 
    //set the categories list ids
    $scope.categoriesIds = meals[$scope.mealId].categoriesList;
    $scope.categoriesByMealList = [];

    $scope.setRelevantCategoryByMeal = function () {
        for (var i = 0; i < $scope.categories.length; i++) {
            //אם המזהה של הקטגוריה נמצא בתך רשימת הקטגוריות של הארוחה הזו
            if ($scope.categoriesIds.indexOf($scope.categories[i].id.toString()) > -1) {

                //set the current categories list-by meal
                $scope.categoriesByMealList.push($scope.categories[i]);
               // console.log(" " + $scope.categories[i].name)
            }
        }


    }
    $scope.setActiveCategory = function (catID) {
        var i = 0;
        var foundFlag = false
        var activeCat = -1;
        while (i < $scope.categories.length && foundFlag == false) {
            if ($scope.categories[i].id == catID) {
                foundFlag = true;
                activeCat = $scope.categories[i];


            }
            i++;
        }
        return activeCat;
    }

    //if there is no category id that chosen - set to default
    if ($stateParams.catId == "") {
        $rootScope.activeCategory = -1; // there is no active category

    }
    else {

        $rootScope.activeCategory = $scope.setActiveCategory($stateParams.catId)
    }


    $scope.categoryChosen = function (catObj, index) {
        $rootScope.showLoader = true;
        
        $timeout(function () {
            $rootScope.activeCategory = catObj;
          //  $rootScope.$broadcast('scrollToCenter');
        }, 0);

         $timeout(function () {
          //  $rootScope.activeCategory = catObj;
            $rootScope.$broadcast('scrollToCenter');
        }, 20);

        $timeout(function () {
          
         
          $rootScope.catFieldsData = fields[$rootScope.activeCategory.id.toString()];
           $state.transitionTo('categoryReport', { mealId: $stateParams.mealId, catId: $rootScope.activeCategory.id }, { notify: false });
        }, 50);
      

         $timeout(function () {
           
         
        }, 0);



        // $timeout(function () {
        //   
        //  $rootScope.$broadcast('scrollToCenter');
        //}, 200);
        //$timeout(function () {
        //   
        //    $rootScope.catFieldsData = fields[$rootScope.activeCategory.id.toString()];
        //}, 250);
        //$timeout(function () {
        //   
        //   $state.transitionTo('categoryReport', { mealId: $stateParams.mealId, catId: $rootScope.activeCategory.id }, { notify: false });
        //}, 300);
       
          
       
       
    }

    $scope.getClass = function () {
        if ($rootScope.activeCategory && $rootScope.activeCategory != -1)
            return 'active-' + $rootScope.activeCategory.id
        else {
            return ''
        }
    }


} ]);