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
});
