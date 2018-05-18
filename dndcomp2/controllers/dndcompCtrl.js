angular.module("VLApp").controller("dndcompCtrl", ["$scope", "appService", "APPCONSTANT", "$timeout", function($scope, appService, APPCONSTANT, $timeout) {

        var dragItems = {};
        var dropTargets = {};
        var containerDims = {};
        var objectDims = {};
        var dragStartPos = { x: 0, y: 0 };
        var depth = 10;
        var scalingFactor = 1;
        var applyScaleFix = false;

        $scope.$on(APPCONSTANT.LAB_VIEW_LOADED, function() {
            if($scope.state && $scope.state.scaleFix && ($scope.tabIndex == $scope.state.tabIndex)) { 
                applyScaleFix = true;
                scalingFactor = $($scope.state.scaleFix.parent).height()/ $($scope.state.scaleFix.content).height();
                $.ui.ddmanager.prepareOffsets = function(t, event) {
                    var i, j, m = $.ui.ddmanager.droppables[t.options.scope] || [],
                        type = event ? event.type : null,
                        list = (t.currentItem || t.element).find(":data(ui-droppable)").addBack();
                    droppablesLoop: for (i = 0; i < m.length; i++) {
                        if (m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0], (t.currentItem || t.element)))) {
                            continue;
                        }
                        for (j = 0; j < list.length; j++) {
                            if (list[j] === m[i].element[0]) {
                                m[i].proportions().height = 0;
                                continue droppablesLoop;
                            }
                        }
                        m[i].visible = m[i].element.css("display") !== "none";
                        if (!m[i].visible) {
                            continue;
                        }
                        if (type === "mousedown") {
                            m[i]._activate.call(m[i], event);
                        }
                        m[i].offset = m[i].element.offset();
                        m[i].proportions({
                            width: m[i].element[0].offsetWidth * scalingFactor,
                            height: m[i].element[0].offsetHeight * scalingFactor
                        });
                    }
                };
            }            
        });
        
        /** 
        * This is called from drag and drop directive
        * used to get state of drag and drop component.
        **/
        $scope.fetchComponentData = function (strId) {
            $scope.state = $scope.appData.data[strId];            
        }
        
        /**
         * methd initDnD invoked when controller init itself
         * @param {Object} objInitData dnd data
         * @return none
         */
        $scope.initDnD = function (id) { 
            var data = {
                "dndcompJson" : $scope.state
            };

            $scope.$emit("DnDInitialized", data);
        };

        /**
         * Each Drag item register itself with its controller
         */
        $scope.registerDragItems = function (el, attrs) {  
            var obj = {};
            obj.id = el[0].id;
            obj.pos = {};
            obj.pos.left = el[0].getBoundingClientRect().left;
            obj.pos.top = el[0].getBoundingClientRect().top;
            dragItems[el[0].id] = obj;
        };

        /**
         * Each Drag item register itself with its controller
         */
        $scope.registerDropTargets = function (el, attrs) {  
            var obj = {};
            obj.id = el[0].id;
            obj.pos = {};
            obj.pos.left = el[0].getBoundingClientRect().left;
            obj.pos.top = el[0].getBoundingClientRect().top;
            dropTargets[el[0].id] = obj;
        };
        
        /**
         * Invoked everytime when dragging start
         * param {Object} event
         * param {Object} ui jquery drag object
         * return {none}
         */
        $scope.onItemDragStart = function (event, ui, optionObj) { 
            if(applyScaleFix && optionObj && optionObj.containment) {
                ui.position.left = 0;
                ui.position.top = 0;

                containerDims = {};
                containerDims.width = $(optionObj.containment).width();
                containerDims.height = $(optionObj.containment).height();
                objectDims = {};
                objectDims.width = $(event.target).outerWidth();
                objectDims.height = $(event.target).outerHeight();
            }

            angular.element(event.target).css('z-index', depth++);

            var data = {
                "event": event,
                "ui": ui,
                "optionObj":optionObj
            };

            $scope.$emit("ItemDragStarted", data);            
        };

        /**
         * Invoked everytime when dragging
         * param {Object} event
         * param {Object} ui jquery drag  object
         * return {none}
         * Can not emit at the time of dragging as there will be many emits.
         */
        $scope.onItemDrag = function (event, ui, optionObj) {
            if(applyScaleFix && optionObj && optionObj.containment) {
                var 
                boundReached = false,
                scale = scalingFactor,
                changeLeft = ui.position.left - ui.originalPosition.left,
                newLeft = ui.originalPosition.left + changeLeft / scale,
                changeTop = ui.position.top - ui.originalPosition.top,
                newTop = ui.originalPosition.top + changeTop / scale;

                ui.position.left = newLeft;
                ui.position.top = newTop;
                
                if (ui.position.left > (containerDims.width - objectDims.width)) {
                    newLeft = (containerDims.width - objectDims.width)
                    boundReached = true;
                }

                // left bound check
                if (newLeft < 0) {
                    newLeft = 0;
                    boundReached = true;
                }

                // bottom bound check
                if (ui.position.top > (containerDims.height - objectDims.height)) {
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

            var data = {
                "event": event,
                "ui": ui,
                "optionObj":optionObj
            };

            $scope.$emit("ItemDragging", data); 
        }
        
        /**
         * Invoked everytime when dragging stop
         * param {Object} event
         * param {Object} ui jquery drag object
         * return {none}
         */
        $scope.onItemDragStop = function (event, ui, optionsObj) {
            var data = {
                "event": event,
                "ui": ui,
                "optionsObj":optionsObj
            };

            $scope.$emit("ItemDragStopped", data);
        };
        
        /**
         * Invoked when drop event triggred
         * @param {Object} event drop event reference
         * @param {Object} ui jqueryUI
         * @return {NONE}
         */
        $scope.onItemDrop = function (event, ui, optionsObj) { 

            var data = {
                "event": event,
                "ui": ui,
                "optionsObj":optionsObj
            };            
            if(!$(ui.draggable).hasClass('droppedItem')) {                 
                $scope.$emit("ItemDropped", data);
                $(event.target).find('[draggable-directive]').addClass('droppedItem');
            } else {
                $scope.$emit("againDropped", data);
            }            
        };

        /**
         * Invoked when drag element is over the drop element
         * @param {Object} event drop event reference
         * @param {Object} ui jqueryUI
         * @return {NONE}
         */
        $scope.onItemDragOver = function(event,ui){
            var data = {
                "event": event,
                "ui": ui
            };

            $scope.$emit("ItemDraggedOver", data);
        }

         /**
         * Invoked everytime when dragging out
         * param {Object} event
         * param {Object} ui jquery drag out object
         * return {none}
         */        
        $scope.onItemDragOut = function (event, ui) {
            var data = {
                "event": event,
                "ui": ui
            };

            $scope.$emit("ItemDraggedOut", data);
        };

        $scope.$on("initDragOnDrop", function(event, data){
            if($scope.state.dragAfterDrop) {
                var elem = $(data.event.target).find('[draggable-directive]');
                if(data.isResizable) {
                    elem = $(data.event.target).find('[draggable-directive]').parent();
                }
                $(data.event.target).find('[draggable-directive]').removeAttr('draggable-directive');                        
                elem.draggable($scope.state.dragAfterDrop);
                elem.draggable("option", {
                    start: function (event, ui) {
                        $scope.onItemDragStart(event, ui, $scope.state.customDragOptionsDropped);
                    },
                    drag : function(event,ui)  {
                        $scope.onItemDrag(event, ui, $scope.state.customDragOptionsDropped);
                    },
                    stop: function (event, ui) {
                        $scope.onItemDragStop(event, ui, $scope.state.customDragOptionsDropped);
                    }
                });
            }
        });

        $scope.$on('initResizeOnDrop', function(event, data) {
            if($scope.state.resizeAfterDrop) {
                data.isResizable = true;
                var elem = $(data.event.target).find("[draggable-directive]");
                elem.resizable($scope.state.resizeAfterDrop); 
                elem.resizable("option", {
                    start: function(event, ui) {
                        $scope.onResizeStart(event, ui);
                    },
                    resize: function(event, ui) {
                        $scope.onResize(event, ui);
                    }
                });
            }            
        });

        $scope.onResizeStart = function(event, ui) {
            if(applyScaleFix) {
                ui.position.left = 0; ui.position.top = 0;
            }
        };

        $scope.onResize = function(event, ui) { 
            if(applyScaleFix) {
                var 
                changeWidth = ui.size.width - ui.originalSize.width, 
                newWidth = ui.originalSize.width + changeWidth / percent, 
                changeHeight = ui.size.height - ui.originalSize.height, 
                newHeight = ui.originalSize.height + changeHeight / percent;  
                ui.size.width = newWidth; 
                ui.size.height = newHeight; 
            }
        };
        
        /**
         * Reset the screen
         */
        $scope.reset = function () {
            depth = 10;

            var data = {
                "scope": $scope
            };

            $scope.$emit("DnDReset", data);
        };

        $scope.$on('resetDnd', function(){            
            $scope.reset();
        });

        $scope.$on('toggleDnd', function(event, data) {           
            if(data.disable == true) {
                angular.element(data.elemRef).draggable("option", "disabled", true);
            } else {
                angular.element(data.elemRef).draggable("option", "disabled", false);
            }
        });
        
    }]);