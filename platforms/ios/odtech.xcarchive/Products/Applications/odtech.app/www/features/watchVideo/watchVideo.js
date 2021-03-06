var mainPlayer;
var player;
odtechApp.directive('watchVideo', ['$window', '$timeout', '$filter', function ($window, $timeout, $filter) {
    return {
        restrict: 'E',
        templateUrl: './features/watchVideo/watchVideo.html',
        link: function (scope, el, attrs) {
            scope.missionData = scope.task;
            scope.results = {};
            scope.results.answer =[];
            scope.results.points = 0;
            scope.uploadText = $filter('localizedFilter')('_videoIsLoading_');
            //if the mission has been made
            if (scope.missionData.status == 'answer') {
            }

            scope.player;
            scope.startYoutube = false;
            var player;
            scope.endMovie = false;
            scope.playing = false; //set the playing status
            scope.showPoster = true; //  set the display of poster && 'continue' && 'finish' 
            scope.movieCtrl = false;
            scope.isYoutube = true;
            scope.IsBlur = false; // set the blur class
            scope.imgDomain = imgDomain;

            scope.attachEventByVideoType = function () {
                //if youtube player initialize befor get youtubeID - update now
                if (scope.isYoutube && scope.player) {
                    scope.player.cueVideoByUrl("http://www.youtube.com/v/" + scope.missionData.youtubeID + "?version=3&fs=0");

                    scope.posterImage = "http://img.youtube.com/vi/" + scope.missionData.youtubeID + "/0.jpg";
                    scope.showPoster = false;
                } else if (scope.isYoutube) {
                    scope.initPlayer();
                    scope.posterImage = " http://img.youtube.com/vi/" + scope.missionData.youtubeID + "/0.jpg";
                    scope.showPoster = false;
                    //attach general video events
                } else if (!scope.isYoutube) {
                  //  scope.generalVideoEvents();
                  //  $("#fullMovie").html('<source src="' + imgDomain + scope.missionData.videoURL + '" type="video/mp4"></source>');
                    //set the poster image from admin
                    //scope.posterImage
                }



            };


            /**********************youtube functions**************************/
            //init youtube player
            scope.initPlayer = function () {
                scope.youtubeReset = true;
                scope.player = new YT.Player('youtube-url-video', {
                    height: '100%',
                    width: '100%',
                    playerVars: { 'controls': 1, 'fs': 0 },
                    videoId: scope.missionData.youtubeID,
                    events: {
                        'onReady': scope.playerReady,
                        'onStateChange': scope.playerStateChange
                    }
                });



            }

            //init event
            $window.onYouTubeIframeAPIReady = function () {
                scope.initPlayer();
            }

            //youtube player is ready and user allready press on continue
            scope.playerReady = function () {
                if (scope.startYoutube) {
                    scope.player.playVideo();
                }
                scope.showLoader = false;
            }

            //handel event that player is change->need to know when finish
            scope.playerStateChange = function (newState) {
                //if finish
                if (newState.data == 0) {
                    scope.playing = false;



                    //if this is a second enter -hide the poster and buttons
                    if (scope.missionData.status != 'answer') {

                        $timeout(function () {
                            scope.showPoster = true;
                            scope.movieCtrl = true;
                        }, 100)
                        scope.endMovie = true;
                    }
                    else {

                        scope.endMovie = true;
                    }
                   
                     scope.player.destroy();
                      setTimeout(function () {
                       

                        scope.startYoutube = false;
                        //scope.initPlayer();

                    }, 100);

                }
            }


            /********************general video functions**************************/
            //listener for end mov
            scope.fullMovieHandler = function (e) {
                if (!e) { e = window.event; }
                scope.endMovie = true;
                scope.playing = false;
                //if this is a first time enter and the movie end - show the poster and the buttons for exitand replay
                if (scope.missionData.status != 'answer') {
                    $timeout(function () {
                        scope.showPoster = true;
                        scope.showPlayBtn = false;
                        scope.movieCtrl = true;

                    }, 100)
                }
                else {
                    $timeout(function () {
                        scope.showPlayBtn = true;
                    }, 100)
                }



            }

            scope.generalVideoEvents = function () {

                document.getElementById('fullMovie').addEventListener('ended', scope.fullMovieHandler, false);
                scope.showPlayBtn = true;

            }

            scope.getPoster = function () {
                var background = "";
                if (scope.posterImage && scope.posterImage.length > 0) {
                    background = 'url(' + scope.posterImage + ')';
                }
                else {
                    background = 'url(~/../img/poster.png)';
                }
                return { 'background-image': background }
            }
            /***********************geneal functions******************************/

            // remove blur class and hide video controls
            scope.removeBlur = function () {
                $timeout(function () {
                    scope.showPoster = false;
                    scope.movieCtrl = false;
                }, 100)
            }

            scope.$watch('startMission', function (newVal, oldVal) {
                if (scope.startMission == true && scope.missionData.status == 'notAnswer') {
                }

            });

            //update the movie from server
            scope.$watch('task', function (newVal, oldVal) {
                //check if the video type is yoputube or general
                if (scope.missionData.videoURL) {
                    scope.isYoutube = false;
                } else if (scope.missionData.youtubeID) {
                    scope.isYoutube = true;
                }
                scope.attachEventByVideoType();

            });


            //play video
            scope.play = function () {
                scope.showPoster = false;
                scope.movieCtrl = false;
                scope.endMovie = false;
                scope.playing = true;
                if (scope.isYoutube) {
                    scope.startYoutube = true;
                    //destroy the player and rebuild -for the red button - for ios
                    //try {
                    //    scope.player.destroy();
                    //}
                    //catch (e) {
                    //    alerT(e)
                    //}

                    //$(".youtube-url-video").attr("youtube-url-video");
                    scope.initPlayer();

                } else {
                    document.getElementById('fullMovie').play();
                }
            }

            //the mission finished
            scope.stop = function () {
                scope.results.answer = 'end mission';
                //get point, if the answer was sent in time
                if (!scope.endTimer) {
                    scope.results.points = scope.missionData.points;
                }

                scope.endMission(scope.results, scope.missionData);
            }

            //pause video or replay after starting the mission
            scope.togglePause = function () {
                if (scope.playing) {
                    scope.playing = false;
                    document.getElementById('fullMovie').pause();
                    scope.showPlayBtn = true;

                } else {
                    scope.showPoster = false;
                    scope.movieCtrl = false;
                    scope.playing = true;
                    document.getElementById('fullMovie').play();
                    scope.showPlayBtn = false;
                }


            }

            scope.$on('closeMissionAndSendAnswer', function (event, data) {

                scope.endMission(scope.results, scope.missionData);
            });

        },
        replace: true
    };
} ]);








