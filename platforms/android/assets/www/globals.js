 //var domain = "http://adminqa.odtech.co.il/dataManagement/json.api.php";
 //var imgDomain = "http://adminqa.odtech.co.il/";

//var domain = 'http://odtech-v2-admin.co.il.tigris.nethost.co.il/dataManagement/json.api.php';
//var imgDomain = 'http://odtech-v2-admin.co.il.tigris.nethost.co.il/';

/********!1client number!!************/
//var cid = 8; // production -masa
//var cid = 1; // -odtech
//var cid = 0; // QA
//var isPreLoginPage = false;
//var isMapDisplay = false;
//var appName = 'ODTech';
//var allowPushWoosh = false;
//var isPersonalCode = false;
//var isUsingDefaultSounds = false;
//var allowUploadImgOnSignUp = false;
/********!1client number!!************/
var app =
  document.URL.indexOf('http://') === -1 &&
  document.URL.indexOf('https://') === -1;

odtechApp.run(function($rootScope, $timeout, localize) {
  $rootScope.successMedia;
  $rootScope.failBuzzerMedia;
  $rootScope.timeoverMedia;
  $rootScope.applauseMedia;

  $timeout(function() {
    navigator.splashscreen.hide();
  }, 0);

  document.addEventListener('pause', function() {
    $rootScope.$broadcast('stopMusic');
  });

  $rootScope.getAndoidVersion = function() {
    var ua = ua || navigator.userAgent;
    var match = ua.match(/Android\s([0-9\.]*)/);
    return match ? match[1] : false;
  };

  $rootScope.androidVersion = $rootScope.getAndoidVersion();
  $rootScope.appName = appName;
  $rootScope.cid = localStorage.getItem('realCid');
  $rootScope.imgDomain = imgDomain;

  // $rootScope.appName = 'ODTech';
  $rootScope.isPreLoginPage = isPreLoginPage;
  $rootScope.isMapDisplay = isMapDisplay;
  $rootScope.allowUploadImgOnSignUp = allowUploadImgOnSignUp;
  $rootScope.showDescription = false;
  //$rootScope.isLinear = false;
  $.browser.isSmartphone =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      navigator.userAgent.toLowerCase()
    ) &&
    $(window).width() < 740 &&
    $(window).height() < 740;

  $rootScope.initDataInLogout = function() {
    $timeout(function() {
      $rootScope.showStageEnded = false;
      $rootScope.endStagePopupShowed = [];
      $rootScope.showStageDescription = false;
      $rootScope.stageDescPopupShowed = [];
    }, 0);
  };
});

/******************attributes directives****************************/
//finish render - ng repeat
odtechApp.filter('newlines', function() {
  return function(input) {
    if (!input) return input;
    var output = input
      //replace possible line breaks.
      .replace(/(\r\n|\r|\n)/g, '<br/>');

    return output;
  };
});

odtechApp.filter('trustedurl', [
  '$sce',
  function($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  }
]);

odtechApp.filter('localizedFilter', function(localize) {
  return function(input) {
    return localize.getLocalizedString(input);
  };
});

/**********prevent footer movement on input focus*************/

$(document).on('blur', 'input[type=text], textarea', function() {
  setTimeout(function() {
    $('#main-container,#main-view').removeClass('keyboard');
    $('html,body').removeClass('keyboard');
    window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
  }, 0);
});
$(document).on(
  'focus',
  'input[type=text],input[type=email], textarea',
  function() {
    setTimeout(function() {
      //if this is app and not desktop - add the class - for scroll page on focus
      // $("#main-container,#main-view").addClass('keyboard');
      //  $("html,body").addClass('keyboard');
    }, 0);
  }
);

$(document).on(
  'keypress',
  'input[type=text],input[type=email], textarea',
  function() {
    if (event.keyCode == 13) {
      //  $("#main-container,#main-view").removeClass('keyboard');
      //  $("html,body").removeClass('keyboard');
    }
  }
);
/************************/
//Disable Device Back button
var start = 0;

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
  document.addEventListener(
    'backbutton',
    function(e) {
      e.preventDefault();
      //if the user click back twice in 5 minuets - exit app
      elapsed = new Date().getTime();
      if (elapsed - start <= 500) {
        var x;
        navigator.app.exitApp();
      }
      //else - go back
      else {
        window.history.back();
      }
      start = elapsed;
    },
    false
  );
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

    var v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);

    var ver = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];

    if ((ver[0] === 8) & (ver[1] === 2))
      alert(
        'גרסת מערכת ההפעלה הזו אינה מאפשרת העלאת תמונות. אנחנו ממליצים לשדרג לגרסה 8.3'
      );

    if (ver[0] === 8) {
      /*
            $("body").delegate("input", "focus",
 
            function (e) {
 
            var self = $(this);
 
            $("body").height(screen.availHeight + 50 + self.offset().top / 2);
 
            setTimeout(function () {
 
            $("html, body").animate({ scrollTop: $(document).height() }, 1000)
            }, 10);
 
            });
 
 
 
 
 
 
 
            $("body").delegate("input", "blur", resetBodyHeight);*/
    }
  }
}

iOSversion();

function resetBodyHeight() {
  document.body.style.height = '100%';
}

function anodoidVersion() {
  var ua = navigator.userAgent;
  if (ua.indexOf('Android') >= 0) {
    var androidversion = parseFloat(ua.slice(ua.indexOf('Android') + 8));
    if (androidversion < 4.1) {
      alert('גרסת מערכת ומכשיר זה אינם נתמכים באתר זה.');
    }
  }
}

anodoidVersion();

//add the css by client
//var cssName = "colorsAndIconsYIBZ"
var cssName = 'colorsAndIconsOdtech';
$(document).ready(function() {
  $('head').append(
    '<link rel="stylesheet" href="css/' + cssName + '.css" type="text/css" />'
  );
});
//check if a var is numeric
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
