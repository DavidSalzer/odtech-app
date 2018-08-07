var size = window.innerWidth;

var howManyRight = 0;
var cid;
var groupCode;
var clientName;
var data;
var clientTitle;
var clientDescription;
var clientImage;
var clientLogo;
var isSmartPhone = false;
 //set the cid and group code
cid = getParameterByName("cid");
groupCode = getParameterByName("gcode");


//detect if its smartphone: dont animate
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    if (screen.width < 700 || screen.height < 700) {
        isSmartPhone = true;
    }
}
$(document).ready(function () {

    $("#arrow-stop").click(function () {
        toggleAnimate();
    });
    $("#arrow-up").click(function () {
        prev();
    });
    $("#arrow-down").click(function () {
        play();
    });
   //etClientData()
    getImages();
    attachVideoEvent()
    //set the link url
    //  $("#shareLink").attr('href', "https://www.facebook.com/sharer.php?u=" + location.hostname + "/summaryDay/share.php?cid="+getParameterByName("cid")+"&name="+encodeURI("שלום לך ארץ נהדרת") );
    
})

function toggleAnimate() {
    if (swiper.autoplaying == true) {
        pause()
    }
    else {
        play()
    }
}



function setAudioFile(data) {

    $("#audio source").attr("src", pureDomain + data.endpresentAudio);
    $("#audio")[0].onloadeddata = function () {
        // alert("Browser has loaded the current frame");
    };
    $("#audio")[0].load();
    $("#audio")[0].play()
}

function setClientData() {
   
    switch (cid) {
        case "3":
            clientName = "ODTech";
            clientTitle = 'גם אני השתתפתי בסיור עם אפליקציית אודיטק! ביום פעילות ' + data.name;
            clientImage = pureDomain + 'summaryDay/img/logo_odtech_share.jpg';
            clientLogo = 'img/odtechLogo.png';
            break;
        case "4":
            clientName = "מסע ישראלי";
            break;
        case "5":
            clientName = "יד יצחק בן צבי";
            clientTitle = 'גם אני השתתפתי בסיור של יד בן צבי! ביום פעילות ' + data.name;
            clientImage = pureDomain + 'summaryDay/img/yad-ben-tzvi-share.jpg';
            clientLogo = 'img/icon_splash_ybz.png';
            break;

            

    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getImages() {
    $.ajax({
        url: domain,
        method: "POST",
        data: JSON.stringify({ "type": "getImageOfGroup", "req": { "cid": cid, "code": groupCode} }),
        success: function (result) {
            data = result.res;
            console.log(data);
            setClientData()
            setGlobalData(data);
            setImagesAndVideos(data.imgsArray);
            //set the audio file
            setAudioFile(data);


        },
        error: function (result) {
            var z;
        }
    });


}
//attach events to video
function attachVideoEvent() {
    $("#video-wrapper").on("click", closeVideo);
    $("#x-button").on("click", closeVideo);
}

function closeVideo() {
    $("#video-wrapper").hide();
    $("#embed-player").remove();
    //myPlayer.pauseVideo();
}

//clear the array - contain all the items that have all the data- img/link
function clearData(data) {
    var cleanArr = []
    for (var i = 0; i < data.length; i++) {
        if (data[i] && (data[i].youtube || data[i].url)) {
            cleanArr.push(data[i])
        }
    }
    return cleanArr;
}

setGlobalData = function (data) {
    $("#header_text span").text(data.name);
    $("#logo").attr("src", clientLogo);

    document.title = clientName;
    $("#date").text(setDate(data.date))
}
setImagesAndVideos = function (data) {
    console.log(data.length)
    var data = clearData(data);
    console.log(data.length)
    var length;
    // if (!isSmartPhone) {
    for (var i = 0; i < data.length; i++) {
        var htmlString = "";
        htmlString += appendItem(data[i], i);

        $(".swiper-wrapper").append("<div class='swiper-slide " + i + "'>" + htmlString + "</div>");


    }
    //}
    //else {
    //    for (var i = 0; i < data.length; i = i + 2) {
    //        var htmlString = "";
    //        htmlString += appendItem(data[i], i);
    //        htmlString += appendItem(data[i + 1], i + 1)

    //        $(".swiper-wrapper").append("<div class='swiper-slide " + i + "'>" + htmlString + "</div>");


    //    }
    //}

    initSwiper()

    //$('body').on('click', '.play-btn', function (e) {
    //    playBtnClick()

    //    //pause the auto animation

    //})
}
function playBtnClick(e) {
    pause()
    $(".youtbe-video-wrap").show()
    if (e && e.target) {
        var url;
        if ($(e.target).hasClass('play-btn')) {
            url = $(e.target).parents('.item').attr("data-url")
        }
        else {
            url = $(e.target).attr("data-url")

        }

        $("#iframe-wrapper").append('<iframe id="embed-player" src="https://www.youtube.com/embed/' + url.trim() + '?autoplay=1&rel=0" frameborder="0" allowfullscreen></iframe>')
        $("#video-wrapper").show();
        //pause the audio
        $("#audio")[0].pause()

    }


}
function appendItem(itemData, index) {
    //if its an image
    if (itemData && itemData.type == "img") {
        if (itemData.title) {
            return ' <div class="item  rotate' + index % 5 + '" style="background-image:url(' + pureDomain + itemData.url + ')">' +
                     '<span class="item-title title' + getclassRandom() + '"><span>' + itemData.title + '</span><span class="title-icon"></span></span>' +
                '</div>';
        }
        else {
            return ' <div class="item  rotate' + index % 5 + '" style="background-image:url(' + pureDomain + itemData.url + ')">' +
            //'<span class="item-title">' + itemData.title + '</span>' +
                '</div>';
        }

    }
    //if its a video
    if (itemData && itemData.type == "video") {
        //if there is a youtube video
        if (itemData && itemData.youtube && itemData.youtube.length > 0) {
            if (itemData.title && itemData.title.length > 0) {
                return ' <div  onclick="playBtnClick(event)" data-url="' + itemData.youtube + '" class="item video-item  rotate' + index % 5 + '" style="background-image:url(http://img.youtube.com/vi/' + itemData.youtube + '/0.jpg)"' + ')">' +
 ' <div  data-type="video" style="background-image:url(http://img.youtube.com/vi/' + itemData.youtube + '/2.jpg)">' +
                '<span class="play-btn" ></span>' +
               '<span class="item-title title' + getclassRandom() + '"><span>' + itemData.title + '</span><span class="title-icon"></span></span>' +
                '</div>' +
                '</div>';

            }
            else {
                return ' <div   onclick="playBtnClick(event)" data-url="' + itemData.youtube + '" class="item video-item  rotate' + index % 5 + '" style="background-image:url(http://img.youtube.com/vi/' + itemData.youtube + '/0.jpg)"' + ')">' +
 ' <div  data-type="video" style="background-image:url(http://img.youtube.com/vi/' + itemData.youtube + '/2.jpg)">' +
                '<span class="play-btn"></span>' +
                 '</div>' +
                '</div>';
            }


        }


    }
}

function setDate(unix_timestamp) {
    var date = new Date(parseInt(unix_timestamp));
    var formattedTime =
    date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
    console.log('FORMATTED TIME ' + formattedTime);
    return formattedTime;
}
var swiper;
var rightswipe;
var leftswipe;
function initSwiper() {
    swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: isSmartPhone ? 2 : 4,
        watchSlidesVisibility: true,
        freeModeMomentumBounce: false,
        autoplay: 0.1,
        speed: 4000,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        //autoplayDisableOnInteraction: true,
        loop: false,
        preventClicks: false,
        preventClicksPropagation: false,
        onlyExternal: true,
        freeModeSticky: true,
        shortSwipes: false,
        longSwipes: false,
        onAutoplay: function () {
            //if (swiper && swiper.autoplaying == false) {
            //    play()
            //}

        },
        preloadImages: true

    });
    rightswipe = swiper.slideNext;
    leftswipe = swiper.slidePrev;
    //$(".swiper-container").click(pause)
}

function play() {
    $("#arrow-stop").removeClass('play')
    swiper.stopAutoplay();
    swiper.slideNext = rightswipe;
    swiper.slidePrev = leftswipe;
    swiper.startAutoplay();
    $("#audio")[0].play()


}
function pause() {
    $("#arrow-stop").addClass('play');
    swiper.stopAutoplay()
}

function prev() {
    swiper.stopAutoplay();
    swiper.slideNext = leftswipe;
    swiper.slidePrev = rightswipe;
    swiper.startAutoplay();
    // $(".swiper-button-prev").click()
}


function getclassRandom() {
    return Math.floor((Math.random() * 5) + 1);
}


function share() {

    FB.ui({
        method: 'share_open_graph',
        action_type: 'og.shares',
        display: 'popup',
        action_properties: JSON.stringify({
            object: {
                'og:url': location.href,
                'og:title': clientTitle,
                'og:image': clientImage
            }
        })
    }, function (response) {
        // Action after response
    });

}