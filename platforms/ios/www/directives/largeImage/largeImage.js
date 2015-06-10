odtechApp.directive('largeImage', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'E',
        templateUrl: './directives/largeImage/largeImage.html',
        link: function (scope, el, attrs) {
            //check touch timing on clock
            scope.$on('openLargeImage', function () {
                var $target = $('<div id="larger-image" style="background-image: url(' + attrs.url + ');"><div id="larger-image-x"></div></div>');
                $('#main-container').append($target);
                $target.fadeIn(300);
            });

            $('#main-container').on("click", "#larger-image-x", function () {
                var $target = $("#larger-image");
                $target.fadeOut(300, function () { $target.remove(); });
            });
        },
        replace: true
    };

    //מופיע במידה וקיים.
    //מציג לאחר סיום המשימה

} ]);