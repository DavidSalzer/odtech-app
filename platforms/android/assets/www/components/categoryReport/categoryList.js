torScoreApp.directive('categoryList', ['$state', '$rootScope', '$timeout', '$stateParams', function ($state, $rootScope, $timeout, $stateParams) {
    return {
        restrict: 'E',
        templateUrl: function (elem, attrs) {
            //set the template by the attr "type"
            if (attrs.type == 'full') {
                return './components/categoryReport/categoryListFull.html'
            }
            else if (attrs.type == 'horiz') {
                return './components/categoryReport/categoryListHoriz.html'
            }


        },
        link: function (scope, el, attrs) {
            //if the user come from summary-set the category active object (const) - for the mockup
            //if ($stateParams.catId == 3) {
            //    //set the category id
            //    scope.categoryChosen(3);

            //}

            scope.attrs = attrs;
            //scope.getItemWidthFull = function () {
            //    var height = $(".category-item").height();
            //    return 'width:' + height + 'px'


            //}
            scope.getIconWidth = function () {
                var height = $(".category-item .icon").height();
                return 'width:' + height + 'px'
            }
            scope.getItemWidthHoriz = function () {
                var height = $(".category-item").width();
                return 'width:' + height + 'px'


            }
            scope.getIconWidthHoriz = function (last) {
                var height = $(".category-item .icon").height();

                return 'width:' + height + 'px'
            }

            $rootScope.oldActiveCatId = -1;
            if (scope.attrs.type == "horiz") {
                $rootScope.$on('scrollToCenter', function (event, args) {
                    //check if the old activeCat id equal to current  activeCat id -
                    //for prevent duble scroll
                    if (scope.attrs.type == "horiz" && $rootScope.oldActiveCatId != $rootScope.activeCategory.id) {
                       scope.scrollToCenter();
                        $rootScope.oldActiveCatId = $rootScope.activeCategory.id;
                    }


                });
            }
            //scroll to center
            scope.scrollToCenter = function () {
                if ($(".category-item.active")[0] || $rootScope.activeCategory!=-1)  {
                    $timeout(function () {
                        //set the item left position
                        var offsetLeft = $(".category-item.active")[0].offsetLeft;

                        // calculate the (item width * 2 )
                        //לוקח את רוחב החלון ומחלק לשניים
                        //ממנו מוריד את רוחב האלמנט האקטיבי שלנו -כולל הפדינג- ומחלק לשניים
                        var decreaseNum = $(".categories-list.horizontal-list").width() / 2 - ($(".category-item.active").width() + 24) / 2;
                        //מהמיקום האבסולוטי של האקטיב אנחנו מורידים את כל ה  decreaseNum
                        $("#categories-list-horiz").animate({ scrollLeft: offsetLeft - decreaseNum }, 700);
                    }, 10)

                }

            }

            scope.initList = function (last) {
                //if this is the last icon - scrollToCenter
                if (last) {
                    $timeout(function () {
                        scope.scrollToCenter();
                    }, 10)

                }
            }

        },
        replace: true
    };


} ]);