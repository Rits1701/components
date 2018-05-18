/***
 * 'drawingpadCtrl' is main controller,
 * and this controller will be responsible to drawing on screen
 */
VLApp.controller("drawingpadCtrl", ['$scope', '$element', '$attrs', 'APPCONSTANT', function($scope, $element, $attrs, APPCONSTANT) {
	$scope.currentCanvas = undefined;
	$scope.showCanvasContainer = false;
	$scope.penciltool = false;
	$scope.canvasEnableTool = false;
	$scope.secondClick = false;
	$scope.canvas, $scope.ctx, $scope.canvasId;
	$scope.mouseX, $scope.mouseY, $scope.mouseDown = 0;
	$scope.lastX;
	$scope.lastY;
	$scope.touchX;
	$scope.touchY;
	$scope.basePencilSize = 4;
	$scope.mouseEvents = false;
	$scope.currentTool = "";
	$scope.selectedColor = "#000";
	$scope.index = 0;
	$scope.ispadActive = false;
	$scope.canvasElm;
	$scope.currentCanvasElement = undefined;
	$scope.clearIconRef = angular.element('.icon-clear');
	var lastX, lastY;
	var disableResizeOnOrientation = false;

	$scope.fetchComponentData = function(strCompId) {
        if($scope.appData.data[strCompId]) {
            $scope.compData = $scope.appData.data[strCompId];
            if($scope.compData.canvasFromComp && $scope.compData.canvasContainer) {
            	$scope.initDrawingCanvas();
            }            
        } else {
        	$scope.compData = null;
        	$scope.canvasFromComp = false;
        	$scope.activateCanvas = false;
        }
    }; 

    $scope.$on(APPCONSTANT.LAB_VIEW_LOADED, function() {
    	if(disableResizeOnOrientation == true) {
    		return;
    	}
    	$scope.updateCanvasSize();
    })   

    $scope.initDrawingCanvas = function() {
    	$scope.canvasFromComp = true;
    	$scope.activateCanvas = true;
    	$scope.canvasContainers = [];
    	$scope.currentView = $scope.compData.view;
    	$scope.inMemCanvas = [];    	

    	for(var i=0; i<$scope.compData.canvasCount; ++i) {
    		$scope.canvasContainers.push(i);

    		//Memory Canvas
	    	// Make our in-memory canvas
	    	var tempObj = {
	    		"id": 'x',
	    		"landscape": {},
	    		"portrait": {}
	    	};
	    	tempObj["id"] = $scope.currentView + '_' + i;
	    	tempObj["landscape"].ref = document.createElement('canvas');
	    	tempObj["landscape"].ctx = tempObj["landscape"].ref.getContext('2d');
	    	tempObj["portrait"].ref = document.createElement('canvas');
	    	tempObj["portrait"].ctx = tempObj["portrait"].ref.getContext('2d');
	    	tempObj["landscape"].ref.height = 1000;
	    	tempObj["landscape"].ref.width = 1000;
	    	tempObj["portrait"].ref.height = 1000;
	    	tempObj["portrait"].ref.width = 1000;
			$scope.inMemCanvas.push(tempObj);
    	}
    	$scope.drawingCanvasHeight =  "100%";
    	$scope.drawingCanvasWidth = "100%";
    	$scope.currentCanvasNum = 0;    	
    	$scope.updateCanvasSize();    	
    };

    $scope.updateCanvasSize = function() {    	
    	if($scope.canvasFromComp == true) {
    		var height, width;
    		height = angular.element($scope.compData.canvasContainer)[0].getBoundingClientRect().height;
    		width = angular.element($scope.compData.canvasContainer)[0].getBoundingClientRect().width;
    		
    		for(var i=0; i<$scope.compData.canvasCount; ++i) { 
    			var canvasRef = document.getElementById("drawingCanvas_" +  $scope.currentView + "_" +  i);
	    		if(canvasRef) {
	    			var ctx = canvasRef.getContext("2d");	    		
				    $scope.inMemCanvas[i][$scope.orientation].ctx.drawImage(canvasRef, 0, 0);		    
		    		$scope.drawingCanvasHeight = height;
		    		$scope.drawingCanvasWidth = width;
		    		ctx.drawImage($scope.inMemCanvas[i][$scope.orientation].ref, 0, 0);		    		
	    		}	
    		}    		    		
    	}
    };

    $scope.$on('updateDrawingCanvas', function(event, args) {
    	$scope.currentCanvasNum = args.num;
    	$scope.$apply();
    });
    
	/**
	 * This method is called on initialisation
	 * and responsible for binding events.
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 */
	$scope.init = function() {
		$scope.bindEvents();
		$scope.$watch('drawingOptions', function(newValue, oldValue) {
			$scope.drawingOptions = newValue;
			$scope.elementSize = $scope.drawingOptions.pencilSize * 3;
			$scope.selectedColor = $scope.drawingOptions.pencilColor;
			$scope.currentTool = $scope.drawingOptions.curentTool;
			$scope.setDrawingProperties();
			$scope.switchCanvas();
		}, true);
	};

	/**
	 * This method is responsible bind events.
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 */
	$scope.bindEvents = function() {
		$scope.$on("CURRENT_TAB_INDEX", $scope.getTabIndex);
		$scope.$on("ACTIVE_DRAWING", $scope.activateDrawing);
		$scope.$on("DEACTIVE_DRAWING", $scope.deactivateDrawing);
		$scope.$on("ORIENTATION_CHANGE", $scope.orientationChange);
		$scope.$on("CLEAR_DRAWING_PAD", $scope.clearDrawingPad);
	};

	$scope.orientationChange = function() {
		if($scope.canvasFromComp == true) {
			disableResizeOnOrientation = true;
			var height, width;
    		height = angular.element($scope.compData.canvasContainer)[0].getBoundingClientRect().height;
    		width = angular.element($scope.compData.canvasContainer)[0].getBoundingClientRect().width;
			for(var i=0; i<$scope.compData.canvasCount; ++i) { 
    			var canvasRef = document.getElementById("drawingCanvas_" +  $scope.currentView + "_" +  i);
	    		if(canvasRef) {
	    			var ctx = canvasRef.getContext("2d");
	    			var otherMode = ($scope.orientation == "landscape") ? "portrait" : "landscape";
				    $scope.inMemCanvas[i][otherMode].ctx.drawImage(canvasRef, 0, 0);
				    $scope.drawingCanvasHeight = height;
		    		$scope.drawingCanvasWidth = width;
		    		ctx.drawImage($scope.inMemCanvas[i][$scope.orientation].ref, 0, 0);		    		
	    		}	
    		}
    		disableResizeOnOrientation = false;
		} else {
			if ($scope.ispadActive) $scope.activateDrawing();
		}		
	};

	/**
	 * This method is responsible to set drawing properties.
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 */
	$scope.setDrawingProperties = function() {
		if ($scope.currentTool == "pencil") {
			$scope.penciltool = true;
			$scope.canvasEnableTool = true;
			$scope.currentTool = "pencil";
		} else if ($scope.currentTool == "clear") {
			if($scope.canvasFromComp) {
				return;	
			}
			clearDrawing();
		} else {
			$scope.penciltool = false;
		}
	};
	/**
	 * This method is responsible to set tab index.
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 */
	$scope.getTabIndex = function() {
		$scope.index = $scope.tabIndex;
		//$scope.drawingOptions.curentTool = "pencil";
		$scope.clearIconRef.parent().removeClass('selected');
	};
	/**
	 * This method is responsible to activate canvas.
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 */
	$scope.activateDrawing = function(index) {
		
		if($scope.canvasFromComp == true) {
			$scope.activateCanvas = true;
			$scope.updateCanvasSize();
		} else {
			//$scope.deactivateDrawing();
			$scope.ispadActive = true;
			if ($scope.orientation == "landscape") {
				if ($scope.subTabIndex != 0) {
					$scope["showCanvasContainerLadscape_" + $scope.subTabIndex] = true;
					$scope["showCanvasContainerPortrait_" + $scope.subTabIndex] = false;
					$scope.showCanvasContainerLadscape = false;
				} else {
					$scope.showCanvasContainerLadscape = true;
					$scope.showCanvasContainerPortrait = false;
				}
			} else if ($scope.orientation == "portrait") {
				if ($scope.subTabIndex != 0) {
					$scope["showCanvasContainerLadscape_" + $scope.subTabIndex] = false;
					$scope["showCanvasContainerPortrait_" + $scope.subTabIndex] = true;
					$scope.showCanvasContainerPortrait = false;
				} else {
					$scope.showCanvasContainerLadscape = false;
					$scope.showCanvasContainerPortrait = true;

				}

			}	
		}

		if (!$scope.$$phase) {
			$scope.$apply();
		}
		$scope.switchCanvas();
	};
	/**
	 * This method is responsible to activate canvas.
	 * @param {number} index
	 * @return {NULL}
	 * @access public
	 */
	$scope.deactivateDrawing = function() {		
		if($scope.canvasFromComp == true) {
			$scope.activateCanvas = false;
		} else {
			$scope.ispadActive = false;
			$scope.showCanvasContainerLadscape = false;
			$scope.showCanvasContainerPortrait = false;
			if ($scope.subTabIndex != 0) {
				$scope["showCanvasContainerLadscape_" + $scope.subTabIndex] = false;
				$scope["showCanvasContainerPortrait_" + $scope.subTabIndex] = false;				
			}
		}

		if (!$scope.$$phase) {
			$scope.$apply();
		}
	};
	/**
	 * This method is responsible to bind events on canvas.
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 */
	$scope.switchCanvas = function() {
		if($scope.canvasFromComp == true) {
			$scope.currentCanvas = "drawingCanvas_" +  ($scope.tabIndex + 1) + "_" +  $scope.currentCanvasNum;
			$scope.canvas = $scope.currentCanvas;			
		} else {
			if ($attrs.multiCanvas != undefined) {
				if ($scope.subTabIndex == 0) {
					$scope.subTabIndex = 1
				}
				$scope.currentCanvas = "canvas_" + $scope.orientation + "_" + $attrs.canvasid + "_" + $scope.subTabIndex;
			} else {
				$scope.currentCanvas = "canvas_" + $scope.orientation + "_" + $attrs.canvasid;
			}
			$scope.canvas = $scope.currentCanvas;
		}

		try{			
			var element = angular.element(document.getElementById($scope.canvas));
			$scope.currentCanvasElement = element[0];
			$scope.ctx = element[0].getContext('2d');
			if ($scope.penciltool) {

				//$scope.currentCanvasElement = element[0];
				element[0].removeEventListener('mousedown', $scope.sketchpad_mouseDown, false);
				element[0].removeEventListener('mousemove', $scope.sketchpad_mouseMove, false);
				window.removeEventListener('mouseup', $scope.sketchpad_mouseUp, false);
				element[0].removeEventListener('touchstart', $scope.sketchpad_touchStart, false);
				element[0].removeEventListener('touchmove', $scope.sketchpad_touchMove, false);
				element[0].addEventListener('mousedown', $scope.sketchpad_mouseDown, false);
				element[0].addEventListener('mousemove', $scope.sketchpad_mouseMove, false);
				window.addEventListener('mouseup', $scope.sketchpad_mouseUp, false);
				element[0].addEventListener('touchstart', $scope.sketchpad_touchStart, false);
				element[0].addEventListener('touchmove', $scope.sketchpad_touchMove, false);
				$scope.canvasElm = element;
			}
		}catch(e)
		{
			
		}
	};
	/**
	 * This method is responsible for get cordinates on touch start.
	 * @param {object} event
	 * @return {NULL}
	 * @access public
	 */
	$scope.sketchpad_touchStart = function(event) {

		$scope.ctx.lineWidth = $scope.elementSize;
		$("#clearAll").removeClass("disabled");
		$scope.getTouchPos(event);
		lastX = $scope.touchX;
		lastY = $scope.touchY;
		drawDot($scope.ctx, $scope.touchX, $scope.touchY, $scope.elementSize);
		event.preventDefault();
	};
	/**
	 * This method is responsible for get cordinates on touch move.
	 * @param {object} event
	 * @return {NULL}
	 * @access public
	 */
	$scope.sketchpad_touchMove = function(event) {
		$scope.getTouchPos(event);
		//drawDot($scope.ctx, $scope.touchX, $scope.touchY, $scope.elementSize);
		if ($scope.currentTool == "eraser") {
			eraseDrawing($scope.ctx, $scope.touchX, $scope.touchY, $scope.elementSize);
		} else if ($scope.currentTool == "pencil") {
			drawDot($scope.ctx, $scope.touchX, $scope.touchY, $scope.elementSize);
		}
		event.preventDefault();
	};
	/**
	 * This method is responsible for get cordinates.
	 * @param {object} event
	 * @return {NULL}
	 * @access public
	 */
	$scope.getTouchPos = function(event) {
		if (!e) var e = event;

		if (e.touches) {
			if (e.touches.length == 1) { // Only deal with one finger
				var touch = e.touches[0]; // Get the information for finger #1
				$scope.touchX = touch.pageX - $(touch.target).offset().left;
				$scope.touchY = touch.pageY - $(touch.target).offset().top;
			}
		}
	};
	/**
	 * This method is responsible for get mouse position.
	 * @param {object} event
	 * @return {NULL}
	 * @access public
	 */
	$scope.getMousePosition = function(event) {
		$scope.mouseX = event.offsetX;
		$scope.mouseY = event.offsetY;
	};
	/**
	 * This method is responsible set tool on mouse down.
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 */
	$scope.sketchpad_mouseDown = function() {
		lastX = $scope.mouseX;
		lastY = $scope.mouseY;
		$scope.ctx.lineWidth = $scope.elementSize;
		$("#clearAll").removeClass("disabled");
		$scope.mouseDown = 1;
		if ($scope.currentTool == "eraser") {
			eraseDrawing($scope.ctx, $scope.mouseX, $scope.mouseY, $scope.elementSize);
		} else if ($scope.currentTool == "pencil") {
			drawDot($scope.ctx, $scope.mouseX, $scope.mouseY, $scope.elementSize);
		}
	};
	/**
	 * This method is responsible to reset drawing pad.
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 */
	$scope.clearDrawingPad = function() {		
		clearDrawing();
	};
	/**
	 * This method is responsible to reset value on mouse up.
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 */
	$scope.sketchpad_mouseUp = function() {
		$scope.mouseDown = 0;
	};
	/**
	 * This method is responsible to get position and draw on mouse move.
	 * @param {object} event
	 * @return {NULL}
	 * @access public
	 */
	$scope.sketchpad_mouseMove = function(event) {
		$scope.getMousePosition(event);
		if ($scope.mouseDown == 1) {
			if ($scope.currentTool == "eraser") {
				eraseDrawing($scope.ctx, $scope.mouseX, $scope.mouseY, $scope.elementSize);
			} else if ($scope.currentTool == "pencil") {
				drawDot($scope.ctx, $scope.mouseX, $scope.mouseY, $scope.elementSize);
			}
		}
		$scope.mouseEvents = true;
	};
	/**
	 * This method is responsible to draw dots on canvas.
	 * @param {object} ctx
	 * @param {number} x
	 * @param {number} y
	 * @param {number} size
	 * @return {NULL}
	 * @access public
	 */
	function drawDot(ctx, x, y, size) {
		ctx.beginPath();
		if ($scope.penciltool) {
			ctx.globalCompositeOperation = "source-over";
			ctx.fillStyle = $scope.selectedColor;
			ctx.strokeStyle = $scope.selectedColor;
			//ctx.arc(x, y, size, 0, Math.PI * 2, true);
			ctx.lineJoin = "round";
			ctx.moveTo(lastX, lastY);
			ctx.lineTo(x, y);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}
		lastX = x;
		lastY = y;
		//ctx.restore();
	};
	/**
	 * This method is responsible to erase dots on canvas.
	 * @param {object} ctx
	 * @param {number} x
	 * @param {number} y
	 * @param {number} size
	 * @return {NULL}
	 * @access public
	 */
	function eraseDrawing(ctx, x, y, size) {
		ctx.beginPath();
		ctx.globalCompositeOperation = "destination-out";
		//ctx.lineWidth = size;
		ctx.arc(x, y, size * 2, 0, Math.PI * 3, true);
		ctx.fill();
		ctx.restore();
	};
	/**
	 * This method is responsible to clear canvas.
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 */
	function clearDrawing() {		
		if ($scope.currentCanvasElement != undefined) {
			if($scope.canvasFromComp == true) {				
				var ctx = $scope.currentCanvasElement.getContext('2d');
				var height = $scope.currentCanvasElement.height;
				var width = $scope.currentCanvasElement.width;
				ctx.clearRect(0, 0, width, height);
				$scope.drawingOptions.curentTool = "";
				$scope.inMemCanvas[$scope.currentCanvasNum][$scope.orientation].ctx.clearRect(0, 0, 1000, 1000);
			} else {
				var height = $scope.currentCanvasElement.height;
				var width = $scope.currentCanvasElement.width;
				var ctx = $scope.ctx;
				var index = (Number($scope.index) + 1);
	            var can_id;
	            
	            if ($scope.subTabIndex != 0) {
	                can_id = "canvas_" + $scope.orientation + "_" + index + "_" + $scope.subTabIndex;
	            } else {
	                can_id = "canvas_" + $scope.orientation + "_" + index;
	            }
				if (ctx.canvas.id == can_id) {
					ctx.clearRect(0, 0, width, height);
					$scope.drawingOptions.curentTool = "";

				}
			}			
		}
	};
	$scope.init();
}]);
