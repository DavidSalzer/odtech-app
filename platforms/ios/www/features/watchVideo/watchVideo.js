var mainPlayer;
var player;
odtechApp.directive('watchVideo', ['$window', '$timeout', function ($window, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './features/watchVideo/watchVideo.html',
        link: function (scope, el, attrs) {

            scope.results = {};
            scope.results.answer;
            scope.results.points = 0;
           // scope.showLoader = false;
            scope.uploadText = "הסרטון בטעינה, אנא המתן"
            //if the mission has been made
            if (scope.task.status == 'answer') {
                // alert('This task has been made');
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
                //if youtube player initialize befor get youtyubeID - update now
                if (scope.isYoutube && scope.player) {
                    scope.player.cueVideoByUrl("http://www.youtube.com/v/" + scope.task.youtubeID + "?version=3");

                    scope.posterImage = "http://img.youtube.com/vi/" + scope.task.youtubeID + "/0.jpg";
                    scope.showPoster = false;
                } else if (scope.isYoutube) {
                    scope.initPlayer();
                    scope.posterImage = " http://img.youtube.com/vi/" + scope.task.youtubeID + "/0.jpg";
                    scope.showPoster = false;
                    //attach general video events
                } else if (!scope.isYoutube) {
                    scope.generalVideoEvents();
                    $("#fullMovie").html('<source src="' + imgDomain + scope.task.videoURL + '" type="video/mp4"></source>');
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
                    playerVars: { 'controls': 1 },
                    videoId: scope.task.youtubeID,
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


                    setTimeout(function () {
                        scope.player.destroy();
                        scope.initPlayer();
                    }, 100);
                    //if this is a second enter -hide the poster and buttons
                    if (scope.task.status != 'answer') {

                        $timeout(function () {
                            scope.showPoster = true;
                            scope.movieCtrl = true;
                        }, 100)
                        scope.endMovie = true;
                    }
                    else {
                        scope.endMovie = true;
                    }

                }
            }


            /********************general video functions**************************/
            //listener for end mov
            scope.fullMovieHandler = function (e) {
                if (!e) { e = window.event; }
                scope.endMovie = true;
                scope.playing = false;
                //if this is a first time enter and the movie end - show the poster and the buttons for exitand replay
                if (scope.task.status != 'answer') {
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
            //scope.finishloaded = function () {
            //     scope.showLoader = true;
            //}
            scope.generalVideoEvents = function () {

                document.getElementById('fullMovie').addEventListener('ended', scope.fullMovieHandler, false);
               // document.getElementById('fullMovie').addEventListener('canplay', scope.finishloaded, false);
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
                if (scope.startMission == true && scope.task.status == 'notAnswer') {
                    //scope.showLoader = true;
                }

            });

            //update the movie from server
            scope.$watch('task', function (newVal, oldVal) {
                //check if the video type is yoputube or general
                if (scope.task.videoURL) {
                    scope.isYoutube = false;
                } else if (scope.task.youtubeID) {
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
                    scope.player.destroy();
                    $(".youtube-url-video").attr("youtube-url-video");
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
                    scope.results.points = scope.task.points;
                }

                scope.endMission(scope.results);
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

            scope.$on('closeMission', function (event, data) {
                scope.endMission(scope.results);
            });

        },
        replace: true
    };
} ]);








