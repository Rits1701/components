VLApp.controller('animationPlayerCtrl', function ($scope, $rootScope, $interval, $timeout) {
    
    $scope.state = {};
    $scope.animationSet = []; // Array of objects. Each object defines animation.
    $scope.intervalSet = [];
    $scope.animationClass = [];

    $scope.pause = false;
    $scope.stop = false;
    $scope.gotoAndPlay = -1;
    $scope.gotoAndStop = -1; 
    $scope.stopAt = -1;   
    
    $scope.fetchComponentData = function (strCompId) {
        $scope.state = $scope.appData.data[strCompId];  
        $scope.getAllSprites();      
    }
    
    $scope.$on('LAB_DATA_LOADED', function () {

    });

    $scope.$on('addAnimationClass', function(event, data) {
    	$scope.animationClass.push(data.class);
    });

    $scope.$on('removeAnimationClass', function(event, data) {
    	$scope.animationClass = [];
    });

    $scope.$on('playAnimation', function (event, data) {
        $scope.pause = false;
    });

    $scope.$on('pauseAnimation', function (event, data) {
        $scope.pause = !$scope.pause;
    });

    $scope.$on('stopAnimation', function (event, data) {
        $scope.pause = false;
        $scope.stop = true;
    });

    $scope.$on('gotoAndPlay', function (event, data) {
        if(data.frameNumber) {
            $scope.gotoAndPlay = data.frameNumber;
            $scope.pause = false;
            $scope.stop = false;
        } else {
            $scope.gotoAndPlay = -1;
        }
        
    });

    $scope.$on('gotoAndStop', function (event, data) {
        if(data.frameNumber) {
            $scope.gotoAndStop = data.frameNumber; 
            $scope.pause = false;
            $scope.stop = false;           
        } else {
            $scope.gotoAndStop = -1;
        }
    });

    $scope.$on('stopAt', function (event, data) {
        if(data.frameNumber) {
            $scope.stopAt = data.frameNumber;
        } else {
            $scope.stopAt = -1;
        }
    });

    $scope.$on('cancelAnimation', function (event, data) {
        if($scope.intervalSet.length > 0) {            
            $scope.pause = false;
            $scope.stop = false;       
            for(var idx=0; idx<$scope.intervalSet.length; ++idx) {
                angular.element("[animId = animation_" + idx + "]").css("background-position", "0px");                
                $interval.cancel($scope.intervalSet[idx]);                
            }
            $scope.animationSet = [];
            $scope.intervalSet = []; 
            $scope.animationClass = [];           
        }        
    });

    /**
        data: object
        data.animationName : String - JSON provided
        data.callback: String - Parent scope method name, Fired on animation completion
        data.param: Parameters passed to callback
    **/
    $scope.$on("launchAnimation", function(event, data) {       
    	$scope.startAnimation(data);
    });

    $scope.startAnimation = function(data) {
        var animationName = data.animationName, 
            callback = data.callback, 
            param = data.param;

        // $scope.disableAllClicks = true;
        $scope.$emit('animationStarted', data);
        $scope.animationSet = angular.copy($scope.state[animationName]); 
               
        if($scope.intervalSet.length) {
            for(var i=0; i<$scope.intervalSet.length; ++i) {
                $interval.cancel($scope.intervalSet[i]);
            }
        }
        $scope.intervalSet = [];        
        $.each($scope.animationSet, function(idx, obj) {            
            $scope.animationSet[idx].style = {
                "position": "absolute",
                "height": obj.frameSize.height + "px",
                "width": obj.frameSize.width + "px",
                "top": obj.position.top + "px",
                "left": obj.position.left + "px",
                "background-image": "url('" + obj.img + "')",
                "background-size": "cover",
                "z-index": 1
            }

            if(obj.scaleDown) {
                $scope.animationSet[idx].style['-webkit-transform'] = "scale(0.5)";
                $scope.animationSet[idx].style['transform'] = "scale(0.5)";
            }

            var spriteWidth, singleSprite, frames, count, timeInterval, changeRate;
            spriteWidth = parseInt(obj.spriteSize['width']);
            singleSprite = parseInt(obj.frameSize.width);
            frames = spriteWidth/singleSprite;
            count = 1;                
            // if(parseInt(obj.style.width) <= (singleSprite/2 + 1)) {
            //     frames = frames/2;
            // }
            var duration = parseInt(obj.duration) > 0 ? parseInt(obj.duration) : 1000;
            changeRate = parseInt(duration/frames);
            if(parseInt(obj.fps) > 0) {
                changeRate = parseInt(1000/parseInt(obj.fps));
                frames = parseInt(duration/changeRate);
            }
            // if(obj['infinite'] == true) {
            //     $scope.disableAllClicks = false;
            // }            
            timeInterval = $interval(function() {                                
                if($scope.pause) {
                    return;
                }
                if(($scope.gotoAndPlay > 0) && ($scope.gotoAndPlay <= frames)) {
                    count = $scope.gotoAndPlay;
                    $scope.gotoAndPlay = -1;
                }
                if(($scope.gotoAndStop > 0) && ($scope.gotoAndStop <= frames)) {
                    count = $scope.gotoAndStop;
                    $scope.gotoAndStop = -1;
                    $scope.pause = true;
                }
                if(($scope.stopAt > 0) && ($scope.stopAt <= frames)) {
                    if(count >= $scope.stopAt) {
                        $scope.pause = true;
                        $scope.stopAt = -1;
                    }
                }                
                if($scope.stop) {
                    $scope.stop = false;
                    $scope.pause = true;
                    count = 1;                                    
                }                
                if (count <= frames) {
                    var bgPosition = singleSprite * count;
                    angular.element("[animId = animation_" + idx + "]").css("background-position", "-" + bgPosition + "px");
                    count++;
                } else {                        
                    angular.element("[animId = animation_" + idx + "]").css("background-position", "0px");
                    $scope.$emit('animationEnded', data);
                    if(obj['infinite'] == true) {
                        count = 1;                        
                    } else {
                        $interval.cancel($scope.intervalSet[idx]);
                        $scope.animationSet.splice(idx, 1);
                        // if(callback) {                                
                        //     // $scope.disableAllClicks = false;
                        //     callback(param);
                        // }
                    }                    
                }
            }, changeRate);
            $scope.intervalSet.push(timeInterval);
        })
    };

    $scope.getAllSprites = function(){
        function traverse(obj) {
            $.each(obj, function (k, v) {
                if(typeof v == 'object') {
                    if(v.img) {
                        var img = new Image();
                        img.addEventListener("load", function(){   
                            v['spriteSize'] = {};
                            v['spriteSize']['width'] = this.naturalWidth;
                            v['spriteSize']['height'] = this.naturalHeight;                            
                        });
                        img.src = v.img;
                    } else {
                        traverse(v);
                    }
                }
            });
        }
        traverse($scope.state);       
    }    
});