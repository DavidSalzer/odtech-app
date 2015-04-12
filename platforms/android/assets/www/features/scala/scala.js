odtechApp.directive('scala', [function () {
    return {
        restrict: 'E',
        templateUrl: './features/scala/scala.html',
        link: function (scope, el, attrs) {
            scope.results = {};
            scope.results.answer;
            scope.results.points = 0;
            scope.firstTime = true;
            //set the number of options display number in 'double' type
            scope.number = 10;
            scope.getNumber = function (num) {
                return new Array(num);
            }
            //set the num of range options
            scope.max = scope.task.correct == -1 ? 10 : parseFloat(scope.task.option.length);
            scope.ans = 1; //init the range value
            scope.isDisabled = false;

            //if the mission has been made
            if (scope.task.status == 'answer') {
                //hide the finish button
                scope.firstTime = false;
                //disable the range
                scope.isDisabled = "disabled";
                //set the range data
                scope.ans = scope.task.answer.data;


            }
            scope.getHeight = function () {
                var height = 0;
                var right = 0;
                var top = 0;
                if ($(document).width() < "670") {
                    height = $("#main-container").height() * 0.7;
                    right = (height/2.4)*-1;
                    top = height/2;
                    //return height + 'px';
                    return "width:"+height + "px;right:"+right+"px;top:"+top+"px"
                }

            }
            scope.taskEnd = function () {
                //Perform end mission function. need validations
                scope.results.answer = scope.ans;

                //get point, if the answer was sent in time
                if (!scope.endTimer) {
                    //if this is 'correct answer type' -check the answer and the points
                    if (scope.task.correct != -1) {
                        if (scope.ans == scope.task.correct) {
                            scope.results.points = scope.task.points;
                        }

                    }
                    //else - the user get all the points
                    else {
                        scope.results.points = scope.task.points;
                    }


                }
                scope.endMission(scope.results); //the param is the answers of user
            }


            scope.$on('closeMission', function (event, data) {
                scope.endMission(scope.results);
            });

        },
        replace: true
    };
} ]);