odtechApp.directive('timer', ['$rootScope', '$timeout', 'server', function ($rootScope, $timeout, server) {
    return {
        restrict: 'E',
        templateUrl: './directives/timer/timer.html',
        scope: false,
        link: function (scope, el, attrs) {

            //display the time in the correct format
            scope.displayTimer = function (minutes) {
                var sec_num = minutes //* 60;
                var hours = Math.floor(sec_num / 3600);
                var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                var seconds = sec_num - (hours * 3600) - (minutes * 60);
                if (hours < 10) { hours = "0" + hours; }
                if (minutes < 10) { minutes = "0" + minutes; }
                if (seconds < 10) { seconds = "0" + seconds; }
                var time;
                if (hours == 0) {
                    time = minutes + ':' + seconds;
                }
                else {
                    time = hours + ':' + minutes + ':' + seconds;
                }


                $timeout(function () {
                    scope.displayFormat = time;
                }, 0)

                return time;
            }
            scope.countDownTimer = function () {
                d = new Date();
                d = parseInt(d.getTime() / 1000);
                //decrease the seconds
                scope.currentTime = scope.endTime - d;
                //update the dom
                scope.displayTimer(scope.currentTime);
                //if timer ended
                if (scope.currentTime <= 0) {
                    clearInterval(scope.timerInterval);
                    scope.currentTime = 0;
                    $rootScope.$broadcast('endTimer', {});
                }
            }


            //init the timer run
            scope.initTimer = function () {
                //console.log('initTimer')
                //init the current time value and display
                if (scope.task) {
                    scope.task.timer = scope.task.timer && scope.task.timer.length > 0 && scope.task.timer != "0" ? scope.task.timer : 1;
                    scope.currentTime = scope.task.timer * 60; //convert the minutes to seconds
                    scope.displayTimer(scope.currentTime);

                    // scope.currentTime = scope.task.timer * 60;
                    clearInterval(scope.timerInterval);
                }

            }
            //listen to parent mission and only for him show the timer - freeze
            scope.$watch('parentMissionData', function () {
                if (attrs.type == 'introductionTimer') {
                    scope.initTimer();
                }
            });


            //start run the timer
            scope.startTimer = function () {
                //console.log('startTimer')
                if (scope.task.timer == 0 || scope.task.timer < 0) {
                    scope.displayTimer(0);
                    $rootScope.$broadcast('endTimer', {});
                }
                else {
                    scope.endTime = new Date();
                    scope.endTime = parseInt(scope.endTime.getTime() / 1000) + (scope.task.timer * 60);
                    scope.timerInterval = setInterval(function () {
                        scope.countDownTimer()
                    }, 1000);

                    //send to server that mission start
                    request = {
                        type: "missionStart",
                        req: {
                            mid: scope.task.mid

                        }
                    }

                    server.request(request)
                    .then(function (data) {
                        console.log(data)
                    })

                }

            }
            ////init the current time value and display
            //scope.$watch('startMission', function () {
            //    //check if timer have to start. only on first enter and after 'start' click.
            //    //and if the misiion is not submission
            //    //if (scope.startMission == true && scope.task.status == 'notAnswer' && attrs.type == 'missonTimer' && scope.subMissionOpen == -1) {
            //    //    scope.startTimer()
            //    //}
            //    //init (stop) the timer
            //    //else 
            //    //if (attrs.type == 'introductionTimer') {
            //    //    scope.initTimer();
            //    //}


            //});
            scope.$on('$destroy', function () {
                if (attrs.type == 'introductionTimer') {
                    scope.initTimer();
                }
            });
            scope.$on('hideIntroduction', function (event, data) {
                //if the timer is mission and not introduction. and its a parent mission and not submission
                if (data.status == 'notAnswer' && data.isSubMission == false && scope.timerInterval == undefined) {
                    scope.startTimer()
                }
            });
        },
        replace: true
    };
} ]);