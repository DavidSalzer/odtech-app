var mainPlayer;
odtechApp.directive('watchVideo', ['$window', '$timeout', function ($window, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './features/watchVideo/watchVideo.html',
        link: function (scope, el, attrs) {

            scope.results = {};
            //if the mission has been made
            if (scope.task.status == 'answer') {
                // alert('This task has been made');
            }

            scope.player;
           // scope.startYoutube = false;
            var player;
            scope.endMovie = false;
            scope.playing = false; //set the playing status
            //scope.showPlayBtn = false;
            scope.showPoster; //  set the display of poster && 'continue' && 'finish' 
            scope.isYoutube = true;


            scope.attachEventByVideoType = function () {
                //if youtyube player initialize befor get youtyubeID - update now
                if (scope.isYoutube && scope.player) {
                    scope.player.cueVideoByUrl("http://www.youtube.com/v/" + scope.task.youtubeID + "?version=3");

                    scope.posterImage = "http://img.youtube.com/vi/" + scope.task.youtubeID + "/0.jpg";
                } else if (scope.isYoutube) {
                    scope.initPlayer();
                    scope.posterImage = " http://img.youtube.com/vi/" + scope.task.youtubeID + "/0.jpg";
                } else if (!scope.isYoutube) {
                    //attach general video events
                    scope.generalVideoEvents();
                    $("#fullMovie").html('<source src="' + scope.task.videoURL + '" type="video/mp4"></source>');
                    //set the poster image rom admin
                    //scope.posterImage
                }



            };


            /**********************youtube functions**************************/
            //init youtube player
            scope.initPlayer = function () {
                //   if (!scope.youtubeReset) {
                scope.youtubeReset = true;
                scope.player = new YT.Player('youtube-url-video', {
                    height: '100%',
                    width: '100%',
                    playerVars: { 'controls': 0 },
                    videoId: scope.task.youtubeID,
                    events: {
                        'onReady': playerReady,
                        'onStateChange': scope.playerStateChange
                    }
                });


                // }
            }

            //init event
            $window.onYouTubeIframeAPIReady = function () {
                scope.initPlayer();
            }

            //youtube player is ready and user allready press on continue
            scope.playerReady = function () {
                /*  if (scope.startYoutube) {
                scope.player.playVideo();
                }*/
            }

            //handel event that player is change->need to know when finish
            scope.playerStateChange = function (newState) {
                //if finish
                if (newState.data == 0) {
                    scope.player.seekTo(0); //go to the start
                    setTimeout(function () {
                        scope.player.pauseVideo();
                    }, 100);

                    $('.fullMovie').addClass('blur');
                    $timeout(function () {
                        scope.showPoster = true;
                    }, 100)
                    scope.endMovie = true;
                }
            }

            /**********************end youtube functions**************************/



            /********************general video functions**************************/
            //listener for end mov
            scope.fullMovieHandler = function (e) {
                if (!e) { e = window.event; }
                // What you want to do after the event
                scope.endMovie = true;
                $('.fullMovie').addClass('blur');
                $timeout(function () {
                    scope.showPoster = true;
                    scope.showPlayBtn = false;
                }, 100)
            }
            scope.generalVideoEvents = function () {

                document.getElementById('fullMovie').addEventListener('ended', scope.fullMovieHandler, false);


            }


            /********************end general video functions**************************/


            /***********************geneal functions******************************/

            // remove blur class and hide video controls
            scope.removeBlur = function () {
                $('.fullMovie').removeClass('blur');

                $timeout(function () {
                    scope.showPoster = false;
                }, 100)
            }

            //play video when the missiom start
            scope.$watch('startMission', function (newVal, oldVal) {

                //console.log('changed');
                //if (newVal == true && oldVal == false && !scope.isYoutube) { // the mission start
                //    //scope.play();
                //}
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
                scope.removeBlur();
                scope.endMovie = false;
                scope.playing = true;
                if (scope.isYoutube) {
                    //  scope.player.playVideo();
                    //  scope.startYoutube = true;
                    //destroy the player and rebuild -for the red button
                    scope.player.destroy();
                    $(".youtube-url-video").attr("youtube-url-video");
                    scope.initPlayer()
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
                    scope.playing = true;
                    document.getElementById('fullMovie').play();
                    //  $('.playButton').hide();
                    scope.showPlayBtn = false;
                }


            }
            //scope.showPlay = function () {
            //    //scope.pause();
            //    ////$('.playButton').show();
            //    //scope.showPlayBtn = true;
            //}

            scope.$on('closeMission', function (event, data) {
                scope.endMission(scope.results);
            });

        },
        replace: true
    };
} ]);



function playerReady() {
    //alert('')
}
function playerStateChange(newState) {
    if (newState.data == 0) {
        mainPlayer.seekTo(0); //go to the start
        setTimeout(function () {
           mainPlayer.stopVideo();
        }, 100);

      
    }
}




