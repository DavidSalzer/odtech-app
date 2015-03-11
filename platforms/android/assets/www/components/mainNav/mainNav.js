odtechApp.controller('mainNav', ['$rootScope', '$scope', '$state', 'missions', '$timeout', 'server', 'camera', function ($rootScope, $scope, $state, missions, $timeout, server, camera) {

    $scope.currentMission = 0;
    //$scope.isDescription = true;

    //$scope.description = 'תיאור יום הפעילות'; //need to get from server

    $scope.closeDescription = function () {
        $timeout(function () {
            $rootScope.showDescription = false;

        }, 0)
        $timeout(function () {
            $scope.scrollToNextMiss()
        }, 100)
    }

    //set missions from server
    missions.getMissions().then(function (data) {
        //if success.
        if (data.res.activitie && data.res.activitie.mission) {
            $scope.tasks = data.res.activitie.mission;
            $scope.description = data.res.activitie.description;

            //scroll to the next mission
            //$timeout(function () {
            //    $scope.scrollToNext()
            //}, 0)

        }
    });

    //go to mission
    $scope.goToMission = function ($index) {
        //prevent enter to mission when the status is not open
        // if($scope.tasks[$index].status == "done" || $scope.tasks[$index].status == "notAnswer"){
        $state.transitionTo('mission', { missionId: $scope.tasks[$index].mid });
        //  }


    }

    //log out, it here temporarly
    $scope.logout = function () {
        server.request({ "type": "appUserLogout", "req": {} })
        .then(function (data) {
            $state.transitionTo('login');
        })
    }

    //scroll to next mission 
    $scope.scrollToNextMiss = function () {
        //the next mission index
        var nextIndex = $(".mission-menu-item.start").attr('data-index');
       
        var oneItemDistance = 0;
        var number = 0;
        //if this is a smartphone -the distance is mission's height
        if ($.browser.isSmartphone) {
            oneItemDistance = $($(".mission-menu-item")[1]).offset().top - $($(".mission-menu-item")[0]).offset().top;
            number = nextIndex;
        }
        //else - the distance is mission's width
        else {
            oneItemDistance = $($(".mission-menu-item")[0]).offset().left - $($(".mission-menu-item")[1]).offset().left;
            number = $(".mission-menu-item").length - nextIndex;
        }

        // var nextIndex = 4;


        //the animate function
        //if this is a smartphone -scroll top
        if ($.browser.isSmartphone) {
            $("#main-container").animate({
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
    //call by directive
    $scope.$on('scrollToNext', function (ngRepeatFinishedEvent) {
        $scope.scrollToNextMiss();
    });




    //האם המסלול לינארי או לא.
    //האם שמים מנעול עבור כל משימה או שזה לא לינארי

    //מה הסטטוס של כל משימה
    //האם התבצעה או לא וכך להראות מנעול או כבר בוצע...



} ]);

