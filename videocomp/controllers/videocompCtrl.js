VLApp.controller('videocompCtrl', ['$scope', '$rootScope','$timeout', function ($scope, $rootScope,$timeout) {
    $scope.playingState = false;    // playingState is used to show/hide play button or pause button
    $scope.active = false;
    //$scope.data = 
    $scope.state = {};     
    $scope.customcontrol = false;
    
    $scope.showCustomControl = function (customcontrol) {
        $scope.customcontrol = customcontrol;
    }
    
    $scope.fetchComponentData = function (strCompId) {
        $scope.state = $scope.$parent.appData.data[strCompId];
    }
    
    $scope.$on('LAB_DATA_LOADED', function () {
    });
    $scope.init = function(){
        $scope.videoControl.currentTime = 0;
        $scope.playingState = false;
        $scope.$on("STOP_PLAYING_ALL_VIDEOS", function(){
            if($scope.videoControl && !$scope.active){
                $scope.videoControl.pause();
                $scope.videoControl.currentTime = 0;
                $scope.playingState = false;               
            }
        });

        /*  Fires when the browser can start playing the audio/video */
        

        /* Fires when the audio/video has been started or is no longer paused */
        $scope.videoControl.addEventListener("play",function(){   
            $timeout(function(){
                $scope.playingState = true;
                $scope.$emit("VIDEO_PLAY", $scope.videoControl);
            }, 200);
         });

        /* Fires when the audio/video has been paused */
        $scope.videoControl.addEventListener("pause",function(){   
            $timeout(function(){
                $scope.playingState = false;
                $scope.$emit("VIDEO_PAUSE", $scope.videoControl);
            }, 200);
         });

        /* Fires when the audio/video is playing after having been paused or stopped for buffering */
        $scope.videoControl.addEventListener("playing",function(){   
            $timeout(function(){
                $scope.playingState = true;
                $scope.$emit("VIDEO_PLAYING", $scope.videoControl);
            }, 200);
         });

        /* Fires when the browser is downloading the audio/video */
        $scope.videoControl.addEventListener("progress",function(){   
            $timeout(function(){
                $scope.playingState = true;
                $scope.$emit("VIDEO_PROGRESS", $scope.videoControl);
            }, 200);
         });

        /* Fires when the user starts moving/skipping to a new position in the audio/video */
        $scope.videoControl.addEventListener("seeking",function(){   
            $timeout(function(){
                $scope.$emit("VIDEO_SEEKING", $scope.videoControl);
            }, 200);
         });

        /* Fires when the user is finished moving/skipping to a new position in the audio/video */
        $scope.videoControl.addEventListener("seeked",function(){   
            $timeout(function(){
                $scope.playingState = true;
                $scope.$emit("VIDEO_SEEKED", $scope.videoControl);
            }, 200);
         });

        /* Fires when the volume has been changed */
        $scope.videoControl.addEventListener("volumechange",function(){   
            $timeout(function(){
                $scope.$emit("VIDEO_VOLUMECHANGED", $scope.videoControl);
            }, 200);
         });

        /* Fires when the video stops because it needs to buffer the next frame */
        $scope.videoControl.addEventListener("waiting",function(){   
            $timeout(function(){
                $scope.playingState = false;
                $scope.$emit("VIDEO_PLAYING", $scope.videoControl);
            }, 200);
         });

        /* Fires when the current playlist is ended */
        $scope.videoControl.addEventListener("ended",function(){      
            $scope.videoControl.currentTime = 0;
            $timeout(function(){
                $scope.playingState = false;
                $scope.$emit("VIDEO_ENDED", $scope.videoControl);
            }, 200);
         });
    }

    $scope.playVideo=function(){
        $scope.active = true;
        $scope.$emit("STOP_ALL_VIDEO");
        $scope.playingState = true;
        $scope.videoControl.play();
        $scope.active = false;
    }
    $scope.pauseVideo=function(){
        $scope.playingState = false;
        $scope.videoControl.pause();
    }
}]);