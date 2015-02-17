odtechApp.directive('timer', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: './directives/timer/timer.html',
        link: function (scope, el, attrs) {

            //display the time in the correct format
            scope.displayTimer = function (minutes) {
                var sec_num = minutes * 60;
                var hours = Math.floor(sec_num / 3600);
                var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                var seconds = sec_num - (hours * 3600) - (minutes * 60);
                if (hours < 10) { hours = "0" + hours; }
                if (minutes < 10) { minutes = "0" + minutes; }
                if (seconds < 10) { seconds = "0" + seconds; }
                var time = hours + ':' + minutes + ':' + seconds;
                $timeout(function () {
                    scope.displayFormat = time;
                }, 0)

                return time;
            }
            scope.countDownTimer = function () {
                //decrease the seconds
                scope.currentTime = scope.currentTime - 1;
                //update the dom
                scope.displayTimer(scope.currentTime);
                if (scope.currentTime == 0) {
                    alert('timer ended!!')
                    clearInterval(scope.timerInterval);

                }
            }
            //init the timer run
            scope.initTimer = function () {
                scope.currentTime = scope.task.timer;
                clearInterval(scope.timerInterval);
            }
            //start run the timer
            scope.startTimer = function () {
                scope.timerInterval = setInterval(function () {
                    scope.countDownTimer()
                }, 1000);
            }
            //init the current time value and display
            scope.currentTime = scope.task.timer;
            scope.displayTimer(scope.currentTime);
            scope.$watch('startMission', function () {
                if (scope.startMission == true) {
                    scope.startTimer()
                }
                //init (stop) the timer
                else {
                    scope.initTimer();
                }


            });
            scope.$on('$destroy', function () {
                scope.initTimer();
            });
        },
        replace: true
    };
} ]);