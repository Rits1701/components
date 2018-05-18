VLApp.controller('scenarioCtrl', ['$scope', '$rootScope','APPCONSTANT','$window', '$sce', function ($scope, $rootScope,APPCONSTANT,$window, $sce) {
    var bLoadFirstTime = true;
 
    $scope.landscape_canvas_width;
	$scope.landscape_canvas_height;   

	$scope.scenario_init = function() {
		var availableHeight, contentHeight, scale, new_right_content_width, new_right_content_height, new_left_content_width, total_width;

		$scope.$on(APPCONSTANT.LAB_VIEW_LOADED, function() {
			//alert($scope.orientation);
			 $scope.changeScenario_layout();

		});

        $scope.fetchComponentData = function (strCompId) {
             if($scope.appData.data[strCompId]) { 
                $scope.compData = $scope.appData.data[strCompId];
                $scope.audio = $scope.appData.data[strCompId].audioSource;
                $scope.img = $scope.appData.data[strCompId].imgSource;
                $scope.textinfoone = $sce.trustAsHtml($scope.appData.data[strCompId].paraOne);
                $scope.textinfotwo = $sce.trustAsHtml($scope.appData.data[strCompId].paraTwo);
                if(undefined==$scope.appData.data[strCompId].htmlText) {
                    $scope.htmlText = '';
                } else {
                    $scope.htmlText = $sce.trustAsHtml($scope.appData.data[strCompId].htmlText);
                }
                
                if($scope.appData.data[strCompId].drawingCanvasId && $scope.appData.data[$scope.appData.data[strCompId].drawingCanvasId]) {
                    //angular.element(".embeddedScenarioCanvas").remove();
                } 
             }
        };    
	};
    
    $scope.changeScenario_layout = function(){
        if ($scope.tabIndex == 0) {
            if ($scope.orientation != 'portrait') {

                total_width = angular.element(".scenerioPagecontainer").width();
                availableHeight = angular.element(".scenerioPagecontainer").height();
                contentHeight = angular.element(".scenerio-scale-sub-view").height();
                scale = availableHeight / contentHeight;

                angular.element(".scenerio-scale-view").css({
                    'transform': "scale(" + scale + ")",
                    'transform-origin': "left top"
                });


                new_right_content_width = angular.element(".scenerio-scale-view")[0].getBoundingClientRect().width;
                new_right_content_height = angular.element(".scenerio-scale-view")[0].getBoundingClientRect().height;

                new_left_content_width = total_width - new_right_content_width;

                angular.element(".scenerioPageleft").css({
                    'width': new_left_content_width + "px"
                });

                if (scale < 1) {
                    angular.element(".scenerio-imageContainer").css({
                        'width': new_right_content_width - 5 + "px",
                        'height': new_right_content_height - 5 + "px"
                    });

                    angular.element(".scenerio-scale-view").css({
                        'transform-origin': ""
                    });
                }

                $scope.landscape_canvas_width = total_width;
                $scope.landscape_canvas_height = availableHeight;
                
                if(bLoadFirstTime){
                    bLoadFirstTime = false;
                    $scope.changeScenario_layout();
                }
            } else {
                angular.element(".scenerioPageleft").css('width', "");
                angular.element(".scenerio-scale-view").css('transform', "");
                angular.element(".scenerio-imageContainer").css({
                    'width': "",
                    'height': ""
                });
            }
        }
    }
}]);