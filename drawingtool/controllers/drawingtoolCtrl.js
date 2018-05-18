VLApp.controller('drawingtoolCtrl', ['$scope', '$rootScope', 'APPCONSTANT', function($scope, $rootScope, APPCONSTANT) {
	const PENCIL_MAX_SIZE = 3;
	const PENCIL_MIN_SIZE = 1;
	var iconsnapshot = angular.element(document.querySelector('.drawing-tool .tool-box .icon-snapshot'));

	$scope.fetchComponentData = function(strCompId) {
        if($scope.appData.data[strCompId]) {
            
        }
    }
    
	$scope.drawingOptions = {
		'pencilSize': 2,
		'pencilColor': 'rgb(0,0,0)',
		'curentTool': ''

	}
	$scope.pencilSize = $scope.drawingOptions.pencilSize;
	$scope.pencil_panel_elem;
	$scope.isDrawingActive = false;


	$scope.$on(APPCONSTANT.LAB_DATA_LOADED, function() {
		$scope.init();
	});

	$scope.pencil_panel_elem = angular.element(document.querySelector('#pencil-panel'));

	$scope.init = function() {
		$scope.$watch('pencilSize', function(newValue, oldValue) {
			$scope.drawingOptions.pencilSize = newValue;
		});
		$scope.$on("CURRENT_TAB_INDEX", $scope.onOpenDrawingPanel);
		$scope.$on("CHANGE_SUB_TAB", $scope.onOpenDrawingPanel);

		$scope.$on(APPCONSTANT.DOCUMENT_CLICK, function() {
			$scope.pencil_panel_elem.fadeOut(200);
		});

		$scope.$on("CLEAR_DRAWING_PAD", $scope.clearAll);
		$scope.onOpenDrawingPanel();
	}

	$scope.onOpenDrawingPanel = function() {

		var bToolbarState = $scope.appData.tabs[$scope.tabIndex].toolbaropen;
		if (bToolbarState) {
			//$scope.pencil_panel_elem.fadeIn(APPCONSTANT.FADE_DURATION);
			$('.expandTool').collapse('show');
			$scope.$broadcast("ACTIVE_DRAWING");
			$scope.isDrawingActive = true;
			angular.element(document.querySelector('.icon-drawtool')).addClass('selected');
		} else {
			$scope.pencil_panel_elem.fadeOut(APPCONSTANT.FADE_DURATION);
			$('.expandTool.in').collapse('hide');
			$scope.$broadcast("DEACTIVE_DRAWING");
			$scope.isDrawingActive = false;
			angular.element(document.querySelector('.icon-drawtool')).removeClass('selected');
		}

	}

	$scope.openDrawingToolbarPanel = function($event) {
		if ($scope.isDrawingActive) {
			$($event.target).removeClass('selected');
			$scope.pencil_panel_elem.fadeOut(200);
			$scope.$broadcast("DEACTIVE_DRAWING");
		} else {
			$($event.target).addClass('selected');
			$scope.$broadcast("ACTIVE_DRAWING");
		}
		$scope.isDrawingActive = !$scope.isDrawingActive;

	};

	$scope.onChangeDrawingMode = function($event, selecteDrawingTool) {

		if (selecteDrawingTool == "clear") {
			//$($event.currentTarget).siblings().removeClass('selected');
			//$scope.drawingOptions.curentTool = "";
			$scope.clearAll();
		} else {
			$($event.currentTarget).addClass('selected').siblings().removeClass('selected');
		}

		if ($event.currentTarget.id != "pencilTool" || $event.currentTarget.id == "") {
			$scope.pencil_panel_elem.fadeOut(200);
		} else {
			$scope.pencil_panel_elem.fadeToggle(200);
		}

		$scope.drawingOptions.curentTool = selecteDrawingTool;
		$scope.$broadcast("changeDrawingMode", {'mode': selecteDrawingTool});

		switch (selecteDrawingTool) {
			case "pencil":
				$('canvas').removeClass("eraser-cursor").addClass("pencil-cursor");
				break;
			case "eraser":
				$('canvas').removeClass("pencil-cursor").addClass("eraser-cursor");
				break;
			default:
				$('canvas').removeClass("pencil-cursor").removeClass("eraser-cursor");
		}
	};

	$scope.onSelectPencilColor = function($event) {
		var previous_elem = angular.element(document.getElementsByClassName("oval selected"));
		previous_elem.removeClass('selected');
		$($event.currentTarget.firstChild).addClass('selected');
		var selectedColor = $($event.currentTarget.firstChild).css("background-color");
		$scope.drawingOptions.pencilColor = selectedColor;
	};

	$scope.clearAll = function() {
		
		angular.element(".expandTool .tool-box").siblings().removeClass('selected');
		$scope.drawingOptions.curentTool = "";
		$('canvas').removeClass("pencil-cursor").removeClass("eraser-cursor");
	}

	$scope.onTakeSnap = function() {
		iconsnapshot.css('pointer-events', 'none');
		ActionManager.dispatchAction(APPCONSTANT.TAKE_SNAPSHOT);
	};

	$scope.onChangePencilSize = function(state) {
		switch (state) {
			case "minus":
				if ($scope.pencilSize != PENCIL_MIN_SIZE) {
					$scope.pencilSize--;
				}
				break;
			case "plus":
				if ($scope.pencilSize != PENCIL_MAX_SIZE) {
					$scope.pencilSize++;
				}
				break;
		}
	};
}]);
