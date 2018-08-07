odtechApp.controller('mission', ['$rootScope', '$scope', '$state', '$stateParams', 'missions', '$timeout', 'server', '$filter', function ($rootScope, $scope, $state, $stateParams, missions, $timeout, server, $filter) {

    //mission general parameters
    $scope.startMission = false;
    $scope.finishMission = false;
    $scope.successMission = false;

    $scope.popupShow = false;
    $scope.hasTimer = true;
    $scope.results;
    $scope.showDetailsWrap = false;
    $rootScope.subMissionOpen = -1;
    $scope.missionAnswered = false;
    $scope.showBackBtn = false;
    $scope.introductionData = '';
    $scope.showIntroduction = false;

    $scope.finishTimeout = 0;
    //set mission from server
    $scope.getMission = function (missionID) {
        missions.getMissionById(missionID).then(function (data) {
            console.log(data);
            //if there is error
            if (data.res.error) {
                //if this mission is not in my activity day
                if (data.res.error == "non permission") {
                    //if the day is a staging day -go to stages
                    if ($rootScope.isStationArch) {
                        $state.transitionTo('mainNav', { stageId: $rootScope.currentStage });
                    }
                    //else - go to mainNav
                    else {
                        $state.transitionTo('mainNav');
                    }

                }
            }
            //there is data
            else {
                //if this is a parent mission - set the parent data
                if (data.res.isRouteMission == "0") {
                    $scope.task = data.res;
                    $scope.parentMissionData = data.res;
                    $scope.subMissionsData = data.res.subMission;
                    $scope.introductionData = $scope.parentMissionData;
                    //show the introduction page  
                    //$scope.showIntroductionPage()
                }
                //else - if the data is for subMission
                else {
                    $scope.introductionData = $scope.subMissionsData;
                    //set the subMission data
                    $rootScope.$broadcast('subMissionDataGet', { data: data.res });
                    //show the introduction page  -with submission 
                    // $scope.showIntroductionPage()
                }

                //if the mission has been made
                if (data.res.status == 'answer') {
                    $scope.popupShow = false;
                    $scope.missionAnswered = true;
                    $scope.startMission = true;

                    //hide the introduction page  
                    $scope.hideIntroductionPage();
                    //if the mission that enter to it is a parent mission - show the back btn. else it still hide
                    if (missionID == $scope.parentMissionData.mid) {
                        $scope.showBackBtn = true;
                    }

                }
                //if the status is notAnswer - show the introductionpage
                else if (data.res.status == 'notAnswer') {
                    //show the introduction page  -with submission 
                    $scope.showIntroductionPage();
                }

            }

        });
    };

    $scope.getMission($stateParams.missionId);


    //this function is performed in the end of mission. 
    $scope.endMission = function (results, missionData) {
        $scope.sendFinishMissionToServer(missionData);
        request = {
            type: "sendAnswer",
            req: {
                data: results,
                mid: missionData.mid,
                isRouteMission: missionData.isRouteMission
            }
        };

        server.request(request)
        .then(function (data) {
            missionData.status = 'answer';
            $timeout(function () {
                $scope.missionAnswered = true;
                //if the mission that enter to it is a parent mission
                if (missionData.mid == $scope.parentMissionData.mid) {
                    // show the back btn. else it still hide
                    $scope.showBackBtn = true;
                }
                //else - if its a subMission
                else if (missionData.mid == $rootScope.subMissionOpen.mid) {

                    $rootScope.$broadcast('subMissionAnswer', { data: missionData });
                    //  $scope.updateSubMissionStatus(missionData)
                }

            }, 0);

        });
        //if the timer NOT ended
        //set data and display popup finish mission
        if (!$scope.endTimer) {
            $timeout(function () {
                $scope.successMission = true;
            }, 0);
            if ($rootScope.withoutPoints != true) {
                $scope.finishMission = true;
            }


            //mission finished - throw broadcast
            $rootScope.$broadcast('finishMission', { results: results, timeOver: false });

            //TODO:  להוציא את החלק הזה ל missionFinish
            if (results.points > 0) {
                $scope.finishMissionTitle = $filter('localizedFilter')('_wellDone_');
                $scope.finishMissionL1 = cid === 3 ? $filter('localizedFilter')('_missionCompletedOrpan_') : $filter('localizedFilter')('_missionCompleted_');
                $scope.finishMissionL2 = $filter('localizedFilter')('_earned_') +" "+ results.points+" " + $filter('localizedFilter')('_points_');
            }
            else {
                $scope.finishMissionTitle = '';
                $scope.finishMissionL1 = '';
                $scope.finishMissionL2 = $filter('localizedFilter')('_noPoints_');
            }

            $scope.recievedpoints = results.points;

        }
        //if finish after time is over
        else {
            $timeout(function () {
                $scope.successMission = true;
            }, 0);
            if ($rootScope.withoutPoints != true) {
                $scope.finishMission = true;
            }
            //mission finished - throw broadcast
            $rootScope.$broadcast('finishMission', { results: results, timeOver: true });

            $scope.finishMissionTitle = '';
            $scope.finishMissionL1 = '';
            $scope.finishMissionL2 = $filter('localizedFilter')('_noPoints_');

            $scope.recievedpoints = 0;
        }


        if ($scope.finishTimeout == 0) {
            //if the activity is withput points - the timeout is 100. else- 4000
            var timeoutDuration;
            if ($rootScope.withoutPoints != true) {
                timeoutDuration = 4000;
            }
            else{
                timeoutDuration = 100;
            }
            $scope.finishTimeout = $timeout(function () {
                $timeout(function () {
                    $scope.successMission = false;
                }, 0); //init the parameter -for yellow finsh mission
                $scope.finishMission = false;

                $rootScope.$broadcast('finishMissionHide', { data: missionData });


                //if need to go to next mission automatically.
                //$scope.next = missions.directlyNext($scope.task.mid);
               // if (!$rootScope.delayStartMissionAudio){
                $scope.next = missions.directlyNext(missionData.mid);
                //if need to go next directly and the mission doesnt has did you know - go to next mission
                if ($scope.next && !missionData.didYouKnow) {
                        $state.transitionTo('mission', { missionId: $scope.next });
                  //  }
                }
                else {
                    //if the mission that finished is parentMission
                    if (missionData.isRouteMission == "0") {
                        //if the day is a staging day -go to stages
                        if ($rootScope.isStationArch) {
                            $state.transitionTo('mainNav', { stageId: $rootScope.currentStage });
                        }
                        //else - go to mainNav
                        else {
                            $state.transitionTo('mainNav');
                        }

                    }
                    //else if its submission - close the subMission window
                    else {
                        $rootScope.$broadcast('closeSubMission');
                    }

                  
                }
            
                $timeout.cancel($scope.finishTimeout);
                $scope.finishTimeout = 0;


            }, timeoutDuration);
        }



    };
    
    //if the timer ended
    $scope.$on('endTimer', function (event, data) {
        $timeout(function () {
            $scope.endTimer = true;
            $scope.missionAnswered = true;
            //show the back btn
            $scope.showBackBtn = true;
            $scope.hideDetails();
            if ($scope.task.status != 'answer') {

                $timeout(function () {
                    //play the wrong sound
                    $rootScope.$broadcast('endMissionTimer', {});
                }, 0);

                if ($rootScope.withoutPoints != true) {
                    $scope.finishMission = true;
                }
                $scope.finishMissionTitle = $filter('localizedFilter')('_timesUp_');
                $scope.finishMissionL1 = cid === 3 ? $filter('localizedFilter')('_missionTimeIsUpOrpan_') : $filter('localizedFilter')('_missionTimeIsUp_');
                $scope.finishMissionL2 = cid === 3 ? $filter('localizedFilter')('_tryNextMissionOrpan_') : $filter('localizedFilter')('_tryNextMission_');
                $scope.recievedpoints = 0;

            }
        }, 0);
        if ($rootScope.withoutPoints != true) {

        }
        $timeout(function () {
            $scope.finishMission = false;
        }, 4000);
    });

    $scope.sendFinishMissionToServer = function (missionData) {
        request = {
            type: "missionFinish",
            req: {
                mid: missionData.mid
            }
        }

        server.request(request)
        .then(function (data) {
            console.log(data);
        });
    };
    //user can close inactive mission - user CLICK ON BACK BTN
    $scope.closeMission = function (missionData) {

        var missionData;
        //if the mission that finished is parentMission - return to mainNav
        if ($rootScope.subMissionOpen == -1) {

            missionData = $scope.parentMissionData;
            //if need to go to next mission automatically.
            //if its not the first enter (first exit..)
            $scope.next = missions.directlyNext(missionData.mid);
            if ($scope.next && !missionData.answer && !missionData.didYouKnow) {
                $state.transitionTo('mission', { missionId: $scope.next });
            }
            else {

                if ($rootScope.isStationArch) {
                    $state.transitionTo('mainNav', { stageId: $rootScope.currentStage });
                }
                //else - go to mainNav
                else {
                    $state.transitionTo('mainNav');
                }
            }

        }
        //else if its submission - close the subMission window and close the finish page
        else {
            missionData = $rootScope.subMissionOpen;
            //close the subMission
            $rootScope.$broadcast('closeSubMission');
            //hide the finish miassion
            $scope.finishMission = false;
        }
        //if the mission not answered - close the mission and send to server
        if (missionData.status != 'answer') {
            $rootScope.$broadcast('closeMissionAndSendAnswer', { data: missionData });

        }
        //if the mission answered
        else {
            $rootScope.$broadcast('closeMissionAnswered', { task: missionData });
        }
        $timeout.cancel($scope.finishTimeout);
        $scope.finishTimeout = 0;


    };

    $scope.hideIntroductionPage = function () {

        $timeout(function () {
            $scope.showMissionTab = true;
            $scope.showInstructionTab = false;
            $scope.showIntroduction = false;

            if ($rootScope.subMissionOpen == -1) {

                $scope.showMissionTab = true;
                $scope.showInstructionTab = false;
                $scope.showIntroduction = false;


            }
            else {
                $scope.subShowMissionTab = true;
            }
        }, 0);




        //if this is a parent mission
        if ($rootScope.subMissionOpen == -1) {
            //if yes - if its a second enter - hide details
            if ($scope.parentMissionData.status == "answer") {
                $scope.hideDetails();
                $rootScope.$broadcast('hideIntroduction', { status: 'answer', isSubMission: false });
            }
            //else - show details
            else {
                $scope.showDetails();
                $rootScope.$broadcast('hideIntroduction', { status: 'notAnswer', isSubMission: false });
            }

        }


        //is its a submission
        else {
            $rootScope.$broadcast('hideIntroduction', { status: '', isSubMission: true });
        }



        $scope.startMission = true;
        $scope.popupShow = false;
        $rootScope.$broadcast('startMission');

    }
    $scope.showIntroductionPage = function () {

        $timeout(function () {
            if ($rootScope.subMissionOpen != -1) {

                $scope.introductionData = $rootScope.subMissionOpen;
                $scope.showIntroduction = true;
            }
            //if this is a parent
            else {
                $scope.introductionData = $scope.parentMissionData;
            }

            $rootScope.$broadcast('showIntroductionPage', { data: $scope.introductionData });
        }, 0);




    };

    $scope.showDetails = function () {
        $scope.showDetailsWrap = true;
    };


    $scope.hideDetails = function () {
        $scope.showDetailsWrap = false;
    };

    //cancel the timer of finish popup on getout from this page
    $scope.$on('$destroy', function () {
        $timeout.cancel($scope.finishTimeout);
        $scope.finishTimeout = 0;
    });





} ]);
