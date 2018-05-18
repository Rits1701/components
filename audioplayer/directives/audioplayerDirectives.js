/*
templateUrl : is used to define which html is loaded on view.
controller  : is used to define which controller is used for template view and functionalty part is written in controller
audioplayerDirective    : is used on view where we want to use our component.
*/
VLApp.directive('audioplayerDirective',['$timeout', function($timeout) {    
    //var audioplayerdir = {};
    return{
        restrict : 'EA',
        replace : true,
        
        scope : {
            data : "=",
            source : "@"
        },
        link : function(scope,elem,attr,audioplayerCtrl){
            if(attr.id) {
                scope.fetchComponentData(attr.id);
            }
            scope.element = elem.children();
            //scope.audioControl = angular.element(scope.element.children()[0])[0];
            var audioComp = elem.children()[0].children[0];
            //console.log("audioComp ", audioComp);
            //console.log('audio', scope.source);
            //scope.init();
            
            scope.$watch('source',function(){
               // console.log("MP3=> "+scope.source);
                scope.audioControl = angular.element(scope.element.children()[0])[0];
                scope.init();
            });
            
            audioComp.addEventListener("timeupdate", function (e) {
                //console.log(" timeupdate ");
                var currentTime = audioComp.currentTime.toFixed(1);
                currentTime = parseFloat(currentTime);
                //console.log(" currentTime ", currentTime);
                var duration = audioComp.duration.toFixed(2);
                duration = parseFloat(duration);
                //console.log(" duration ", duration);
                if(currentTime >= duration){
                    //console.log("audio finish");
                    $("#replaybutton").removeClass("replay-shown");
                    //audioComp.currentTime = 0;
                    scope.playingState = false;
                    scope.pauseState = false;

                    $timeout(function(){
                        scope.replyState = false;
                    }, 300);
                    scope.$apply();
                }
            }, false);
        },
        templateUrl : "templates/audioplayerTemplate.html",
        controller : "audioplayerCtrl"
    }
}]);