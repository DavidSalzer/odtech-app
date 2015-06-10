torScoreApp.directive('popup', ['$state', '$rootScope', '$modal', '$log', '$timeout', function ($state, $rootScope, $modal, $log, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './components/categoryReport/popup.html',
        link: function (scope, el, attrs) {
            scope.items = ['item1', 'item2', 'item3'];

            scope.animationsEnabled = true;
            scope.open = function (event, popupClassType) {
                event.stopPropagation();
                event.preventDefault();
                $("input").blur();
                var modalInstance = $modal.open({
                    animation: scope.animationsEnabled,
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                    resolve: {
                        popupClassType: function () {
                            return popupClassType;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    //scope.selected = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });


            };

        },
        replace: true
    };


} ]);

torScoreApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance, popupClassType, $rootScope, $timeout) {
    $scope.commentText = "";
    $scope.title = 'הוספת טקסט';
    if (popupClassType == "generalPopup") {
        $scope.title = 'הוספת טקסט';
    }
    else {
        $scope.title = 'הערת סוג מנה';
    }

    $scope.commentText = {}
    $scope.commentText.text = ""
    $scope.initPopup = function () {
        var className = '';
        if ($rootScope.activeCategory != -1) {
            className = 'active-' + $rootScope.activeCategory.id
        }


        $("#popup-wrapper").addClass(className);

        $("#popup-wrapper").addClass(popupClassType);
         $timeout(function () {
            $("#write").focus();           
                    }, 10)

        
    }

    $scope.ok = function () {
        // alert('זהו דמו, באפליקציה חיה ההערה תשמר');
        //if its a camera popup - update the text on input
        if (popupClassType == "generalPopup") {
            $rootScope.$broadcast('updateInput', { text: $scope.commentText.text });
        }
        // if is a category popup - update the pencil to full
        else {
            $(".comment-icon").addClass('full')
        }
        $modalInstance.close();
    };

    $scope.clear = function () {
        $scope.commentText.text = ""
        // $modalInstance.dismiss('cancel');
    };
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
});