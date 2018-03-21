odtechApp.controller('groupsScore', ['$rootScope', '$scope', '$state', 'missions', '$timeout', 'server', 'camera', function ($rootScope, $scope, $state, missions, $timeout, server, camera) {


    //$scope.imgDomain = imgDomain;
   // $rootScope.user = {}
    console.log('22')
    $scope.showMembers = false;
    //set the state - for hide and show the footer
     $scope.$state = $state;
    

    $scope.getGroups = function () {
        //get the members - if the user enter group name
        server.request({ "type": "getAllSGPoints", "req": {} })
            .then(function (data) {
                // display the memebres names
                $scope.groupsList = data.res;

            })
    }
    $scope.getGroups()

    $scope.scoreBtnClick = function () {
        //if the state is groupsScore  - turn back
        if ($state.is('groupsScore')) {
            history.back();

        }
        //else- go to groupsScore page
        else{
            $state.transitionTo('groupsScore');
        }
    }
} ]);

