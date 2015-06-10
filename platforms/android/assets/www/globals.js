/********production********/
var domain = "http://admin.odtech.co.il/dataManagement/json.api.php";
var imgDomain = "http://admin.odtech.co.il/";
/******QA******/
 var domain = "http://adminqa.odtech.co.il/dataManagement/json.api.php";
var imgDomain = "http://adminqa.odtech.co.il/";

/********!1client number!!************/
var cid = 4; // production
 var cid = 1; // QA
/********!1client number!!************/
var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;


odtechApp.run(function ($rootScope) {
     $rootScope.successMedia ;
             $rootScope.failBuzzerMedia ;
              $rootScope.timeoverMedia ;
               $rootScope.applauseMedia;

    $rootScope.getAndoidVersion = function () {
        var ua = ua || navigator.userAgent;
        var match = ua.match(/Android\s([0-9\.]*)/);
        return match ? match[1] : false;
    };

    $rootScope.androidVersion = $rootScope.getAndoidVersion();
    $rootScope.appName = 'מסע ישראלי';

    $rootScope.showDescription = false;
    $.browser.isSmartphone = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())) && $(window).width() < 740 && $(window).height() < 740;

});



/******************attributes directives****************************/
//finish render - ng repeat
odtechApp.filter('newlines', function () {
    return function (input) {
        if (!input) return input;
        var output = input
        //replace possible line breaks.
      .replace(/(\r\n|\r|\n)/g, '<br/>')


        return output;
    };
});

odtechApp.filter('trustedurl', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

/**********prevent footer movement on input focus*************/


$(document).on('blur', 'input[type=text], textarea', function () {

    setTimeout(function () {
        $("#main-container,#main-view").removeClass('keyboard');
        $("html,body").removeClass('keyboard');
        window.scrollTo(document.body.scrollLeft, document.body.scrollTop);

    }, 0);

});
$(document).on('focus', 'input[type=text],input[type=email], textarea', function () {

    setTimeout(function () {
        //if this is app and not desktop - add the class - for scroll page on focus
        // $("#main-container,#main-view").addClass('keyboard');
        //  $("html,body").addClass('keyboard');


    }, 0);

});

$(document).on('keypress', 'input[type=text],input[type=email], textarea', function () {

    if (event.keyCode == 13) {
        //  $("#main-container,#main-view").removeClass('keyboard');
        //  $("html,body").removeClass('keyboard');
    }

});
/************************/
//Disable Device Back button
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
    }, false);
}

function isApp() {
    if (app) {
        //alert("APP");
        return true; // PhoneGap application
    } else {
        //alert("Web");
        return false; // Web page
    }
}

function iOSversion() {

    if (/iP(hone|od|ad)/.test(navigator.platform)) {

        // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>

        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);

        var ver = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];

        if (ver[0] === 8 & ver[1] === 2) alert("גרסת מערכת ההפעלה הזו אינה מאפשרת העלאת תמונות. אנחנו ממליצים לשדרג לגרסה 8.3");

        if (ver[0] === 8) {

            $("body").delegate("input", "focus",

                               function(e) {

                               var self = $(this);

                               $("body").height(screen.availHeight + 50 + self.offset().top/2);

                               setTimeout(function() {

                                          $("html, body").animate({ scrollTop: $(document).height() }, 1000)}, 10);

                               });

            

            

            

            $("body").delegate("input", "blur", resetBodyHeight);

        }

    }

}

iOSversion();

function resetBodyHeight(){
    document.body.style.height = '100%';
}


function anodoidVersion() {
    var ua = navigator.userAgent;
    if (ua.indexOf("Android") >= 0) {
        var androidversion = parseFloat(ua.slice(ua.indexOf("Android") + 8));
        if (androidversion < 4.1) {
            alert("גרסת מערכת ומכשיר זה אינם נתמכים באתר זה.");
        }
    }
}

anodoidVersion();
