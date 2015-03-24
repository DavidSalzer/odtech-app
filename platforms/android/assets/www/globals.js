var domain = "http://odtech.co.il.tigris.nethost.co.il/dataManagement/json.api.php";
var imgDomain = "http://odtech.co.il.tigris.nethost.co.il/";
var cid = 1;

odtechApp.run(function ($rootScope) {
    $rootScope.getAndoidVersion = function () {
        var ua = ua || navigator.userAgent;
        var match = ua.match(/Android\s([0-9\.]*)/);
        return match ? match[1] : false;
    };

    $rootScope.androidVersion = $rootScope.getAndoidVersion();
    $rootScope.appName = 'מסע ישראלי';

    $rootScope.showDescription = true;
    $.browser.isSmartphone = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())) && $(window).width() < 740 && $(window).height() < 740;

});



/******************attributes directives****************************/
//finish render - ng repeat
odtechApp.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
});

/**********prevent footer movement on input focus*************/


$(document).on('blur', 'input, textarea', function () {

    setTimeout(function () {
        $("#main-container,#main-view").removeClass('keyboard');
        $("html,body").removeClass('keyboard');
        window.scrollTo(document.body.scrollLeft, document.body.scrollTop);

    }, 0);

});
$(document).on('focus', 'input, textarea', function () {

    setTimeout(function () {
        $("#main-container,#main-view").addClass('keyboard');
        $("html,body").addClass('keyboard');

    }, 0);

});

/************************/
//Disable Device Back button
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
    }, false);
}