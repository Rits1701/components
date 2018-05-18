VLApp.directive('zoompanDirective', ['$timeout', '$zoompan', function($timeout, $zoompan) {
	return {
		restrict: "EA",
		transclude: true,
		scope: {},
		templateUrl: "templates/zoompanTemplate.html",
		controller: "zoompanCtrl",
		link: function(scope, elem, attr) {

			if (attr.id) {
				scope.fetchComponentData(attr.id);
			}
			if (attr.data) {
				var attrData = JSON.parse(attr.data)
				scope.imgParentDivId = attrData.imgParentDivId;
				scope.imgDivId = attrData.imgDivId;
			}

			var self = this;
			var zoomFlag = false;
			var zoomLevel = 1;

			scope.$watch("curZoomLev", function(newValue, oldValue) {
				$zoompan.zoomLevel = newValue
			})

			scope.$watch("currentLeftValue", function(newValue, oldValue) {
				$zoompan.panPosition = newValue
			})

			scope.$on("ZOOMIN_" + attr.id, function() {
				scope.zoomInOutInnerPanelImage(1);
			})

			scope.$on("ADD_LISTNERS_" + attr.id, function() {
				scope.addListeners();
			})

			scope.$on("ZOOMOUT_" + attr.id, function() {
				scope.zoomInOutInnerPanelImage(-1);
			});

			scope.$on("RESET_" + attr.id, function() {
				zoomLevel = 1
				scope.setImageZoom(zoomLevel)
			});

			scope.$on("CENTER_" + attr.id, function() {
				var cssObj = {
					"left": "0px",
					"top": "0px"
				}
				elem.find('#' + scope.imgDivId).css(cssObj);
			});

			scope.$on("HANDLE_MOVEMENT_" + attr.id, function(event, position) {
				scope.handleMovement(position)
			});


			if (attr.showzoombtn != undefined && attr.showzoombtn == 'true') {
				scope.showzoombtn = true;
			}

			if (attr.showcontrols != undefined && attr.showcontrols == 'true') {
				scope.showControls = true;
			}

			// Setting up the initial scale value if initial scale is true//
			scope.setInitialScale = function() {
				if (attr.initialscale != undefined && attr.initialscale == 'true' && attr.initialscalevalue > 1) {
					zoomLevel = attr.initialscalevalue;
					scope.setImageZoom(zoomLevel)
				}
			}

			//This function is called when zoom in and zoomout button is called//
			scope.zoomInOutInnerPanelImage = function(bVal) {
				var _isZoomingOut = false;
				if (bVal) {
					if (bVal == 1) {
						if (!zoomFlag) {
							zoomLevel = zoomLevel + 0.25;
							zoomFlag = true;
						} else {
							zoomLevel = zoomLevel + 0.25;
						}

						if (zoomLevel > 2) {
							zoomLevel = 2;
						}
					} else {
						if (zoomLevel > 1) {
							zoomLevel = zoomLevel - 0.25;
							_isZoomingOut = true;
							if (zoomLevel < 1) {
								zoomLevel = 1;
							}
						}
					}
				}

				scope.setImageZoom(zoomLevel);

			}

			scope.repositionImage = function() {
				var nImageWidth = elem.find("#" + scope.imgDivId).width() * scope.curZoomLev;
				var _diffWidth = elem.find("#" + scope.imgParentDivId).width() - elem.find("#" + scope.imgDivId).width();
				var diffLeft = scope.curZoomLev * elem.find("#" + scope.imgDivId).width() - elem.find("#" + scope.imgDivId).width() - _diffWidth;
				var diffTop = scope.curZoomLev * elem.find("#" + scope.imgDivId).height() - elem.find("#" + scope.imgDivId).height();

				var lft = elem.find("#" + scope.imgDivId).css("left");
				lft = parseInt(lft.substr(0, lft.length - 2));
				var tp = elem.find("#" + scope.imgDivId).css("top");
				tp = parseInt(tp.substr(0, tp.length - 2));

				if (elem.find("#" + scope.imgParentDivId).width() < nImageWidth) {
					if (lft >= diffLeft / 2) {
						elem.find("#" + scope.imgDivId).css("left", diffLeft / 2 + "px");
					}

					if (lft * -1 > diffLeft / 2) {
						elem.find("#" + scope.imgDivId).css("left", -1 * diffLeft / 2 + "px");
					}
				} else {
					elem.find("#" + scope.imgDivId).css("left", "0px");
				}
				if (elem.find("#" + scope.imgParentDivId).height() < elem.find("#" + scope.imgDivId).height() * scope.curZoomLev) {
					//...fix the position problem while panning
					if (tp >= diffTop / 2) {
						elem.find("#" + scope.imgDivId).css("top", diffTop / 2 + "px");
					}

					if (tp * -1 > diffTop / 2 - (scope.nGapFromTop * 2)) {
						elem.find("#" + scope.imgDivId).css("top", -1 * (diffTop / 2 - (scope.nGapFromTop * 2)) + "px");
					}
				} else {
					elem.find("#" + scope.imgDivId).css("top", scope.nGapFromTop + "px");
				}
			}

			//This function is used for zoomin and zoomout of image container//
			scope.setImageZoom = function(zoomLevel) {
				var _isZoomingOut = false;
				elem.find("#" + scope.imgDivId).css("cursor", "default");
				scope.curZoomLev = zoomLevel;
				var scaleFunc = "scale(" + zoomLevel + "," + zoomLevel + ")";
				var cssObj = {};
				cssObj["-ms-transform"] = scaleFunc;
				cssObj["-moz-transform"] = scaleFunc;
				cssObj["-webkit-transform"] = scaleFunc;
				cssObj["-o-transform"] = scaleFunc;
				cssObj["-ms-transform-origin"] = "50% 50%";
				cssObj["-moz-transform-origin"] = "50% 50%";
				cssObj["-webkit-transform-origin"] = "50% 50%";
				cssObj["-o-transform-origin"] = "50% 50%";
				cssObj["max-width"] = "100%";
				cssObj["max-height"] = "100%";
				cssObj["top"] = "0px";
				cssObj["left"] = "0px";
				cssObj["position"] = "relative";
				cssObj["cursor"] = "default";
				cssObj["opacity"] = "1";
				cssObj["visibility"] = "visible";
				cssObj["-ms-transition"] = "all 0.2s ease";
				cssObj["-moz-transition"] = "all 0.2s ease";
				cssObj["-webkit-transition"] = "all 0.2s ease";
				cssObj["-o-transition"] = "all 0.2s ease";
				/*cssObj["width"] = "400px";
				cssObj["height"] = "400px";
				*/
				elem.find('#' + scope.imgDivId).css(cssObj);
				if (scope.curZoomLev > 1) {
					elem.find("#" + scope.imgDivId).css("cursor", "move");
				} else {
					elem.find("#" + scope.imgDivId).css("cursor", "default");
				}
				if (_isZoomingOut == true) {
					scope.repositionImage();
				}
			}


			scope.addListeners = function() {
				var self = this;
				var noSwiping = false;
				elem.find("#" + scope.imgParentDivId).find("#" + scope.imgDivId).unbind("mousedown").bind("mousedown", function(e) {
					scope.handleMouseDown(e);
				});

				elem.find("#" + scope.imgParentDivId).find("#" + scope.imgDivId).unbind("mouseup").bind("mouseup", function(e) {
					scope.handleMouseUp(e);
				});

				elem.find("#" + scope.imgParentDivId).find("#" + scope.imgDivId).unbind("touchstart").bind("touchstart", function(e) {
					scope.handleMouseDown(e);
				});

				elem.find("#" + scope.imgParentDivId).find("#" + scope.imgDivId).unbind("touchend").bind("touchend", function(e) {
					scope.handleMouseUp(e);
				});

				elem.find("#" + scope.imgParentDivId).find("#" + scope.imgDivId).unbind("mouseleave").bind("mouseleave", function(e) {
					if (scope.iscanvas == true) {
						return false;
					} else {
						scope.handleMouseUp(e);
					}
				});

				var startDiff = 0;
				var minDist = 0;
				var atEnd = 0;
				var stopZoom = false;

				var twofinger = "twofinger" in attr ? attr.twofinger : true


				elem.find("#" + scope.imgParentDivId).off("touchmove").on("touchmove", function(event) {
					//only run code if the user has two fingers touching
					if (event.originalEvent.touches.length === 2 && twofinger == true) {
						noSwiping = true;
						event.preventDefault();
						var YDiff = (event.originalEvent.touches[1].pageY - event.originalEvent.touches[0].pageY);
						var XDiff = (event.originalEvent.touches[1].pageX - event.originalEvent.touches[0].pageX);
						var _temp = Math.sqrt(YDiff * YDiff + XDiff * XDiff) - startDiff + atEnd;
						scope.curZoomLev = (_temp) / 150;

						if (scope.curZoomLev <= 2 && scope.curZoomLev >= .5) {
							minDist = _temp;
						}

						if (scope.curZoomLev > 2) {
							scope.curZoomLev = 2;
						}
						if (scope.curZoomLev < 1) {
							scope.curZoomLev = 1;
						}

						var scaleFunc = "scale(" + scope.curZoomLev + "," + scope.curZoomLev + ")";

						var cssObj = {};
						cssObj["-ms-transform"] = scaleFunc;
						cssObj["-moz-transform"] = scaleFunc;
						cssObj["-webkit-transform"] = scaleFunc;
						cssObj["-o-transform"] = scaleFunc;
						cssObj["-ms-transform-origin"] = "50% 50%";
						cssObj["-moz-transform-origin"] = "50% 50%";
						cssObj["-webkit-transform-origin"] = "50% 50%";
						cssObj["-o-transform-origin"] = "50% 50%";



						elem.find("#" + scope.imgParentDivId).find("#" + scope.imgDivId).css(cssObj);
						scope.repositionImage();

					} else if (event.originalEvent.touches.length === 1) {
						noSwiping = false;
					}
				}).on("touchstart", function(e) {

					if (e.originalEvent.touches.length === 2) {
						//start-over
						var YDiff = (e.originalEvent.touches[1].pageY - e.originalEvent.touches[0].pageY)
						var XDiff = (e.originalEvent.touches[1].pageX - e.originalEvent.touches[0].pageX)
						startDiff = Math.sqrt(YDiff * YDiff + XDiff * XDiff);
					}
				}).on("touchend", function() {
					var touchObj = {
						"curZoomLev": scope.curZoomLev,
						"zoomPanId": attr.id
					}
					scope.$emit("TOUCHMOVE_TWO_FINGER", touchObj);
					atEnd = minDist;
				});

				elem.find("#" + scope.imgParentDivId).off("tap").on('tap', function(e) {
					var lastTap = 0;
					var now = (new Date()).valueOf();
					var diff = (now - lastTap);
					lastTap = now;
					if (diff < 250 && ismobile) {
						scope.zoomInOutInnerPanelImage(null, 1);
						scope.repositionImage();
						atEnd = 0;
					}
				});
			}

			var winRTx1 = 0;
			scope.handleMouseDown = function(e) {


				if (e.originalEvent.touches && e.originalEvent.touches.length == 2) {
					return;
				}
				e.preventDefault();
				if (scope.curZoomLev <= 1) {
					winRTx1 = e.pageX;
					return;
				}
				winRTx1 = 0;
				var scaleVal = scope.curZoomLev;
				var oldPosX;
				var oldPosY;
				var _imageObj = elem.find("#" + scope.imgParentDivId).find("#" + scope.imgDivId);
				var _imageParentDivObj = elem.find("#" + scope.imgParentDivId) /*.find("#expandedImageContainer")*/ ;
				var _ismobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);

				_imageObj.css('transition-duration', '0s')
				_imageObj.css('-o-transition-duration', '0s')
				_imageObj.css('-moz-transition-duration', '0s')
				_imageObj.css('-webkit-transition-duration', '0s')

				if (e.offsetX == undefined) {
					if (_ismobile != null) {
						var _pX = e.originalEvent.touches[0].pageX;
						var _pY = e.originalEvent.touches[0].pageY;
					} else {
						if ("touches" in e.originalEvent) {
							var _pX = e.originalEvent.touches[0].pageX;
							var _pY = e.originalEvent.touches[0].pageY;
						} else {
							var _pX = e.pageX;
							var _pY = e.pageY;
						}

						// var _pX = e.pageX;
						// var _pY = e.pageY;
					}
					oldPosX = _pX - _imageObj.offset().left;
					oldPosY = _pY - _imageObj.offset().top;
				} else {
					oldPosX = e.offsetX;
					oldPosY = e.offsetY;
				}

				var imageParentdivHeight = _imageParentDivObj.height();
				var imageParentdivWidth = _imageParentDivObj.width();
				var imageHeight = _imageObj.height();
				var imageWidth = _imageObj.width();
				var scaleImageWidth = _imageObj.width() * scaleVal;
				var scaledImageHeight = _imageObj.height() * scaleVal;

				scope.nGapFromTop = Math.abs((_imageObj.height() - imageParentdivHeight) / 2);

				var _diffWidth = imageParentdivWidth - imageWidth;
				var _diffHeight = imageParentdivHeight - imageHeight;
				//_diff = _diff / 2;
				var diffLeft = scaleImageWidth - imageWidth - _diffWidth;
				var diffTop = scaledImageHeight - imageHeight;
				_imageObj.unbind("mousemove touchmove").bind("mousemove touchmove", function(event) {
					if (event.originalEvent.touches && event.originalEvent.touches.length == 2) {
						return;
					}
					scope.hasPanned = true;
					var newPosX;
					var newPosY;
					if (event.offsetX == undefined) {
						if (_ismobile != null) {
							var _pNewX = event.originalEvent.touches[0].pageX;
							var _pNewY = event.originalEvent.touches[0].pageY;
						} else {
							if ("touches" in event.originalEvent) {
								var _pNewX = event.originalEvent.touches[0].pageX;
								var _pNewY = event.originalEvent.touches[0].pageY;
							} else {
								var _pNewX = event.pageX;
								var _pNewY = event.pageY;
							}
							// var _pNewX = event.pageX;
							// var _pNewY = event.pageY;
						}
						newPosX = _pNewX - _imageObj.offset().left;
						newPosY = _pNewY - _imageObj.offset().top;
					} else {
						newPosX = event.offsetX;
						newPosY = event.offsetY;
					}

					var lft = _imageObj.css("left");
					lft = parseInt(lft);
					var tp = _imageObj.css("top");
					tp = parseInt(tp);
					var leftMoveVal = lft + newPosX - oldPosX;
					var topMoveVal = tp + newPosY - oldPosY;

					if (scaleImageWidth > imageParentdivWidth) {
						if ((leftMoveVal <= diffLeft / 2) && (leftMoveVal * -1 < diffLeft / 2)) {
							scope.currentLeftValue = leftMoveVal;
							_imageObj.css("left", leftMoveVal);
						} else {
							if (leftMoveVal < 0) {
								scope.currentLeftValue = -diffLeft / 2;
								_imageObj.css("left", -diffLeft / 2);
							} else {
								scope.currentLeftValue = diffLeft / 2;
								_imageObj.css("left", diffLeft / 2);
							}
						}
					}

					if (scaledImageHeight > imageParentdivHeight) {
						if (scope.nGapFromTop > 0) {
							//...fix the position problem while panning
							if ((topMoveVal <= diffTop / 2) && ((topMoveVal * -1 < diffTop / 2 - (scope.nGapFromTop * 2)))) {
								_imageObj.css("top", topMoveVal);
							}
						} else {
							// run normally
							if ((topMoveVal <= diffTop / 2) && ((topMoveVal * -1 < diffTop / 2))) {
								_imageObj.css("top", topMoveVal);
							} else {
								if (topMoveVal < 0) {
									_imageObj.css("top", -diffTop / 2);
								} else {
									_imageObj.css("top", diffTop / 2);
								}
							}
						}
					}
				});
				//e.preventDefault();
			}

			scope.handleMouseUp = function(e) {
				elem.find("#" + scope.imgParentDivId).find("#" + scope.imgDivId).unbind("mousemove touchmove");
				if (winRTx1 == 0) {
					return;
				}
			}

			scope.handleMovement = function(position) {
				var scaleVal = scope.curZoomLev;
				var _imageObj = elem.find("#" + scope.imgParentDivId).find("#" + scope.imgDivId);
				var _imageParentDivObj = elem.find("#" + scope.imgParentDivId);
				//var _ismobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);

				var imageParentdivHeight = _imageParentDivObj.height();
				var imageParentdivWidth = _imageParentDivObj.width();
				var imageHeight = _imageObj.height();
				var imageWidth = _imageObj.width();
				var scaleImageWidth = _imageObj.width() * scaleVal;
				var scaledImageHeight = _imageObj.height() * scaleVal;

				scope.nGapFromTop = Math.abs((_imageObj.height() - imageParentdivHeight) / 2);

				var _diffWidth = imageParentdivWidth - imageWidth;
				var _diffHeight = imageParentdivHeight - imageHeight;
				var diffLeft = scaleImageWidth - imageWidth - _diffWidth;
				var diffTop = scaledImageHeight - imageHeight;

				var lft = _imageObj.css("left");
				lft = parseInt(lft);
				var tp = _imageObj.css("top");
				tp = parseInt(tp);
				if (scaleImageWidth > imageParentdivWidth) {
					if (position == 'right') {
						var calculatedWidth = (imageParentdivWidth - scaleImageWidth) / 2;
						if ((lft - 10) > calculatedWidth) {
							_imageObj.css({
								"left": lft - 10,
								"transition": "all 0.2s ease"
							});
						}
					} else if (position == 'left') {
						var calculatedWidth = (scaleImageWidth - imageParentdivWidth) / 2;
						if (calculatedWidth > (lft + 10)) {
							_imageObj.css({
								"left": lft + 10,
								"transition": "all 0.2s ease"
							});
						}
					}
				}

				if (scaledImageHeight > imageParentdivHeight) {
					if (position == 'top') {
						var calculatedHeight = (scaledImageHeight - imageParentdivHeight) / 2;
						if (calculatedHeight > (tp + 10)) {
							_imageObj.css({
								"top": tp + 10,
								"transition": "all 0.2s ease"
							});
						}
					} else if (position == 'bottom') {
						var calculatedHeight = (imageParentdivHeight - scaledImageHeight) / 2;
						if ((tp - 10) > calculatedHeight) {
							_imageObj.css({
								"top": tp - 10,
								"transition": "all 0.2s ease"
							});
						}

					}
				}
			}

			$timeout(function() {
				scope.addListeners();
				scope.setInitialScale();
				scope.zoomInOutInnerPanelImage();
			}, 100)
		}
	}

}]);

VLApp.factory("$zoompan", ['$rootScope', function($rootScope) {
	return {
		zoomLevel: "",
		panPosition: "",
		tiltPosition: "",
		zoomIn: function(id) {
			$rootScope.$broadcast("ZOOMIN_" + id)
		},
		zoomOut: function(id) {
			$rootScope.$broadcast("ZOOMOUT_" + id)
		},
		reset: function(id) {
			$rootScope.$broadcast("RESET_" + id)
		},
		center: function(id) {
			$rootScope.$broadcast("CENTER_" + id)
		},
		addListners: function(id) {
			$rootScope.$broadcast("ADD_LISTNERS_" + id)
		},
		handleMovement: function(id, position) {
			$rootScope.$broadcast("HANDLE_MOVEMENT_" + id, position)
		}
	}
}])
