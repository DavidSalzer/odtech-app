odtechApp.controller('mission', ['$rootScope', '$scope', '$state', '$stateParams', 'missions', '$timeout', 'server', function ($rootScope, $scope, $state, $stateParams, missions, $timeout, server) {

    //mission general parameters
    $scope.startMission = false;
    $scope.finishMission = false;
    $scope.successMission = false;
    console.log('successMission = false;')
    $scope.popupShow = false;
    $scope.hasTimer = true;
    $scope.results;
    $scope.showDetailsWrap = false
    $scope.subMissionOpen = -1;
    $scope.missionAnswered = false;
    $scope.showBackBtn = false;
    $scope.introductionData = '';
    $scope.showIntroduction = false;
    console.log('$scope.showIntroduction = false;')
    $scope.finishTimeout = 0;
    //set mission from server
    $scope.getMission = function (missionID) {
        missions.getMissionById(missionID).then(function (data) {
            console.log(data);
            //if there is error
            if (data.res.error) {
                //if this mission is not in my activity day
                if (data.res.error == "non permission") {
                    console.log('mainNav 7')
                    $state.transitionTo('mainNav');

                }
            }
            //there is data
            else {
                //if this is a parent mission - set the parent data
                if (data.res.isRouteMission == "0") {
                    $scope.task = data.res;
                    $scope.parentMissionData = data.res;
                    $scope.subMissionsData = data.res.subMission;

                    //show the introduction page  
                    //$scope.showIntroductionPage()
                }
                //else - if the data is for subMission
                else {
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
                    $scope.hideIntroductionPage()
                    //if the mission that enter to it is a parent mission - show the back btn. else it still hide
                    if (missionID == $scope.parentMissionData.mid) {
                        $scope.showBackBtn = true;
                    }

                }
                //if the status is notAnswer - show the introductionpage
                else if (data.res.status == 'notAnswer') {
                    //show the introduction page  -with submission 
                    $scope.showIntroductionPage()
                }

            }

        });
    }

    $scope.getMission($stateParams.missionId);

    //this function is performed in the end of mission. 
    $scope.endMission = function (results, missionData) {

        request = {
            type: "sendAnswer",
            req: {
                data: results,
                mid: missionData.mid,
                isRouteMission: missionData.isRouteMission
            }
        }

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
                else if (missionData.mid == $scope.subMissionOpen.mid) {
                    $scope.updateSubMissionStatus(missionData)
                }

            }, 0)
        })
        //if the timer NOT ended
        //set data and display popup finish mission
        if (!$scope.endTimer) {
            $timeout(function () {
                $scope.successMission = true;
            }, 0)

            console.log('successMission = true;')
            $scope.finishMission = true;

            //mission finished - throw broadcast
            $rootScope.$broadcast('finishMission', { results: results, timeOver: false });

            //TODO:  להוציא את החלק הזה ל missionFinish
            if (results.points > 0) {
                $scope.finishMissionTitle = 'כל הכבוד!';
                $scope.finishMissionL1 = 'ביצעתם את המשימה בהצלחה';
                $scope.finishMissionL2 = 'וצברתם ' + results.points + ' נקודות.';
            }
            else {
                $scope.finishMissionTitle = '';
                $scope.finishMissionL1 = '';
                $scope.finishMissionL2 = 'קיבלתם 0 נקודות';
            }

            $scope.recievedpoints = results.points;

        }
        //if finish after time is over
        else {
           $timeout(function () {
                $scope.successMission = true;
            }, 0)
            console.log('successMission = true;')
            $scope.finishMission = true;
            //mission finished - throw broadcast
            $rootScope.$broadcast('finishMission', { results: results, timeOver: true });

            $scope.finishMissionTitle = '';
            $scope.finishMissionL1 = '';
            $scope.finishMissionL2 = 'קיבלתם 0 נקודות';

            $scope.recievedpoints = 0;
        }


        if ($scope.finishTimeout == 0) {
            $scope.finishTimeout = $timeout(function () {
               $timeout(function () {
                $scope.successMission = false;
            }, 0) //init the parameter -for yellow finsh mission
                $scope.finishMission = false;

                $rootScope.$broadcast('finishMissionHide', { data: missionData });


                //if need to go to next mission automatically.
                //$scope.next = missions.directlyNext($scope.task.mid);
                $scope.next = missions.directlyNext(missionData.mid);
                if ($scope.next) {
                    $state.transitionTo('mission', { missionId: $scope.next });
                }
                else {
                    //if the mission that finished is parentMission
                    if (missionData.isRouteMission == "0") {
                        console.log('mainNav 8')
                        $state.transitionTo('mainNav');

                    }
                    //else if its submission - close the subMission window
                    else {
                        $scope.closeSubMission()
                    }
                }
                $timeout.cancel($scope.finishTimeout);
                $scope.finishTimeout = 0;


            }, 7000)
        }



    }


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
                }, 0)
                $scope.finishMission = true;
                $scope.finishMissionTitle = 'נגמר הזמן.';
                $scope.finishMissionL1 = 'הזמן שנותר לביצוע המשימה תם.';
                $scope.finishMissionL2 = 'נסו שוב במשימה הבאה...';
                $scope.recievedpoints = 0;

            }
        }, 0)
        $timeout(function () {
            $scope.finishMission = false;
        }, 4000)
    });

    //user can close inactive mission - user CLICK ON BACK BTN
    $scope.closeMission = function (missionData) {

        var missionData;
        //if the mission that finished is parentMission - return to mainNav
        if ($scope.subMissionOpen == -1) {

            missionData = $scope.parentMissionData;
            //if need to go to next mission automatically.
            $scope.next = missions.directlyNext(missionData.mid);
            if ($scope.next) {
                $state.transitionTo('mission', { missionId: $scope.next });
            }
            else {
                console.log('mainNav 9')
                $state.transitionTo('mainNav');
            }

        }
        //else if its submission - close the subMission window and close the finish page
        else {
            missionData = $scope.subMissionOpen;
            //close the subMission
            $scope.closeSubMission();
            //hide the finish miassion
            $scope.finishMission = false;
            console.log('finishMission 7')
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


    }

    $scope.hideIntroductionPage = function () {

        $timeout(function () {
            $scope.showIntroduction = false;
            console.log('$scope.showIntroduction = false;')
        }, 0)

        //if this is a parent mission
        if ($scope.subMissionOpen == -1) {
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
            if ($scope.subMissionOpen != -1) {

                $scope.introductionData = $scope.subMissionOpen;
                // console.log('introductionData: ' + $scope.introductionData)
            }
            //if this is a parent
            else {
                $scope.introductionData = $scope.parentMissionData;
                // console.log('introductionData: ' + $scope.introductionData)
            }
            $scope.showIntroduction = true;
            console.log('$scope.showIntroduction = true;')
            $rootScope.$broadcast('showIntroductionPage', { data: $scope.introductionData });
        }, 0)




    }

    $scope.showDetails = function () {
        $scope.showDetailsWrap = true
    }


    $scope.hideDetails = function () {
        $scope.showDetailsWrap = false
    }

    //cancel the timer of finish popup on getout from this page
    $scope.$on('$destroy', function () {
        $timeout.cancel($scope.finishTimeout);
        $scope.finishTimeout = 0;
    });
} ]);
