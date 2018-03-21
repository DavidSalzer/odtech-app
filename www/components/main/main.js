odtechApp.controller('main', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

    $scope.$state = $state;
                              $scope.openLink = function(link){
                               window.open(link, '_blank', 'location=yes');
                              }
} ]);

