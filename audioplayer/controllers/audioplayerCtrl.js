VLApp.controller('audioplayerCtrl', ['$scope','$timeout','APPCONSTANT', function ($scope,$timeout,APPCONSTANT) {
    $scope.audioSrc ;//= "assets/audios/audioex";
    $scope.element;
    $scope.playbutton;
    $scope.pausebutton;
    $scope.replaybutton;
    $scope.active = true;

    $scope.playingState = false;    // playingState is used to show/hide play button or pause button
    $scope.pauseState = false;      // pauseState is used to show replay button
    $scope.replyState = false;
    //$scope.audioControl = angular.element($scope.audioTag);//angular.element(document.querySelector( '#audioTag' ))[0];
    ActionManager.registerActionHandler("STOP_ALL_AUDIO_DIS", function(){
        if($scope.audioControl && !$scope.active){
            $scope.audioControl.pause();
            $scope.audioControl.currentTime = 0;
            $scope.playingState = false;
            $scope.pauseState = false;
            $scope.replyState = false;
            $scope.active = true;
           // $scope.$apply();

        }
    });

    $scope.fetchComponentData = function(strCompId) {
        if($scope.$parent.appData.data[strCompId]) {
            
        }
    }

    $scope.init = function(){
        $scope.audioControl.currentTime = 0;
        $scope.playingState = false;
        $scope.pauseState = false;
        $scope.$on("STOP_ALL_AUDIO_DIS", function(){
            if($scope.audioControl && !$scope.active){
                $scope.audioControl.pause();
                $scope.audioControl.currentTime = 0;
                $scope.playingState = false;
                $scope.pauseState = false;
                $scope.replyState = false;
                $scope.active = true;
               // $scope.$apply();

            }
        });

        // On Audio finish ....
        $scope.audioControl.addEventListener("ended",function(){
            //console.log("ended", $scope.playingState)
            $("#replaybutton").removeClass("replay-shown");
            $scope.audioControl.currentTime = 0;
            $scope.playingState = false;
            $scope.pauseState = false;

            $timeout(function(){
                $scope.replyState = false;
            }, 300);
            $scope.$apply();
         });
    };

    // On click of play button
    $scope.playAudio =function(){
         $scope.active = true;
         $scope.$emit("STOP_ALL_AUDIO");
         $scope.audioControl.play();
         $scope.playingState = true;
         $scope.pauseState = false;
         $scope.replyState = true;
         var pl =  angular.element($scope.element[1]);
         //$scope.playbutton = pl.children();
         //$scope.playbutton.css("display","none");
         $scope.active = false;

         $timeout(function(){
            $("#replaybutton").addClass("replay-shown");
         }, 100);

        ActionManager.dispatchAction("audio_started");
    };
    // On click of pause button
    $scope.pauseAudio = function(){
         $scope.audioControl.pause();
         $scope.playingState = false;
         $scope.pauseState = true;
         $scope.replyState = true;
         var pl =  angular.element($scope.element[1]);
         //$scope.pausebutton = pl.children();
         //$scope.pausebutton.css("display","none");
     };
    // On click of replay button
    $scope.replayAudio = function(){
        //$scope.replyState = true;
        $scope.audioControl.currentTime = 0;
        $scope.playAudio();
        var pl =  angular.element($scope.element[1]);
         //$scope.replaybutton = angular.element(pl.children()[1]);
        //$scope.replaybutton.css("display","none");
     };


}]);
// $scope.$broadcast("STOP_ALL_AUDIO_DIS");
