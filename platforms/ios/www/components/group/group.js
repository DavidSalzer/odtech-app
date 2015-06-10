odtechApp.controller('group', ['$rootScope', '$scope', '$state', 'server', '$timeout', 'camera', function ($rootScope, $scope, $state, server, $timeout, camera) {

    $scope.myGroupPoints = "";
    $scope.allGroupsPoints = "";
    $scope.groupMembers = new Array();
    $scope.user;
    $scope.imgDomain = imgDomain;
    $scope.inStep1 = true;
    $scope.getUser = function () {

        server.request({ "type": "getAppUser", "req": {} })
        .then(function (data) {
            $scope.user = data.res;
            if(data.res && data.res.subgroup != null){
                $state.transitionTo('mainNav');
            }
        })

    }
    $scope.getUser();

    $scope.getMembers = function () {
        //get the members - if the user enter group name
        if ($scope.groupNameByInput != "") {
            server.request({ "type": "getCurrUserSGMembers", "req": { "subgroup": $scope.groupNameByInput} })
            .then(function (data) {
                // display the memebres names
                $scope.groupMembers = data.res;

            })
        }

    }


    $scope.joinToGroup = function () {
         $("input").blur();
        server.request({ "type": "updateCurrUserSG", "req": { "subgroup": $scope.groupNameByInput} })
    .then(function (data) {
        console.log(data)
        if (data.res == true) {
            //  alert("הצטרפת בהצלחה")
            $scope.inStep1 = false;
            //get the members
            $scope.getMembers();
        }

      

    })
    }


    $scope.go = function () {
        $rootScope.showDescription = true; //show day description in mainNav.
        //$state.transitionTo('mainNav');
        $rootScope.$broadcast('joinToGroup', {});

        //go to info page
        //$state.transitionTo('info');
        $state.transitionTo('mainNav');
    }


    //$scope.getMyGroupPoints = function () {

    //    server.request({ "type": "getSGPoints", "req": { "subgroup": $scope.groupNameByInput} })
    //.then(function (data) {
    //    console.log(data)
    //    $scope.myGroupPoints = data;
    //})
    //}

    //$scope.getAllGroupsPoints = function () {

    //    server.request({ "type": "getAllSGPoints", "req": {} })
    //.then(function (data) {
    //    console.log(data)
    //    $scope.allGroupsPoints = data;
    //})
    //}

} ]);