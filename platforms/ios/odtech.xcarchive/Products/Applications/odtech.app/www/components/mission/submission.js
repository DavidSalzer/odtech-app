odtechApp.directive('submission', ['$state', '$rootScope', '$timeout', function ($state, $rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './components/mission/submission.html',
      
        link: function (scope, el, attrs) {
            scope.showSubMisison = false;
          // scope.showMissionTab = true;
            scope.$on('subMissionDataGet', function (event, data) {
                $rootScope.subMissionOpen = data.data;
            });
            //when finish mission page hide - hide the submission
            scope.$on('finishMissionHide', function (event, data) {
                if (scope.subMissionOpen != -1) {
                    scope.closeSubMission()
                }
            });

            scope.enterSubMission = function (mid) {
                scope.getMission(mid);
                scope.showSubMisison = true;
                scope.hasTimer = false
            }

            scope.closeSubMission = function () {
                //hide the sub misiions wrap
                scope.showSubMisison = false;
                scope.hideIntroductionPage();
                //init the submission ACTIVE data
                $rootScope.subMissionOpen = -1;
            }

            //if the parent misison end or the subMission end - close the subMission(after the finish popup hide
            scope.$on('closeMission', function (event, data) {
                scope.closeSubMission()

            });
             scope.$on('closeSubMission', function (event, data) {
                scope.closeSubMission()

            });
            scope.loaderVisible = false;
            scope.$on('showmissionLoader', function (event, data) {
                scope.loaderVisible = data.show
            });
            scope.$on('subMissionAnswer', function (event, data) {
                scope.updateSubMissionStatus(data)

            });
            scope.updateSubMissionStatus = function (missionData) {
                //update the status to answer on the subMissionsData array
               for(var i =0; i<scope.subMissionsData.length; i++){
                   if(scope.subMissionsData[i].mid == missionData.data.mid){
                       scope.subMissionsData[i].status = "answer"
                   }
               }
            }



        },
        replace: true
    };

} ]);