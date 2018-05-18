VLApp.controller('dragDropCtrl', ['$scope', '$timeout', '$window', 'appService', 'APPCONSTANT', function($scope, $timeout, $window, appService, APPCONSTANT) {
	$scope.dragList = $scope.appData.data.imagineComp.dragItems.drag;
	$scope.InsText1 = $scope.appData.data.imagineComp.InstructionText1.textpara;
	$scope.InsText2 = $scope.appData.data.imagineComp.InstructionText2.textpara;
	$scope.zIndex = 1;
	$scope.bInstructionNotes = true;
	$scope.bSticky = false;

	const TOTAL_STICKY_NOTES = 3;
	var sticky_count = 0;
	var depth = 10;
	const MAX_CHAR = 45;
	const IS_IPAD = appService.isIpadDevice();
	angular.element(document).ready(function() {
		//ActionManager.registerActionHandler(ElementManager.DROP_TARGET, $scope.triggerDropWithKey);
		$scope.$on(APPCONSTANT.LAB_VIEW_LOADED, function() {
			if ($scope.tabIndex == 4) {
				$('.draggable-Item').draggable({
					helper: function() {
						return $(this).clone().appendTo(".dnd-wrapper").css("zIndex", 2).show();
					},
					revert: 'invalid',
					containment: ".dnd-wrapper",
					cursor: "move",
					start: function(event, ui) {
						var $drag = ui.helper;
						$drag.css("z-index", depth++);
						$scope.$digest();
					},
					drag: function(event, ui) {
						//appService.updateDragablePosition(event, ui, $scope.scale,".dnd-wrapper");
					},
					stop: function(event, ui) {
						var $drag = ui.helper;
						$(this).draggable('option', 'revert', 'invalid');
					}
				});
				$timeout(function() {
					$('.droppable-container').droppable({
						accept: '.draggable',
						tolerance: "touch",
						greedy: true,
						drop: function(event, ui) {
							var droppableContainerHeight = $('.droppable-container')[0].getBoundingClientRect().height
							//console.log(ui,ui.offset.top ,droppableContainerHeight,ui.offset.top < droppableContainerHeight)
							if (ui.offset.top+ $(ui.helper).height()+ 10 < droppableContainerHeight + $('.droppable-container').offset().top) {
								var clone = $(ui.draggable).clone();
								$scope.dropContainerPos = $('.droppable-container').position();
								clone.css("position", "absolute");
								clone.css('left', ui.position.left / $scope.scale - $scope.dropContainerPos.left / $scope.scale);
								clone.css('top', ui.position.top / $scope.scale - $scope.dropContainerPos.top / $scope.scale);
								$(this).prepend(clone);
								$(".droppable-container .draggable").addClass("dropped-item");
								$(".droppable-container .draggable").css("z-index", depth++);
								$(".dropped-item").removeClass("ui-draggable draggable");
								$(".dropped-item").draggable({
									revert: "false",
									helper: "original",
									containment: ".imagine_container",
									start: function(event, ui) {
										var $drag = ui.helper;
										$drag.css("z-index", depth++);
									},
									drag: function(event, ui) {},
									stop: function(event, ui) {
										var $drag = ui.helper;
									}
								});
							}
						}
					});

					var abc = $('.droppable-container').droppable("instance");
					abc.proportions = function( /* valueToWrite */ ) {
						if (arguments.length) {
							proportions = arguments[0];
						} else {

							// Retrieve or derive the droppable's proportions
							return proportions ?
								proportions = {
									width: proportions.width * $scope.scale,
									height: proportions.height * $scope.scale
								} :
								proportions = {
									width: this.element[0].offsetWidth * $scope.scale,
									height: this.element[0].offsetHeight * $scope.scale
								};
						}
					}
					$.ui.draggable.prototype._mouseDrag = function(event, noPropagation) {

						// reset any necessary cached properties (see #5009)
						if (this.hasFixedAncestor) {
							this.offset.parent = this._getParentOffset();
						}

						//Compute the helpers position
						this.position = this._generatePosition(event, true);
						this.positionAbs = this._convertPositionTo("absolute");

						//Call plugins and callbacks and use the resulting position if something is returned
						if (!noPropagation) {
							var ui = this._uiHash();
							if (this._trigger("drag", event, ui) === false) {
								this._mouseUp(new $.Event("mouseup", event));
								return false;
							}
							this.position = ui.position;
						}

						this.helper[0].style.left = this.position.left / $scope.scale + "px";
						this.helper[0].style.top = this.position.top / $scope.scale + "px";

						if ($.ui.ddmanager) {
							$.ui.ddmanager.drag(this, event);
						}

						return false;
					};
					$.ui.draggable.prototype._generatePosition = function(event, constrainPosition) {

						var containment, co, top, left,
							o = this.options,
							scrollIsRootNode = this._isRootNode(this.scrollParent[0]),
							pageX = event.pageX,
							pageY = event.pageY;

						// Cache the scroll
						if (!scrollIsRootNode || !this.offset.scroll) {
							this.offset.scroll = {
								top: this.scrollParent.scrollTop(),
								left: this.scrollParent.scrollLeft()
							};
						}

						/*
						 * - Position constraining -
						 * Constrain the position to a mix of grid, containment.
						 */

						// If we are not dragging yet, we won't check for options
						if (constrainPosition) {
							if (this.containment) {
								if (this.relativeContainer) {
									co = this.relativeContainer.offset();

									containment = [
										(this.containment[0] + co.left),
										(this.containment[1] + co.top),
										(this.containment[2] * $scope.scale + co.left),
										(this.containment[3] * $scope.scale + co.top)
									];
								} else {
									containment = this.containment;
									containment = [
										(this.containment[0] * $scope.scale),
										(this.containment[1] * $scope.scale),
										(this.containment[2] * $scope.scale),
										(this.containment[3] * $scope.scale)
									]
								}
								if ((event.pageX - this.offset.click.left) < containment[0]) {
									pageX = containment[0] + this.offset.click.left;
								}
								if ((event.pageY - this.offset.click.top * $scope.scale) < containment[1]) {
									pageY = containment[1] + this.offset.click.top;
								}
								if ((event.pageX - this.offset.click.left) > containment[2]) {
									pageX = containment[2] + this.offset.click.left;
								}
								if ((event.pageY - this.offset.click.top) > containment[3]) {
									pageY = containment[3] + this.offset.click.top;
								}
							}

							if (o.grid) {

								//Check for grid elements set to 0 to prevent divide by 0 error causing invalid
								// argument errors in IE (see ticket #6950)
								top = o.grid[1] ? this.originalPageY + Math.round((pageY -
									this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
								pageY = containment ? ((top - this.offset.click.top >= containment[1] ||
										top - this.offset.click.top > containment[3]) ?
									top :
									((top - this.offset.click.top >= containment[1]) ?
										top - o.grid[1] : top + o.grid[1])) : top;

								left = o.grid[0] ? this.originalPageX +
									Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] :
									this.originalPageX;
								pageX = containment ? ((left - this.offset.click.left >= containment[0] ||
										left - this.offset.click.left > containment[2]) ?
									left :
									((left - this.offset.click.left >= containment[0]) ?
										left - o.grid[0] : left + o.grid[0])) : left;
							}

							if (o.axis === "y") {
								pageX = this.originalPageX;
							}

							if (o.axis === "x") {
								pageY = this.originalPageY;
							}
						}

						return {
							top: (

								// The absolute mouse position
								pageY -

								// Click offset (relative to the element)
								this.offset.click.top -

								// Only for relative positioned nodes: Relative offset from element to offset parent
								this.offset.relative.top -

								// The offsetParent's offset without borders (offset + border)
								this.offset.parent.top +
								(this.cssPosition === "fixed" ?
									-this.offset.scroll.top :
									(scrollIsRootNode ? 0 : this.offset.scroll.top))
							),
							left: (

								// The absolute mouse position
								pageX -

								// Click offset (relative to the element)
								this.offset.click.left -

								// Only for relative positioned nodes: Relative offset from element to offset parent
								this.offset.relative.left -

								// The offsetParent's offset without borders (offset + border)
								this.offset.parent.left +
								(this.cssPosition === "fixed" ?
									-this.offset.scroll.left :
									(scrollIsRootNode ? 0 : this.offset.scroll.left))
							)
						};

					};
					$.ui.draggable.prototype._mouseStop = function(event) {
						ActionManager.dispatchAction(APPCONSTANT.DRAGGING_STOPPED);
						//console.log("dropped-item Start Dragging");
						//If we are using droppables, inform the manager about the drop
						var that = this,
							dropped = false;
						if ($.ui.ddmanager && !this.options.dropBehaviour) {
							dropped = $.ui.ddmanager.drop(this, event);
						}

						//if a drop comes from outside (a sortable)
						if (this.dropped) {
							dropped = this.dropped;
							this.dropped = false;
						}

						if ((this.options.revert === "invalid" && !dropped) ||
							(this.options.revert === "valid" && dropped) ||
							this.options.revert === true || ($.isFunction(this.options.revert) &&
								this.options.revert.call(this.element, dropped))
						) {
							this.originalPosition.top = this.originalPosition.top / $scope.scale;
							this.originalPosition.left = this.originalPosition.left / $scope.scale;
							$(this.helper).animate(
								this.originalPosition,
								parseInt(this.options.revertDuration, 10),
								function() {


									if (that._trigger("stop", event) !== false) {
										that._clear();
									}
								}
							);
						} else {
							if (this._trigger("stop", event) !== false) {
								this._clear();
							}
						}

						return false;
					};
					$.ui.droppable.prototype._create = function() {

						var proportions,
							o = this.options,
							accept = o.accept;

						this.isover = false;
						this.isout = true;

						this.accept = $.isFunction(accept) ? accept : function(d) {
							return d.is(accept);
						};

						this.proportions = function( /* valueToWrite */ ) {
							if (arguments.length) {

								// Store the droppable's proportions
								proportions = arguments[0];
							} else {
								// Retrieve or derive the droppable's proportions
								return proportions ?
									proportions = {
										width: proportions.width * $scope.scale,
										height: proportions.height * $scope.scale
									} :
									proportions = {
										width: this.element[0].offsetWidth * $scope.scale,
										height: this.element[0].offsetHeight * $scope.scale
									};
							}
						};

						this._addToManager(o.scope);
						o.addClasses && this._addClass("ui-droppable");
					};

					$(".dropped-item").draggable({
						revert: "false",
						helper: "original",
						containment: ".imagine_container",
						start: function(event, ui) {
							var $drag = ui.helper;
							$drag.css("z-index", depth++);
							//  appService.clickedDragable = {"x":event.clientX,"y":event.clientY,"activeDragable":event.currentTarget};
							console.log("dropped-item Start Dragging");
						},
						drag: function(event, ui) {
							// appService.updateDragablePosition(event, ui, $scope.scale,".dnd-wrapper");
						},
						stop: function(event, ui) {
							var $drag = ui.helper;
							//$drag.css("z-index", $scope.zIndex);
							//$scope.zIndex++;
							// appService.updateDragablePosition(event, ui, $scope.scale,".droppable-container");
						}
					});
				}, 200)
			}
		});
	});
	//new code for accesibility drag and drop
	$scope.triggerDropWithKey = function(data) {
		if ($scope.tabIndex == 4) {
			$scope.bInstructionNotes = false;
			clone = $(data).clone();
			$scope.dropContainerPos = $('.droppable-container').position();
			clone.css("position", "relative");
			$('.droppable-container').append(clone);
			$(".droppable-container .draggable").addClass("dropped-item");
			$(".dropped-item").removeClass("ui-draggable draggable");
			$(".dropped-item").draggable({
				//containment: 'parent'
				revert: "false",
				helper: "original",
				containment: ".imagine_container",
				start: function(event, ui) {
					var $drag = ui.helper;
					$drag.css("z-index", depth++);
					$scope.$digest();
				},
				stop: function(event, ui) {
					var $drag = ui.helper;
				}
			});
			$('.selectedimg').removeClass('selectedimg');
			$timeout(function() {
				$scope.$apply()
			})
		}
	};
	//new code for accesibility drag and drop

	/**This method is responsible to make sticky draggable.
	 *@param {None}
	 *@return {None}
	 *@access {public}
	 */
	$scope.makeStickyDraggable = function() {
		$('.stickyWrapper').draggable({
			containment: '.droppable-container',
			cancel: ".stickNotes",
			start: function(event, ui) {
				var $drag = ui.helper;
				$drag.css("z-index", depth++);
			}
		});

         $('.stickNotes').on('click',function(){
           $(this).focus()
         })
		$('.stickNotes').on('focus', function() {
			var range, selection;
			if (document.createRange) {
				range = document.createRange();
				range.selectNodeContents(this);
				range.collapse(false);
				selection = window.getSelection();
				selection.removeAllRanges();
				selection.addRange(range);
			} else if (document.selection) {
				range = document.body.createTextRange();
				range.moveToElementText(this);
				range.collapse(false);
				range.select();
			}
		})

		$('.stickNotes').on('keydown', function(event) {
			if ($(this).text().length >= MAX_CHAR && event.keyCode != 8 || event.keyCode == 13) /*delete*/ {

				event.preventDefault();
				event.stopPropagation();
				//var strR = $(this).text().substr(0,MAX_CHAR-1);
				//$(this).text(strR)
				return false;
			}
		});

		$(".stickNotes").on("paste", function(e) {
			e.preventDefault();
			return;
		});
        
		$('.imagine_container [placeholder]').focus(function() {
           var input = $(this);
           if (input.text() == input.attr('placeholder')) {
               input.text('');
               input.removeClass('placeholder');
           }
       	}).blur(function() {
           var input = $(this);
           if (input.text() == '' || input.text() == input.attr('placeholder')) {
               input.addClass('placeholder');
               input.val(input.attr('placeholder')).text(input.attr('placeholder'));
           }
       	}).blur();
	};

	/**This method is responsible to reset the current screen.
	 *@param {None}
	 *@return {None}
	 *@access {public}
	 */
	$scope.resetScreen = function() {
		$scope.$broadcast("STOP_ALL_AUDIO_DIS");
		ActionManager.dispatchAction("STOP_ALL_AUDIO_DIS");
		var draggables = $(".dropped-item");
		$scope.$emit("CLEAR_DRAWING_PAD");
		// $scope.bInstructionNotes = false;
		$scope.bSticky = false;
		$scope.enableDraggables();
		//$('.stickNotes').empty().removeAttr('style');
		draggables.remove();

		$('.droppable-container').empty();
		$('.imagine-action-btn .sticky').removeClass("disabled-div");
		sticky_count = 0;
		depth = 10;
		// $scope.bInstructionNotes = false;
	};

	/**This method is responsible to show instruction notes.
	 *@param {None}
	 *@return {None}
	 *@access {public}
	 */
	$scope.showInstructionNotes = function() {
		$scope.bInstructionNotes = true;
		//$scope.disableDraggables();
	};

	/**This method is responsible to disable draggables.
	 *@param {None}
	 *@return {None}
	 *@access {public}
	 */
	$scope.disableDraggables = function() {
		var cloneDrags = $(".dropped-item")
		$scope.dragDisableClass = "disableDraggables";
		cloneDrags.addClass("disableDraggables");
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	};

	/**This method is responsible to enable draggables.
	 *@param {None}
	 *@return {None}
	 *@access {public}
	 */
	$scope.enableDraggables = function() {
		var cloneDrags = $(".dropped-item")
		$scope.dragDisableClass = "";
		cloneDrags.removeClass("disableDraggables");
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	};

	/**This method is responsible to show sticky notes.
	 *@param {None}
	 *@return {None}
	 *@access {public}
	 */
	$scope.showStickyNotes = function(evt) {
		//$scope.bSticky = true;
		if (sticky_count < TOTAL_STICKY_NOTES) {
			var elm = '<div class="stickyWrapper"><div id=sticky' + sticky_count + ' class="stickNotes" placeholder="Add notes here...." contenteditable="true" ng-show="bSticky"></div></div>';

			$('.droppable-container').append(elm);
			angular.element("#sticky" + sticky_count).parent().css("top", 80 * sticky_count + 20);
			$(".droppable-container .sticky-notes-holder .stickNotes:last-child").css("z-index", depth++);
			$scope.makeStickyDraggable();
			sticky_count++;
			if (sticky_count == TOTAL_STICKY_NOTES) {
				$(evt.currentTarget).addClass("disabled-div");
			}
		} else {

		}
		//$scope.bInstructionNotes = false;
	};

	/**This method is responsible to hide instruction notes.
	 *@param {None}
	 *@return {None}
	 *@access {public}
	 */
	$scope.hideInstructionNotes = function() {
		$scope.bInstructionNotes = false;
		$scope.$broadcast("STOP_ALL_AUDIO_DIS");
		ActionManager.dispatchAction("STOP_ALL_AUDIO_DIS");
		$scope.enableDraggables();
	};

	/**This method is responsible to print screen.
	 *@param {None}
	 *@return {None}
	 *@access {public}
	 */
	$scope.printScreen = function(evt) {
		var printData = {};
		printData.title = $scope.appData.title;
		printData.section = $scope.appData.tabs[$scope.tabIndex].title;
		printData.footer = $scope.appData.footer;

		$(".imagine-footer").css("pointer-events", "none");
		//$scope.bInstructionNotes = false;
		var draw_can = ($scope.orientation == "landscape") ? "canvas_landscape_5" : "canvas_portrait_5";
		var printWindow = IS_IPAD ? $window.open('', 'Print-Page', 'height=400,width=800') : null;

		var startScroll = makeScrollVisible();

		html2canvas(document.querySelectorAll('.lab-view'), {
			onrendered: function(canvas) {
				// canvas is the final rendered <canvas> element
				var screenShot = canvas.toDataURL("image/png");
				$('#printHolder').html('<img src="' + screenShot + '" class="print-image" alt="" width="720">');
				appService.printContainer('#printHolder', printWindow, printData);
				resetScrollVisible(startScroll);
				$(".imagine-footer").css("pointer-events", "visible");
			}
		});
	};

	var makeScrollVisible = function() {
		var startScrol = $('.drag-panel').scrollLeft();
		var total_Width = $('.drag-panel').width() + startScrol;
		var startWidth = $('.draggable-content').width();
		// $('.draggable-content').css()
		$('.draggable-content').each(function(ind) {
			if (startWidth > startScrol && startWidth <= total_Width) {
				$(this).css('display', 'inline-block');

			} else {
				$(this).css('display', 'none');
			}
			startWidth += $(this).width();
		});
		return startScrol;
	}

	var resetScrollVisible = function(startScrol) {
		$('.draggable-content').css('display', 'inline-block');
		$('.drag-panel').scrollLeft(startScrol);
	}
}])
