odtechApp.factory('camera', ['$rootScope', '$stateParams', '$q', function ($rootScope, $stateParams, $q) {

    /*write what the function does.
    write main function
    */
    var zIndexPhoto = '1';
    var Up, Down, Left, Right;
    var vid = '';
    var photoCenterD;
    var photoRightD;
    var photoDownD;
    var photoLeftD;
    var photoUpD;
    var temp = null;
    var photoClicked;
    var pictures = {};
    var photosFilled = 0;
    var numOfPhotosRequired = 0;

    var destinationType; // Sets the format of returned value 
    // device APIs are available
    alert(navigator.camera);
    destinationType = navigator.camera.DestinationType;

    return {
        //methodes
        /*setupImageCaptureMission: function () {
        if (numOfPhotosRequired == 1) {
        $(".photoUp,.photoDown,.photoLeft,.photoRight").hide();
        }
        else {
        $(".photoUp,.photoDown,.photoLeft,.photoRight").show();
        }
        pictures = {};
        photosFilled = 0;
        },*/
        captureImage: function (e) {

            alert(1);

            // e.stopPropagation();
            // photoClicked = e.currentTarget.classList[0];
            navigator.camera.getPicture(function () { alert("success") }, function () { alert("failed") }, //onImageSuccess, onFail,
                {
                quality: 49,
                destinationType: destinationType.FILE_URI,
                targetWidth: 584,
                correctOrientation: true,
                saveToPhotoAlbum: true
            }
            );
        } /*,
        onImageSuccess : function (imageURI) {
            if (pictures[photoClicked] === undefined) {
                photosFilled++;
            }

            pictures[photoClicked] = { imgUri: imageURI };
            $('.' + self.photoClicked + '').html('').css("background-image", 'url(' + self.pictures[self.photoClicked].imgUri + ')');

            //popup The text popUp for img
            openImgDialog();

            //reset position and marks
            resetPhotoPosition();


            // if (photosFilled == 5 || self.numOfPhotosRequired == 1) {
            if (photosFilled == 5) {
                $(".photo-order").show();
                $('.orbit').removeClass('zindexH');
                $('.orbit').addClass('zindexL');
            }
            if (self.numOfPhotosRequired == 1) {
                //cause a click on arrow that save the picture etc.
                $(".photo-continue").click();
                $('.orbit').removeClass('zindexH');
                $('.orbit').addClass('zindexL');
            }




            self.photoOrbit();
        },
        openImgDialog : function () {
            $('#photo-title').css("background-image", 'url(' + self.pictures[self.photoClicked].imgUri + ')').show();
            $('#img-description').val('').focus();
        },
        captureVideo : function (e) {
            e.stopPropagation();
            navigator.device.capture.captureVideo(self.onVideoSuccess, self.onFail, { limit: 1 });
        }*/
    }

} ]);


    /* make it a Singleton */
    /*if (CaptureController.prototype._singletonInstance) {
        return CaptureController.prototype._singletonInstance;
    }
    CaptureController.prototype._singletonInstance = this;

    

    this.attachEvent = function () {

        $('#description-continue').on('click', this, self.addDescription);
        $('#close-title-edit').on('click', this, function () { $('#photo-title-edit').fadeOut(); });
        $('#description-save').on('click', this, self.editTitle);

        $("#mission-photo .photo").on('click', self.captureImage);
        $("#mission-capture-video").on('click', '.video', function (e) {
            self.vid = $(this).attr('id');
            self.captureVideo(e);
        });


        $(".photo-continue").on('click', function () {

            self.addDescriptionToFobject();

            for (var picture in self.pictures) {
                var missionId = generalMissionController.currentMission.id;
                generalMissionController.results[missionId][picture] = self.pictures[picture];
            }
            //self.resetAll();
            $('#mainPhoto').css('background-image', 'none');
            $('#photoUp,#photoDown,#photoLeft,#photoRight').css({ 'background-image': 'none', 'z-index': '1' }).removeClass('zindexH zindexL');
            $('#mainPhoto').html('<p><span>+</span>לחצו להוספת תמונה</p>');
            //Up,Down,Left,Right
            if (Up) Up.destroy();
            if (Down) Down.destroy();
            if (Right) Right.destroy();
            if (Left) Left.destroy();
            navigationController.showMainMenu();
        });

        $(".capture-popup .x").click(function () {

            $(".capture-popup").fadeOut();
            $("#avatars").show();
            $("#additional-info").show();
        });

        $("#vidResult").on('click', this, function () {
            $(".video-result-popup video")[0].pause();
            $(".video-result-popup").fadeOut();
            $("#avatars").show();
            $("#additional-info").show();
        });


        $("body .mission-menu-left, .mission-menu-right, .mission-menu-top, .mission-menu-bottom").on('click', self.setsubImgOnPopup);

        //   this.photoOrbit();
        this.dropStart();
        this.orbitRemovePhoto();


    }


    $scope.addDescription = function () {
        description = $('#img-description').val();
        self.pictures[self.photoClicked].description = description;
        $('.' + self.photoClicked + '').attr('data-description', description);
        $('#photo-title').hide();


        imgUrlF = $('#photo-title').css("background-image");

        switch (self.photoClicked) {
            case 'photoCenter':
                self.photoCenterD = { id: '', content: imgUrlF, title: description, type: 'img' };
                break;
            case 'photoRight':
                self.photoRightD = { id: '', content: imgUrlF, title: description, type: 'img' };
                break;
            case 'photoLeft':
                self.photoLeftD = { id: '', content: imgUrlF, title: description, type: 'img' };
                break;
            case 'photoDown':
                self.photoDownD = { id: '', content: imgUrlF, title: description, type: 'img' };
                break;
            case 'photoUp':
                self.photoUpD = { id: '', content: imgUrlF, title: description, type: 'img' };
                break;
        }
        //data={id:newId,content:imgUrlF,title:description,type:'img'}
        $('#img-description').val('');
    }

    $scope.addDescriptionToFobject = function () {
        newId = finalObj.length + 1;

        self.photoCenterD.id = 'finalObj' + newId +'';
        finalObj.push(self.photoCenterD);

        newId = newId + 1;
        self.photoRightD.id = 'finalObj' + newId +'';
        finalObj.push(self.photoRightD);

        newId = newId + 1;
        self.photoLeftD.id = 'finalObj' + newId +'';
        finalObj.push(self.photoLeftD);

        newId = newId + 1;
        self.photoDownD.id = 'finalObj' + newId +'';
        finalObj.push(self.photoDownD);

        newId = newId + 1;
        self.photoUpD.id = 'finalObj' + newId +'';
        finalObj.push(self.photoUpD);
    }


    $scope.onVideoSuccess = function (videoURI) {
        var i, path, len;
        newVid = self.vid;

        path = videoURI[0].fullPath;
        //alert(path);
        var missionId = generalMissionController.currentMission.id;
        if (generalMissionController.results[missionId].video) {
            generalMissionController.results[missionId].video.push({ cap: self.vid, src: path });
            self.setVideoOnMenu(self.vid, path);
        } else {
            generalMissionController.results[missionId].video = [];
            generalMissionController.results[missionId].video.push({ cap: self.vid, src: path });
            self.setVideoOnMenu(self.vid, path);
        }

        generalMissionController.results[generalMissionController.currentMission.id].photoCenter = "./img/temp/main_nav_vid.jpg";
        //show tumbnaill
        $('#' + self.vid + '').html('<video poster src="' + path + '" class="capVidPoster"></video>');


        //if all are full
        if ($('#mission-capture-video .capVidPoster').length == 3) {
            //$('#'+missionId+'').css('left','340px');
            navigationController.showMainMenu();
        }

        $(".mission-menu-item").show();

        newId = finalObj.length + 1;
        data = { id: 'finalObj' + newId +'', content: path, title: 'צילום סרטון', type: 'mov' }
        finalObj.push(data);
    }


    $scope.setVideoOnMenu = function (pos, src) {
        var missionId = generalMissionController.currentMission.id;
        //var html='<video poster src="'+src+'" class="movShowBig" id="showBigMov"></video>';
        switch (pos) {
            case 'capture-video-left':
                $('#' + missionId + 'CenterVid').attr('src', src);
                $('#' + missionId + 'CenterVid').parent('div').addClass('playMe');
                break;
            case 'capture-video-right':
                $('#' + missionId + 'RightVid').attr('src', src);
                $('#' + missionId + 'RightVid').parent('div').addClass('playMe');
                break;
            case 'capture-video-clip':
                $('#' + missionId + 'LeftVid').attr('src', src);
                $('#' + missionId + 'LeftVid').parent('div').addClass('playMe');
                break;
        }
    }

    $scope.onFail = function (message) {
        alert('Failed because: ' + message);
    }

    ///drag and drop 	
    $scope.photoOrbit = function () {
        //alert("0");
        $('.orbit').each(function (index, element) {
            // alert("1");
            var imgId = $(this).attr('id');
            if ($('#' + imgId + '').css('background-image').indexOf("url(") >= 0) {
                zIndexPhoto = '10';
                $('#' + imgId + ' span').html('');

                self.canTakePhoto();


            }
            // self.resetPhotoPosition();
        });
    }


    $scope.canTakePhoto = function () {
        var allInPlace = 0;
        if ($('#photoUp').css('background-image').indexOf("url(") >= 0) {
            allInPlace = allInPlace + 1;
        }
        if ($('#photoDown').css('background-image').indexOf("url(") >= 0) {
            allInPlace = allInPlace + 1;
        }
        if ($('#photoLeft').css('background-image').indexOf("url(") >= 0) {
            allInPlace = allInPlace + 1;
        }
        if ($('#photoRight').css('background-image').indexOf("url(") >= 0) {
            allInPlace = allInPlace + 1;
        }

        if (allInPlace == 4) {
            $('.orbit').removeClass('zindexH').addClass('zindexL');
            self.resetPhotoPosition();
        }
    }


    $scope.dropStart = function () {
        webkit_drop.add('mainPhoto',
			{ onOver: function () { $('#mainPhoto').css('background-color', 'red') },
			    onOver: function () { $('#mainPhoto').css('background-image', ' url(../img/RegistrationPlus.png);'); console.log('hover') },
			    onDrop: function () {

			        nbg = $('.photoDrag').css('background-image');
			        obg = $('#mainPhoto').css('background-image');
			        $('#mainPhoto').css('background-image', nbg);
			        $('.photoDrag').css('background-image', obg);

			        newDescript = $('.photoDrag').attr('data-description');
			        oldDescript = $('#mainPhoto').attr('data-description');
			        $('#mainPhoto').attr('data-description', newDescript);
			        $('.photoDrag').attr('data-description', oldDescript);


			        self.pictures[$('.photoDrag').attr("id")] = obg.substring(4, nbg.length - 1);
			        self.pictures['photoCenter'] = nbg.substring(4, nbg.length - 1);

			        if ($('.photoDrag').css('background-image').indexOf("url(") >= 0) {
			            $('.photoDrag span').html('');
			        }
			        else {
			            $('.photoDrag .deleteOrbit').hide();
			        }
			        $('.orbit').removeClass('photoDrag');
			        self.resetPhotoPosition();

			        if ($('#mainPhoto').css('background-image').indexOf("url(") >= 0) {
			            color = $('#timer').css('color');
			            $(".message-text-popup h2").css('color', color);
			            $(".message-text-popup .textMessage h2").text("יופי של תמונה");
			            $(".message-text-popup .textMessage p").text("לחצו לאישור");
			            $(".message-text-popup").show();
			            setTimeout(function () { $(".message-text-popup").hide(); }, 3500);
			        }

			    }
			}
		);

        //del big img
        $('#mainPhoto .delete').on('click', this, function () {
            $('#mainPhoto').css('background-image', 'none');
            $('#mainPhoto p').html('<span>+</span>לחצו להוספת תמונה');
            $(this).hide();
        });

    }

    $scope.removeImg = function (imgItem) {
        //remove from html
        cid = imgItem.attr('id');
        $('#' + cid + ' ').html('<span>+</span>');

        //remove from data
        self.pictures[cid] = "";
    }

    $scope.resetPhotoPosition = function (isFirst) {
        //check bg img
        var isUrl = 0;
        var isplus = 0;

        $('.orbit').each(function (index, element) {
            cid = $(this).attr('id');
            if ($(this).css('background-image').indexOf("url(") >= 0) {
                $('#del' + cid + '').show();
                isUrl = isUrl + 1;
            } else {
                if (isFirst) {
                    $('#' + cid + ' ').html('');
                } else {
                    $('#' + cid + ' ').html('<span>+</span>');
                }
                $('#del' + cid + '').hide();
            }
        });

        $('.orbit span').each(function (index, element) {
            if ($(this).html() == '+') {
                isplus = isplus + 1;
            }
        });

        if (isplus > 0) {
            //zIndexPhoto = 10;
            $('.orbit').removeClass('zindexL');
            $('.orbit').addClass('zindexH');
        }

        //check bg img for main img
        if ($('#mainPhoto').css('background-image').indexOf("url(") >= 0) {
            $('#mainPhoto p').html('');
            $('#mainPhoto .delete').show();
        } else {
            $('#mainPhoto p').html('<span>+</span>לחצו להוספת תמונה');
            $('#mainPhoto .delete').hide();
        }
        //yishai pot this in the mark to change to responcive
        //$('.photoLeft').css({ 'top': '310px', 'left': '150px' }); //, 'z-index': zIndexPhoto
        //$('.photoDown').css({ 'top': '510px', 'left': '425px' }); //, 'z-index': zIndexPhoto
        //$('.photoRight').css({ 'top': '345px', 'left': '712px' }); //, 'z-index': zIndexPhoto
        //$('.photoUp').css({ 'top': '120px', 'left': '375px' }); //, 'z-index': zIndexPhoto
    }

    $scope.orbitRemovePhoto = function () {
        $('.deleteOrbit').on('click', this, function () {
            pos = $(this).attr('pos');
            $('#' + pos + '').css('background-image', 'none');
            $(this).hide();
            //self.resetPhotoPosition();
            imgItemId = $(this).attr("pos");
            self.removeImg($("#" + imgItemId));
        });

    }

    $scope.setMainImgOnPopup = function (imgItem) {
        var mainImgSrc = "";
        //if the click occured on the lock btn
        if ($(imgItem).hasClass("lock")) {
            mainImgSrc = $(imgItem).parent(".mission-menu-center").css("background-image");
        }
        else {
            mainImgSrc = $(imgItem).css("background-image");
        }

        self.setAndShowImgOnPopup(mainImgSrc);
        //insert the description
        titleEdit = $(imgItem).attr('data-description');
        $('#img-title-edit').val(titleEdit);
    }

    $scope.setsubImgOnPopup = function (e) {
        //if there is an img
        if ($(this).hasClass("contain-img")) {
            var imgSrc = $(this).css("background-image");
            self.setAndShowImgOnPopup(imgSrc);
        }
        e.stopPropagation();
    }

    $scope.setAndShowImgOnPopup = function (src) {
        $("#photo-title-edit").css("background-image", src);

        //hide the footer and header
        $("#avatars").hide();
        $("#additional-info").hide();

        $("#photo-title-edit").fadeIn();
    }

    $scope.showClipFullScreen = function (src) {
        $("#result-video source").remove();
        $(".video-result-popup").show();
        $("#result-video").html('<source src="' + src + '" type="video/mp4"></source>');
        document.getElementById("result-video").play();

        //listener for end mov		
        document.getElementById('result-video').addEventListener('ended', myHandler, false);
        function myHandler(e) {
            if (!e) { e = window.event; }
            $(".video-result-popup .x").click();
            // What you want to do after the event
            //  $('.fullMovie').addClass('blur');
            //  $('.playAgain ,.writeClaim').show();
        }
    }


    $scope.editTitle = function (e) {
        valText = $('#img-title-edit').val();
        //do something...
        generalMissionController.results[missionId][picture].description = valText;
        $('#photo-title-edit').fadeOut();
    }

    ///////////////////////////////////////reset all//////////////////////////////////////////

    $scope.resetAll = function () {
        $('#mainPhoto').css('background-image', 'none');
        $('#photoUp,#photoDown,#photoLeft,#photoRight').css({ 'background-image': 'none', 'z-index': '1' }).removeClass('zindexH zindexL');
        $('#mainPhoto').html('<p><span>+</span>לחצו להוספת תמונה</p>');
        //Up,Down,Left,Right

        //  var h = $("#mission-photo").html();
        // $("#mission-photo").html(h)
        //self.attachEvent();
        //self.photoOrbit();


        if (Up) Up.destroy();
        if (Down) Down.destroy();
        if (Right) Right.destroy();
        if (Left) Left.destroy();

        // $("#photoRight").removeEventListener("touchstart");

    }
    */

    /***************CLIP SECTION******************************/


    /*//check if before the clip we have to show a movie
    this.checkClipType = function () {
        //if there is a movie url
        if (generalMissionController.currentMission.videoURL) {
            $("#fullMovieClip source").attr("src", generalMissionController.currentMission.videoURL);
            $("#fullMovieClip")[0].load();
            $("#capture-video-movie").show();
            $("#capture-video-clip").hide();
            //set the help popup
            fixedInfoController.setHelpPopupText("watch-video");

        }
        else {

            $("#capture-video-clip").show();
            $("#capture-video-movie").hide();

            //set the help popup
            fixedInfoController.setHelpPopupText("capture-video");

        }
    }*/






