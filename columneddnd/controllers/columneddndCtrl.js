VLApp.controller('columneddndCtrl', ['$scope','APPCONSTANT', '$rootScope', function ($scope, APPCONSTANT, $rootScope) {
	$scope.state = {};
	$scope.columns = {};
    
    $scope.fetchComponentData = function (dndDataId, dragItemsAndColsId) {
        $scope.state = $scope.appData.data[dndDataId];
        $scope.columns = $scope.appData.data[dragItemsAndColsId];
    }
    

    ($scope.init = function() {
        $scope.$on(APPCONSTANT.LAB_VIEW_LOADED, function() {   

            $scope.scale = $(".scaleContainerWrapper").height() / $('#dndcompDirective').height();

            $scope.$broadcast("change_sidepanel_size");     
        });
    })();

    var containerDims = {};
    var objectDims = {};
    var depth = 10;

    $scope.$on("DnDInitialized", function(evt, data) {
        console.log("DnD Initialized >>>>> ", data);
    });

    $scope.$on("ItemDragStarted", function(evt, data) {
        var xevent = data.event;
        var ui = data.ui;
        var optionObj = data.optionObj;

        if(optionObj && optionObj.containment) {
            ui.position.left = 0;
            ui.position.top = 0;

            containerDims = {};
            containerDims.width = $(optionObj.containment).width();
            containerDims.height = $(optionObj.containment).height();
            objectDims = {};
            objectDims.width = $(xevent.target).outerWidth();
            objectDims.height = $(xevent.target).outerHeight();
        }

        angular.element(xevent.target).css('z-index', depth++);
    });

    $scope.$on("ItemDragging", function(evt, data) {
        var xevent = data.event;
        var ui = data.ui;
        var optionObj = data.optionObj;

        if(optionObj && optionObj.containment) {
            var boundReached = false,
            scale = $scope.scale,
            changeLeft = ui.position.left - ui.originalPosition.left,
            newLeft = ui.originalPosition.left + changeLeft / scale,
            changeTop = ui.position.top - ui.originalPosition.top,
            newTop = ui.originalPosition.top + changeTop / scale;

            ui.position.left = newLeft;
            ui.position.top = newTop;

            if (ui.position.left > containerDims.width - objectDims.width) {
                newLeft = (containerDims.width - objectDims.width)
                boundReached = true;
            }

            // left bound check
            if (newLeft < 0) {
                newLeft = 0;
                boundReached = true;
            }

            // bottom bound check
            if (ui.position.top > containerDims.height - objectDims.height) {
                newTop = (containerDims.height - objectDims.height)
                boundReached = true;
            }

            // top bound check
            if (newTop < 0) {
                newTop = 0;
                boundReached = true;
            }

            // fix position
            ui.position.left = newLeft;
            ui.position.top = newTop;

            // inside bounds
            if (!boundReached) {
                // do stuff when element is dragged inside bounds
            }
        }
    });

    $scope.$on("ItemDropped", function(evt, data){
        var forCol = angular.element(data.ui.draggable).attr("for");        
        var clone = angular.element(data.ui.draggable).clone();        
        var DraggableClass = angular.element(clone).attr("id"); 
        var elementExists = angular.element("."+DraggableClass+".clone").length>=1;        
        
        if(!elementExists) {
            angular.element(clone).addClass("clone");
            angular.element(data.event.target).prepend(clone);
            if(data.event.target.id !=forCol) {
                angular.element(clone).remove();
            } else {
                angular.element(angular.element(data.ui.draggable)[0]).remove();
            }
        }  else {
        } 
    });

    $scope.$on("ItemDragStopped", function(evt, data){
        
    });

    $scope.$on("DnDReset", function(evt, data) {
        angular.element('.ui-droppable .ui-draggable').remove();
        angular.element('.droppedItem').remove();
        depth = 10;
    })
}]);