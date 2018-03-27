odtechApp.controller('splash', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
    //hide the splash after 10 seconds 
    $rootScope.showSplash = true

    $timeout(function () {
        $rootScope.showSplash = false
        //$rootScope.$broadcast('hideSplash');
    }, 5000)
} ]);

