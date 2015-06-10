odtechApp.controller('splash', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
    //hide the splash after 10 seconds 
    $timeout(function () {
        $scope.showSplash = false
        //$rootScope.$broadcast('hideSplash');
    }, 5000)
} ]);

