odtechApp.directive('endStage', ['$state', '$stateParams', '$rootScope', '$timeout', function ($state, $stateParams, $rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './directives/endStage/endStage.html',
        link: function (scope, el, attrs) {
            $rootScope.showStageEnded = false;
            $rootScope.endStagePopupShowed = $rootScope.endStagePopupShowed ? $rootScope.endStagePopupShowed : []
            //check if it the last mission that finish
            if (scope.tasks[scope.tasks.length - 1].status == "answer") {
                //if it the last - show the endStageesPopup - only once
                console.log('$rootScope.endStagePopupShowed: ' + $rootScope.endStagePopupShowed)
                if ($rootScope.endStagePopupShowed[$stateParams.stageId] != true) {
                    $rootScope.showStageEnded = true;
                    console.log('showStageEnded =true')
                    $rootScope.endStagePopupShowed[$stateParams.stageId] = true;
                }
            }


            scope.goToNextStage = function () {
                var nextStageData = -1;
                //pass over the satges array and find the current stage
                //detetct the next stage id
                for (var i = 0; i < $rootScope.stages.length; i++) {
                    if ($rootScope.stages[i].aid == $stateParams.stageId) {
                        //if there is a stage - set the nextStageData, else - it still (-1)
                        nextStageData= $rootScope.stages[i + 1] ? $rootScope.stages[i + 1] : -1;
                    }
                }
                //if there is a next stage -go to it
                if (nextStageData != -1) {
                    $rootScope.currentStageData = nextStageData;
                    $state.transitionTo('mainNav', { stageId: nextStageData.aid });
                }
                //else  (if the current is the last - go to stages page
                else {
                    $state.transitionTo('stages');
                }
            }
            scope.goToStagesPage = function () {
                $state.transitionTo('stages');
            }
           


        },
        replace: true
    };

} ]);