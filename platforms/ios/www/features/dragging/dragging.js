odtechApp.directive('dragging', ['$timeout', '$interval', '$rootScope', function ($timeout, $interval, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: './features/dragging/dragging.html',
        link: function (scope, el, attrs) {
            scope.imgDomain = imgDomain;
            scope.centerAnchor = true;
            scope.showInnerFolder = false;
            scope.toggleCenterAnchor = function () { $scope.centerAnchor = !$scope.centerAnchor }
           // scope.draggableObjects = [{ url: '../img/dragImg.png' }, { url: '../img/dragImg.png' }, { url: '../img/dragImg.png' }, { url: '../img/dragImg.png' }, { url: '../img/dragImg.png' }, { url: '../img/dragImg.png' }, { url: '../img/dragImg.png' }, { url: '../img/dragImg.png' }, { url: '../img/dragImg.png' }, { url: '../img/dragImg.png' }, { url: '../img/dragImg.png' }, { url: '../img/dragImg.png' }, { url: '../img/dragImg.png' }, { url: '../img/dragImg.png' }, { url: '../img/dragImg.png' }, { url: '../img/dragImg.png' }, { url: '../img/dragImg.png' }, { url: '../img/dragImg.png' }, { url: '../img/dragImg.png'}];
            scope.droppedObjects1 = []; // first folder data
            scope.droppedObjects2 = [];// second folder data
            scope.droppedObjects3 = [];// third folder data
            scope.folderText1 = '' // first folder text
            scope.folderText2 = ''// second folder text
            scope.folderText3 = ''// third folder text
            scope.missionData = {}
            scope.firstTime = true;
            scope.results = {};
            scope.results.answer = [];
            scope.results.points = 0;
            scope.draggedImages =[]
            scope.setData = function () {
                scope.missionData = scope.parentMissionData;
                scope.folderText1 = scope.missionData.foldername1;
                scope.folderText2 = scope.missionData.foldername2;
                scope.folderText3 = scope.missionData.foldername3;
                if (scope.missionData.status == 'answer') {
                    scope.firstTime = false;
                    //set the folders for inner folder
                    scope.droppedObjects1 = scope.missionData.answer.data[0];
                    scope.droppedObjects2 = scope.missionData.answer.data[1];
                    scope.droppedObjects3 = scope.missionData.answer.data[2];

                }
            }
            scope.setData()

            //drag to folder - by folder index
            scope.onDropComplete = function (folderIndex, data, evt) {
                var folderData = 0;
                switch (folderIndex) {
                    case 1:
                        folderData = scope.droppedObjects1;
                        break;
                    case 2:
                        folderData = scope.droppedObjects2;
                        break;
                    case 3:
                        folderData = scope.droppedObjects3;
                        break;
                }
                var index = folderData.indexOf(data);
                //if the img not exist - push it
                if (index == -1) {
                    folderData.push(data);
                }
                var draggedIndex = scope.missionData.photoSummary.indexOf(data);
                //add the dragged img -for V
                //scope.draggedImages[draggedIndex] 
                scope.draggedImages[draggedIndex] = true;

            }


            var inArray = function (array, obj) {
                var index = array.indexOf(obj);
            }

            scope.displayInnerFolder = function (folderIndex) {
                var folderData = 0;
                var folderText = ''
                switch (folderIndex) {
                    case 1:
                        folderData = scope.droppedObjects1;
                        folderText = scope.folderText1
                        break;
                    case 2:
                        folderData = scope.droppedObjects2;
                        folderText = scope.folderText2
                        break;
                    case 3:
                        folderData = scope.droppedObjects3;
                        folderText = scope.folderText3
                        break;
                }
                scope.innerFolderData = folderData;
                scope.innerFolderText = folderText;
                scope.showInnerFolder = true;
            }


            scope.taskEnd = function () {
                //Perform end mission function. need validations
                scope.results.answer = [scope.droppedObjects1, scope.droppedObjects2, scope.droppedObjects3];
                //get point, if the answer was sent in time
                if (!scope.endTimer) {
                    scope.results.points = scope.missionData.points;
                }
                //this addon for sub mission -send the mid too
                scope.endMission(scope.results, scope.missionData); //the param is the answers of user

            }

           scope.$on('closeMissionAndSendAnswer', function (event, data) {
                //round the results points 
                scope.results.points = scope.results.points;
                scope.endMission(scope.results,scope.missionData);
            });

           
            

        },
        replace: true
    };


} ]);
