odtechApp.controller('stages', ['$rootScope', '$scope', '$state', 'missions', '$timeout', 'server', 'camera', function ($rootScope, $scope, $state, missions, $timeout, server, camera) {
    //$scope.imgDomain = imgDomain;
    $rootScope.$broadcast('startLocationWatcher', {});
    $rootScope.stages;
    //get the stages list
    server.request({ "type": "getActivitiesOfAppUserTwo", "req": {} })
        .then(function (data) {
            $rootScope.stages = data.res.activities;
            missions.preloadMissions(data)
            $rootScope.dayDescriptionImg = data.res.imgUrl;
            $rootScope.isLinear = parseInt(data.res.isLinear);
            //$rootScope.isLinear = true
            console.log(data)
           // $scope.user = data.res;
            if (data.res && data.res.subgroup != null) {
                console.log('mainNav 1')
                // $state.transitionTo('mainNav');

            }
              $timeout(function () {
                     $scope.addScrollForIosFunc()
                       
                       }, 0)
              $rootScope.$broadcast('getActivitiesData', { data: data });
        })

    $scope.currentMission = 0;

    //close the description page - before main nav
    $scope.closeDescription = function () {
        $timeout(function () {
            $rootScope.showDescription = false;

        }, 0)

        $rootScope.$broadcast('startDayClick');


    }

   $scope.addScrollForIosFunc = function(){
    //  $(".stage-wrap")[0].style.webkitOverflowScrolling = 'auto';
      $timeout(function(){
           $(".stage-wrap")[0].style.webkitOverflowScrolling = 'touch';
      },2000);
    }
           
                                
    $rootScope.currentStage = 0;
    //$rootScope.currentStageImg = 0;
    $rootScope.currentStageData = 0;

    $scope.goToStageMissions = function (stageData) {
        //$rootScope.currentStageImg = stageData.imgUrl;
        $rootScope.currentStageData = stageData;
        $state.transitionTo('mainNav', { stageId: stageData.aid });

    }

    

} ]);

