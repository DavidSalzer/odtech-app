odtechApp.controller('mainNav', ['$rootScope', '$scope', '$state', 'missions', '$timeout', 'server', 'camera', '$stateParams', function ($rootScope, $scope, $state, missions, $timeout, server, camera, $stateParams) {
    //$scope.imgDomain = imgDomain;
    $rootScope.$broadcast('startLocationWatcher', {});

    $scope.currentMission = 0;

    //close the description page - before main nav
    $scope.closeDescription = function () {
        $timeout(function () {
            $rootScope.showDescription = false;

        }, 0)
        $timeout(function () {
            $scope.scrollToNextMiss()
        }, 100)
        $rootScope.$broadcast('startDayClick');


    }

    //scroll to next mission 
    $scope.scrollToNextMiss = function () {
        $(".mission-wrap")[0].style.webkitOverflowScrolling = 'auto';
        $timeout(function () {
            $(".mission-wrap")[0].style.webkitOverflowScrolling = 'touch';
        }, 500);
        // the next mission index
        var nextIndex = $(".mission-menu-item.start").attr('data-index');

        var oneItemDistance = 0;
        var number = 0;
        //if this is a smartphone -the distance is mission's height
        if ($.browser.isSmartphone) {
            if ($(".mission-menu-item")[0]) {
                oneItemDistance = $($(".mission-menu-item")[1]).offset().top - $($(".mission-menu-item")[0]).offset().top;
                number = nextIndex;
            }
        }
        //else - the distance is mission's width
        else {
            if ($(".mission-menu-item")[0]) {
                oneItemDistance = $($(".mission-menu-item")[0]).offset().left - $($(".mission-menu-item")[1]).offset().left;
                number = $(".mission-menu-item").length - nextIndex;
            }

        }

        //the animate function
        //if this is a smartphone -scroll top
        if ($.browser.isSmartphone) {
            $("#mainnav-wrap").animate({
                //'oneItemDistance / 2' for center the next mission - not must.
                scrollTop: number * oneItemDistance - oneItemDistance
            }, {
                duration: nextIndex * 1500 / 10, //the speed set by the distance
                specialEasing: {
                    width: "linear",
                    height: "easeOutBounce"
                },
                complete: function () {

                }
            });
        }
        //if this is NOT a smartphone -scroll left
        else {
            $(".mission-wrap").animate({
                //'oneItemDistance / 2' for center the next mission - not must.
                scrollLeft: number * oneItemDistance - oneItemDistance / 2
            }, {
                duration: nextIndex * 1500 / 10, //the speed set by the distance
                specialEasing: {
                    width: "linear",
                    height: "easeOutBounce"
                },
                complete: function () {

                }
            });
        }
    }


    //set missions from server
    //if the day is a staging day -get all activities
    if ($rootScope.isStationArch) {
        $rootScope.currentStage = $stateParams.stageId;

        missions.getMissionsOfActivity($stateParams.stageId).then(function (data) {
            //if success.
            if (data.res.mission.length > 0) {
                $scope.setMissions(data.res.mission, "", "")
            }
            //if its a stages arch -check if it the last mission that finish
            // $rootScope.$broadcast('mainnavShowed', { data: data });
        });
    }
    //else -get one activity 
    else {
        missions.getMissions().then(function (data) {

            //if success - get the activity background image
            if(data.res.activitie){
               $scope.activityBg =  data.res.superActivity.imgBackground;
            }
            if (data.res.activitie && data.res.activitie.mission) { //if success - there is missions
                $rootScope.isLinear = parseInt(data.res.activitie.isLinearStation);
                $rootScope.$broadcast('getMissionsData', { data: data });
                //  $rootScope.isLinear = data.res.isLinearStation;
                $scope.setMissions(data.res.activitie.mission, data.res.activitie.description, data.res.activitie.routeAudioUrl)
            }
            //check if need to remove points
            if (data.res && data.res.superActivity && data.res.superActivity.isPoints == '0') {

                $rootScope.withoutPoints = true;
                console.log('points: ' + $rootScope.withoutPoints)
            }
            //check if its english or not - commented out for now till sorted out so we can run local tests on hebrew
            // if (data.res && data.res.superActivity && data.res.superActivity.isEnglish == '1') {

            //     $rootScope.isEnglish = true;
            //     console.log('points: ' + $rootScope.withoutPoints);
            // }
            // else {

            // }

            // $rootScope.withoutPoints = true;
        })

    }

    $scope.setMissions = function (missionsArr, missionsDesc, missionsAudioUrl) {

        //if linear
        if ($rootScope.isLinear) {
            var openIndex = -1;
            var breakTheLoop = false; // if the openIndex detect - not set it again
            //set the lock parameter for missions that didn't done
            for (var i = 0; i < missionsArr.length; i++) {
                //lock the element - if the status is not answer - lock the mission
                if (missionsArr[i].status != 'answer') {
                    missionsArr[i].isLock = true;

                }

                if (!breakTheLoop) { //if the openIndex not detect - continue to serach it
                    //if the current mission is done, and the next mission not answer - open index is the next i
                    if (missionsArr[i].status == 'answer' && missionsArr[i + 1] && missionsArr[i + 1].status != 'answer') {

                        openIndex = i + 1;
                        //detect the open index - and break the loop
                        breakTheLoop = true;
                    }
                    //if its the first mission and it didnt answer
                    if (i == 0 && missionsArr[i].status != 'answer') {
                        missionsArr[i].isLock = false;
                        //detect the open index - and break the loop
                        breakTheLoop = true;

                    }
                }


            }
            //open the mission 
            //if the openIndex is equal to (-1) its say that all the missions done
            if (openIndex != -1) {
                missionsArr[openIndex].isLock = false;
            }


        }

        //save mission list in sevice.
        missions.setMissions(missionsArr);

        $scope.tasks = missionsArr;
        $scope.description = missionsDesc;
        $scope.audioUrl = missionsAudioUrl;


        //has tasks - throw broadcast
        //the timeout is for localstorage option
        $timeout(function () {
            $rootScope.$broadcast('hasTasks', { tasks: missionsArr });
            missions.preloadMissions(missionsArr)
        }, 500)


        //scroll to the next mission
        $timeout(function () {
            $scope.scrollToNextMiss()
        }, 0)




    }
    //go to mission
    $scope.goToMission = function ($index) {
        if ($scope.tasks[$index].isLock != true) {
            //prevent enter to mission when the status is block
            if ($scope.tasks[$index].status != "block") {
                $state.transitionTo('mission', { missionId: $scope.tasks[$index].mid });
            }
        }

        //get indication to block missiob
        //else {
        //    alert('משימה זו חסומה, אנא בצע את המשימות ע"פ הסדר.');
        //}



    }

    $scope.itemOnLongPress = function ($index) {
        $state.transitionTo('mission', { missionId: $scope.tasks[$index].mid });
    }


    //call by directive
    $scope.$on('scrollToNext', function (ngRepeatFinishedEvent) {
        $scope.scrollToNextMiss();
    });




    //האם המסלול לינארי או לא.
    //האם שמים מנעול עבור כל משימה או שזה לא לינארי

    $scope.getBackgroundPhoto = function (task) {
        var background = '';
        if (task.type == 'takePhoto' && task.answer && task.answer.data) {
            //parse the data string to object
            var data = task.answer.data
            //if the data have uri field - the url is local path
            //else - the path is from server
            background = data.photoCenter ? data.photoCenter.uri ? data.photoCenter.uri : data.photoCenter : '';
        }
        //if there is image - show it. else - return empty string
        if (background == '') {
            return '';
        }
        else {
            var fullBack = '';
            //if the data have uri field - the url is local path - return it -without domain
            if (data.photoCenter.uri) {
                fullBack = 'background-image:url(' + background + ')';
            }
            else {
                fullBack = 'background-image:url(' + imgDomain + background + ')';
            }
            //return fullBack; //this was for takePhoto mission that was done
            return '';
        }




    }

    $scope.toShowStageDescription = function () {
        $rootScope.showStageDescription = false;
        $rootScope.stageDescPopupShowed = $rootScope.stageDescPopupShowed ? $rootScope.stageDescPopupShowed : []

        //show the endStageesPopup - only once
        if (!$rootScope.stageDescPopupShowed[$stateParams.stageId]) {
            $timeout(function () {
                $rootScope.showStageDescription = true;
                $rootScope.stageDescPopupShowed[$stateParams.stageId] = true;
            }, 0)


        }
    }
    $scope.toShowStageDescription()



} ]);

