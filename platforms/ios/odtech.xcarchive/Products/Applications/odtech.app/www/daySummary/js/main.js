var size = window.innerWidth;
//var domain = "http://adminqa.odtech.co.il/dataManagement/json.api.php"
//var pureDomain = "http://adminqa.odtech.co.il/"
var domain = "http://odtech-v2-admin.co.il.tigris.nethost.co.il/dataManagement/json.api.php"
var pureDomain = "http://odtech-v2-admin.co.il.tigris.nethost.co.il/"
var howManyRight = 0;
var cid;
var groupCode;
var clientName;
if (size > 1024) {
    howManyRight = 125;


} else if (size >= 992 && size <= 1024) {

    howManyRight = 75;
} else {
    howManyRight = 35;
}
var isSmartPhone = false;
//detect if its smartphone: dont animate
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    if (screen.width < 700 || screen.height < 700) {
        isSmartPhone = true;
    }
}

$('#red-head').css('right', ((size) * 3 / 4) + 'px');
$('#yellow-head').css('left', ((size) * 3 / 4) + 'px');

var headerHeight = ($('#header').height()) + ($('#text-in-head').height()) + 40;

//$('#container-wrapper,#border').css('top', headerHeight + 'px');
//$('#arrows').css('top', (headerHeight + 25) + 'px');
//$('#arrows').css('right', howManyRight + 'px');
$('#container-wrapper,.main-content-wrap').css('height', (window.innerHeight - headerHeight - 60) + 'px');

if (isSmartPhone) {
    $("#arrows").hide()
}

$(window).load(function () {


    $('#container').masonry({
        "itemSelector": ".item",
        "columnWidth": ".grid-sizer"
    });

    //scroll to bottom
    vv = $('.item');
    dd = vv[vv.length - 1];
    dd1 = vv[0];
    var contactTop = $(dd1).position() ? $(dd1).position().top : 0;
    var contactTopPosition = $(dd).position() ? $(dd).position().top : 0; //$(dd).position().top;
    var timer = ($('#container').height()) * 6;


    //if its desktop - the scroll is by animate and btns
    //if (!isSmartPhone) {

    //    $('#arrow-stop').on("click", function (event) {
    //        $("#container-wrapper").stop();
    //        event.stopPropagation();
    //    })

    //    //when you press on up kee
    //    $('#arrow-up').on("click", function (event) {
    //        $("#container-wrapper").stop();
    //        timer = (($('#container').height()) - $(dd).offset().top) * 6
    //        $("#container-wrapper").animate({ scrollTop: contactTop }, timer);
    //        event.stopPropagation();
    //    })
    //    $('#arrow-dwon').on("click", function (event) {
    //        $("#container-wrapper").stop();
    //        timer = $(dd).offset().top * 6;
    //        $("#container-wrapper").animate({ scrollTop: contactTopPosition }, timer);
    //        event.stopPropagation();
    //    })
    //    //when page loades start to scroll down ti end of hpotos
    //    $("#container-wrapper").animate({ scrollTop: contactTopPosition }, timer);
    //    //when user scroll manaually we stop the scrolling
    //    $('#container-wrapper').on("mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function () { $("#container-wrapper").stop(); });


    //}
    //if its smartphone - the scroll is with scroll
  //  else {
        $("#container").css('overflow-y', 'auto');

    //}


    //set the link url
    $("#shareLink").attr('href', "https://www.facebook.com/sharer.php?u=" + location.hostname + "/summaryDay/share.php?cid=5")



});

setClientData()


function setAudioFile(data) {

    $("#audio source").attr("src", pureDomain + data.endpresentAudio);
    $("#audio")[0].load();
     $("#audio")[0].play()
}

function setClientData() {
    //set the cid and group code
    cid = getParameterByName("cid")
    groupCode = getParameterByName("gcode")
    switch (cid) {
        case "3":
            clientName = "ODTech";
            break;
        case "4":
            clientName = "מסע ישראלי";
            break;
        case "5":
            clientName = "יד יצחק בן צבי";
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
        //{ "type": "getImageOfGroup","req":{"cid":5,"code":512084}}
        data: JSON.stringify({ "type": "getImageOfGroup", "req": { "cid": 5, "code": groupCode} }),
        success: function (result) {
            var data = result.res;
            console.log(data);
            console.log(data.imgsArray.length);
            setGlobalData(data)
            setImagesAndVideos(data.imgsArray)
            //set the audio file
            setAudioFile(data)
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
getImages();
attachVideoEvent()



setGlobalData = function (data) {
    $("#header_text span").text(data.name);

    document.title = clientName;
}
setImagesAndVideos = function (data) {
    var length
    for (var i = 0; i < data.length; i++) {

        //if its an image
        if (data[i].type == "img") {
            if (data[i].title) {
                $("#container").append(' <div class="item">' +
                    '<img src="' + pureDomain + data[i].url + '" class="image">' +
                    '<span class="item-title">' + data[i].title + '</span>' +
                '</div>');
            }
            else {
                $("#container").append(' <div class="item">' +
                    '<img src="' + pureDomain + data[i].url + '" class="image">' +
                '</div>');
            }

        }
        //if its a video
        else {
            //if there is a youtube video
            if (data[i].youtube && data[i].youtube.length > 0) {
                if (data[i].title) {
                    $("#container").append(' <div class="item"  data-type="video">' +
                    '<img src="' + 'http://img.youtube.com/vi/' + data[i].youtube + '/1.jpg' + '" class="image">' +
                    '<span class="play-btn" data-url="' + data[i].youtube + '"></span>' +
                    '<video controls> <source src="" type="video/mp4">' +
               '</video>' +
               '<span class="item-title">' + data[i].title + '</span>' +
                '</div>');
                }
                else {
                    $("#container").append(' <div class="item"  data-type="video">' +
                    '<img src="' + 'http://img.youtube.com/vi/' + data[i].youtube + '/1.jpg' + '" class="image">' +
                    '<span class="play-btn" data-url="' + data[i].youtube + '"></span>' +
                    '<video controls> <source src="" type="video/mp4">' +
               '</video>' +
                '</div>');
                }
            }


        }

    }

    $('body').on('click', '.play-btn', function (e) {

        $(".youtbe-video-wrap").show()
        var url = $(this).attr("data-url")
        $("#iframe-wrapper").append('<iframe id="embed-player" src="https://www.youtube.com/embed/' + url.trim() + '?autoplay=1&rel=0" frameborder="0" allowfullscreen></iframe>')
        $("#video-wrapper").show();
        //pause the audio
        $("#audio")[0].pause()
        //pause the auto animation




        //hide the video
        //$('video').hide();
        ////pause all videos
        //$('video').each(function () {
        //    this.pause();
        //    this.currentTime = 0;
        //});
        //get the current url
        //var url = $(this).attr("data-url");
        ////gt the current video
        //var video = $(this).parent(".item").children('video');
        ////set the current url in the video
        //video.children('source').attr('src', pureDomain + url);
        ////show and play the video
        //video.show()
        //video[0].load();
        //video[0].play();
    })
}

function setDate(unix_timestamp) {
    var date = new Date(parseInt(unix_timestamp));


    // Will display time in 10:30:23 format
    var formattedTime = date.getDay() + '.' + date.getDate() + '.' + date.getFullYear();
    return formattedTime;
}