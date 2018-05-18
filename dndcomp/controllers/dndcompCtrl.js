(function () {
    function DndController($scope, appService) {
        //CONSTANTS
        $scope.ALIGN_FREE = "free";
        $scope.ALIGN_HORIZONTAL = "horizontal";
        $scope.ALIGN_HORIZONTAL_BT = "horizontalBT";
        $scope.ALIGN_VERTICAL = "vertical";
        $scope.ALIGN_CENTER = "center";
        $scope.replace = false;
        $scope.ONE_TO_ONE = "OneToOne";
        $scope.resizeAfterDrop = 0;
        $scope.dropCount = 0;
        $scope.ONE_TO_MANY = "OneToMany";
        $scope.MANY_TO_ONE = "ManyToOne";
        $scope.rowCount = 0;
        $scope.lastLeft = 0;
        //FREE, HORIZONTAL, VERTICAL
        $scope.alignment = "=";
        //-1 represent no limit
        $scope.maxLimit = -1;
        $scope.setItemPositionVal = false;
        $scope.dict_drag_item = {};
        $scope.dict_drop_item = {};
        $scope.gap = 0;
        $scope.colCount = -1;
        $scope.dict_map_draggable = {};
        $scope.dict_map_droppable = {};
        $scope.containment = "";
        $scope.revert = "false";
        $scope.helper = false;
        $scope.zindex = 10;
        $scope.position = {};
        $scope.type = $scope.ONE_TO_ONE;
        $scope.rowHeight = -1;
        $scope.currentItem = undefined;
        $scope.resetItemDimension = {};
        $scope.drag_item_original_position = {};
        
        /** 
        * This is called from drag and drop directive
        * used to get state of drag and drop component.
        **/
        $scope.fetchComponentData = function (strId) {
                $scope.state = $scope.appData.data[strId];
                $scope.initDnD();
            }
            //init variables
            /**
             * methd initDnD invoked when controller init itself
             * @param {Object} objInitData dnd data
             * @return none
             */
        $scope.initDnD = function () {
            $scope.drag_item_original_position = {};
            if ($scope.state.type) $scope.type = $scope.state.type;
            if ($scope.state.dragOptions) $scope.dragOptions = $scope.state.dragOptions;
            if ($scope.state.dropOptions) $scope.dropOptions = $scope.state.dropOptions;
            if ($scope.state.dropResponses) $scope.dropResponses = $scope.state.dropResponses;
            if ($scope.state.placementondrop) $scope.alignment = $scope.state.placementondrop;
            
            if ($scope.state.replace)
                $scope.replace = $scope.state.replace;
            
            if ($scope.state.revert) $scope.revert = ($scope.state.revert == "true") ? true : false;
            
            if ($scope.state.helper) $scope.helper = $scope.state.helper;
            
            if ($scope.state.maxLimit) $scope.maxLimit = $scope.state.maxLimit;
            
            if ($scope.state.gap) $scope.gap = $scope.state.gap;
            
            if ($scope.state.containment) $scope.containment = $scope.state.containment;
            
            if ($scope.state.colCount) $scope.colCount = objInitData.colCount;
            
            if ($scope.state.resizeAfterDrop) $scope.resizeAfterDrop = objInitData.resizeAfterDrop;
            
            if ($scope.state.rowHeight) $scope.rowHeight = objInitData.rowHeight;
            
        };
        /**
         * Each Drag item register itself with its controller
         */
        $scope.registerDragItems = function (el, attrs) {
            
            //making sure drag position to set absolute.
            el.css("position", "absolute");
            //store drag item original position
            var objItemPosition = {};
            var objData = appService.getByValueFromArray($scope.state.dragItems.drag, "id", attrs.id);
            objItemPosition.left = objData.left;
            objItemPosition.top = objData.top;
            $scope.drag_item_original_position[attrs.id] = objItemPosition;
            //store drag el and attrs for further use.
            $scope.dict_drag_item[attrs.id] = {
                "elRef": el
                , "attrsRef": attrs.value
            };
         };
        
        /**
         * Return true or false based on the drop item count.
         */
        $scope.enableCheck = function () {
            var bEnable = false;
            if ($scope.dict_drop_item.droppable1 && $scope.dict_drop_item.droppable2) {
                bEnable = ($scope.dict_drop_item.droppable1.length == 4 && $scope.dict_drop_item.droppable2.length == 4);
            }
            return bEnable;
        };
        
        /**
         * Invoked everytime when dragging start
         * param {Object} event
         * param {Object} ui jquery drag object
         * return {none}
         */
        $scope.onItemDragStart = function (event, ui) {
            $scope.currentItem = $(event.currentTarget);
            $scope.currentItem.css("z-index", $scope.zindex++);
            if ($scope.currentItem.attr("isClone") == "true") {
                $scope.currentItem.attr("isClone", "removeAfterDrop");
            }
            $scope.currentItem.attr('isDragging', "true");
            //$scope.currentItem.css('z-index', 100);
            //Resizing drag item after drop if value set to true in html attributes
            if ($scope.resizeAfterDrop != 0) {
                $scope.currentItem.innerWidth($scope.resetItemDimension.width);
                $scope.currentItem.innerHeight($scope.resetItemDimension.height);
            }
        };
        /**
         * Invoked everytime when dragging
         * param {Object} event
         * param {Object} ui jquery drag  object
         * return {none}
         */

        $scope.onItemDrag = function (event, ui) {

        }
        
        /**
         * Invoked everytime when dragging out
         * param {Object} event
         * param {Object} ui jquery drag out object
         * return {none}
         */
        
        $scope.onItemDragOut = function (event, ui) {
            if (ui.helper.hasClass('help') == true) {
                return;
            }
            $scope.updateMapping($scope.currentItem);
            $scope.setItemPosition($(event.target), $scope.currentItem);
        };
        /**
         * Invoked everytime when dragging stop
         * param {Object} event
         * param {Object} ui jquery drag object
         * return {none}
         */
        $scope.resetDragItemPosition = function (item) {
            var droppedAt, arrToReset = [];
            if ($scope.dict_drag_item[item.attr('id')]) {
                droppedAt = $scope.dict_drag_item[item.attr('id')];
                if (droppedAt && droppedAt.attr) {
                    var id = droppedAt.attr('id');
                    arrToReset = $scope.dict_drop_item[id];
                    if (arrToReset) {
                        $scope.setItemPosition(droppedAt, arrToReset[0]);
                    }
                }
            }
            $scope.updateMapping($scope.currentItem);
            if (arrToReset && arrToReset.length > 0) {
                $scope.setItemPosition(droppedAt, arrToReset[0]);
            }
        };
        /**
         * Invoked everytime when dragging stop
         * param {Object} event
         * param {Object} ui jquery drag object
         * return {none}
         */
        $scope.onItemDragStop = function (event, ui) {
           /* if ($scope.currentItem.attr("isClone") == "removeAfterDrop") {
                $scope.resetDragItemPosition($scope.currentItem);
                $scope.currentItem.remove();
            }
            var isDropAtCorrectPos = !($scope.currentItem.attr('isDragging') == "true");
            if (isDropAtCorrectPos == false) {
                var dragItemId = $(ui.helper).attr('id');
                var droppedAt = $scope.dict_drag_item[dragItemId];
                $scope.setToOriginalPosition($scope.currentItem);
                $scope.currentItem.removeAttr('isDragging');
                $scope.updateMapping($scope.currentItem);
                //                $scope.setItemPosition(droppedAt, $scope.dict_drop_item[droppedAt.attr('id')][0]);
                if (droppedAt && droppedAt.attr && $scope.dict_drop_item[droppedAt.attr('id')] && $scope.dict_drop_item[droppedAt.attr('id')].length > 0) {
                    $scope.setItemPosition(droppedAt, $scope.dict_drop_item[droppedAt.attr('id')][0]);
                }
            }*/
            //$scope.$parent.enableCheckAnswer($scope.enableCheck());
        };
        /**
         * Method 'setToOriginalPosition' is responsible to set the drag
         * to its original position
         *
         * param {Object} targetObject jquery drag object reference
         * return {none}
         */
        $scope.setToOriginalPosition = function (targetObject) {
            var posObj = $scope.drag_item_original_position[targetObject.attr('id')];
            if (posObj) {
                targetObject.css("left", posObj.left + "px");
                targetObject.css("top", posObj.top + "px");
            }
        };
        /**
         * Method 'updateMapping' is responsible to update the dictionary
         *
         * param {Object} targetObject jquery drag object reference
         * return {none}
         */
        $scope.updateMapping = function (targetObject) {
            if (targetObject == undefined) {
                return;
            }
            var droppedAt = $scope.dict_drag_item[targetObject.attr('id')];
            if (droppedAt && droppedAt.attr) {
                droppedAt = droppedAt.attr('id');
            }
            if ($scope.dict_drop_item[droppedAt]) {
                var index = $scope.dict_drop_item[droppedAt + "name"].indexOf(targetObject.attr('id'));
                $scope.dict_drop_item[droppedAt].splice(index, 1);
                $scope.dict_drop_item[droppedAt + "name"].splice(index, 1);
            }
            delete $scope.dict_drag_item[targetObject.attr('id')];
        };
        /**
         * Invoked when drop event triggred
         * @param {Object} event drop event reference
         * @param {Object} ui jqueryUI
         * @return {NONE}
         */
        /**
         * Invoked when drag element is over the drop element
         * @param {Object} event drop event reference
         * @param {Object} ui jqueryUI
         * @return {NONE}
         */
        $scope.onItemDragOver = function(event,ui){

        }
        $scope.onItemDrop = function (event, ui) {
            if (ui.draggable.hasClass('help')) {
                return;
            }
            if ($scope.currentItem == undefined) {
                return;
            }
            //            $scope.resetDragItemPosition($scope.currentItem);
            var droppableId, draggableId, bItemDropped = false;
            droppableId = event.target.id;
            draggableId = $scope.currentItem.attr('id');
            //verify max limit.
            if ($scope.rowCount >= 3) {
                var containerLeft = $(event.target).position().left + $(event.target).innerWidth() + $scope.gap;
                var itemLeft = $scope.lastLeft + parseFloat($scope.currentItem.css('width')) + $scope.gap;
                if (itemLeft > containerLeft) {
                    return;
                }
            }
            if ($scope.maxLimit != -1 && $scope.dict_drop_item[droppableId] && $scope.maxLimit <= $scope.dict_drop_item[droppableId].length) {
                return;
            }
            switch ($scope.type) {
            case $scope.ONE_TO_ONE:
                switch ($scope.replace) {
                case true:
                    if ($scope.dict_drop_item[droppableId] != undefined && $scope.dict_drop_item[droppableId].length > 0) {
                        $scope.setToOriginalPosition($scope.dict_drop_item[droppableId][0]);
                        $scope.dict_drop_item[droppableId][0].draggable( "enable" );
                        $scope.dict_drop_item[droppableId] = [];
                       // $scope.dict_drop_item[droppableId][0] = $scope.currentItem;
                        $( "#"+draggableId ).draggable( "disable" );
                    }else{
                        $scope.dropCount++;
                        $( "#"+draggableId ).draggable( "disable" );
                    }
                    $scope.currentItem.attr('isDragging', "false");
                    bItemDropped = true;
                    $scope.dict_drop_item[droppableId] = [];
                    $scope.dict_drop_item[droppableId][0] = $scope.currentItem;
                    break;
                case false:
                    if ($scope.dict_drop_item[droppableId] != undefined && $scope.dict_drop_item[droppableId].length > 0) {
                      //  $( "#"+draggableId ).draggable( "disable" );
                        $scope.setToOriginalPosition($( "#"+draggableId ))
                        return false;
                    }else{
                        $scope.currentItem.attr('isDragging', "false");
                        bItemDropped = true;
                        $scope.dropCount++;
                        $scope.dict_drop_item[droppableId] = [];
                        $scope.dict_drop_item[droppableId][0] = $scope.currentItem;
                        $( "#"+draggableId ).draggable( "disable" );
                    }
                    break;
                }
                $scope.setItemPosition($(event.target), ui.draggable);
                $scope.state.dropResponses[droppableId]['dragId'] = draggableId;
                $scope.state.dropResponses[droppableId]['isCorrect'] = true;

                break;
            case $scope.MANY_TO_ONE:
                switch ($scope.replace) {
                case true:
                    break;
                case false:
                    var temp;
                    if ($scope.helper == "clone") {
                        if ($scope.currentItem.attr('isClone') != "removeAfterDrop") {
                            var dragItemHTML = ui.helper.context.outerHTML;
                            temp = $(dragItemHTML);
                            temp.attr("id", temp.attr("id") + "_" + new Date().getTime());
                            temp.attr('isClone', "true");
                            draggableId = temp.attr("id");
                            $($scope.currentItem.parent()).append(temp);
                            $scope.createDraggable(temp);
                            $scope.currentItem = temp;
                        }
                        else {
                            $scope.currentItem.attr('isClone', "true")
                        }
                    }
                    $scope.currentItem.attr('isDragging', "false");
                    bItemDropped = true;
                    break;
                }
                break;
            }
            if ($scope.resizeAfterDrop != 0) {
                var decreaseWidth, decreaseHeight;
                decreaseWidth = $scope.currentItem.innerWidth();
                $scope.resetItemDimension.width = decreaseWidth;
                decreaseWidth = decreaseWidth - (decreaseWidth * $scope.resizeAfterDrop / 100);
                decreaseHeight = $scope.currentItem.innerHeight();
                $scope.resetItemDimension.height = decreaseHeight;
                decreaseHeight = decreaseHeight - (decreaseHeight * $scope.resizeAfterDrop / 100);
                $scope.currentItem.innerWidth(decreaseWidth);
                $scope.currentItem.innerHeight(decreaseHeight);
            }




            if($scope.dropCount>=$scope.state.dropItems.drop.length)
            alert('All items dropped');
            //$scope.enableCheckAnswer(droppableId, draggableId);
        };
        /**
         * if helper property set to clone in html drag and drop template
         * then this method will be responsible to init drag feature on
         * newly created item.
         * @param {Jquery UI Object} tempObj
         * @return {None}
         */
        $scope.createDraggable = function (tempObj) {
            tempObj.draggable({
                revert: false
                , containment: $scope.containment
                , helper: "none"
                , start: function (event, ui) {
                    $scope.onItemDragStart(event, ui);
                }
                , stop: function (event, ui) {
                    $scope.onItemDragStop(event, ui);
                }
            });
        };
        /**
         * This method is responsible to map the drag and drop item
         * position for future use.
         * @param {String} droppableId
         * @param {String} draggableId
         * @return{NONE}
         */
        $scope.mapItemDict = function (droppableId, draggableId, droppableRef) {
            //mapping for future reference
            if ($scope.dict_drop_item[droppableId] == undefined) $scope.dict_drop_item[droppableId] = [];
            if ($scope.dict_drop_item[droppableId + "name"] == undefined) $scope.dict_drop_item[droppableId + "name"] = [];
            var itemFound = $scope.isItemExist($scope.dict_drop_item[droppableId], $scope.currentItem);
            if (itemFound == false) {
                $scope.dict_drag_item[draggableId] = droppableRef;
                $scope.dict_drop_item[droppableId].push($scope.currentItem);
                $scope.dict_drop_item[droppableId + "name"].push($scope.currentItem.attr("id"));
            }
        };
        $scope.isItemExist = function (itemArray, item) {
            var itemFound = false;
            var objItemId = item.attr('id');
            for (var i = 0; i < itemArray.length; i++) {
                if (itemArray[i].attr('id') == objItemId) {
                    itemFound = true;
                    break;
                }
            }
            return itemFound;
        };
        /**
         * Responsible to set the drag item position when item
         * dropped at any droppable item.
         * based on the parameter set through html template
         * this method execute required set of code block to set the
         * drag item position
         * @param {Object} container
         * @param {Object} target
         * @return{NONE}
         */
        $scope.setItemPosition = function (container, target) {
            var strAlign = $scope.alignment
                , droppableId;
            switch (strAlign) {
            case $scope.ALIGN_CENTER:
                var leftValue, topValue;
                leftValue = container.position().left + (container.innerWidth() - target.innerWidth()) / 2;
                topValue = container.position().top + +(container.innerHeight() - target.innerHeight()) / 2;
                target.css("left", leftValue + "px");
                target.css("top", topValue + "px");
                break;
            case $scope.ALIGN_HORIZONTAL:
                $scope.setHorizontalPosition(container, $scope.dict_drop_item[container.attr('id')]);
                break;
            case $scope.ALIGN_HORIZONTAL_BT:
                $scope.alignHorizontalBT(container, $scope.dict_drop_item[container.attr('id')]);
                break;
            case $scope.ALIGN_VERTICAL:
                $scope.setVerticalPosition(container, $scope.dict_drop_item[container.attr('id')]);
                break;
            }
        };
        /**
         * Responsible to set the item horizontally
         * @param {Object} container
         * @param {Object} target
         * @return{NONE}
         */
        $scope.setVerticalPosition = function (container, arrTarget) {
            var tempRowHeight, tempRow, left = container.position().left + $scope.gap
                , top = parseInt(container.css('top')) + $scope.gap
                , bSetLeft = false;
            $scope.rowCount = 1;
            if ($scope.rowHeight != -1) {
                tempRowHeight = $scope.rowHeight + +$scope.gap;
                tempRow = tempRowHeight;
            }
            var containerWidth = (left + container.innerWidth()) + ($scope.gap);
            //$(event.target).position().left + $(event.target).innerWidth() + $scope.gap
            for (var i = 0; i < arrTarget.length; i++) {
                var target = arrTarget[i];
                left = container.position().left - 2;
                left = left + ((container.innerWidth() - target.innerWidth()) / 2);
                if (containerWidth < (left + target.innerWidth() + $scope.gap)) {
                    $scope.rowCount = $scope.rowCount + 1;
                    //left = container.position().left + $scope.gap;
                    //console.log("2..", left);
                    top = top + target.innerHeight() + $scope.gap;
                    if ($scope.rowHeight != -1) {
                        tempRowHeight = tempRow + tempRowHeight;
                    }
                }
                if ($scope.rowHeight != -1) {
                    top = (tempRowHeight - target.innerHeight()) + parseInt(container.css('top'));
                }
                target.css('left', left + 'px');
                target.css('top', top + 'px');
                //left = left + target.innerWidth() + $scope.gap;
                top = top + target.innerHeight() + $scope.gap;
                $scope.lastTop = top;
            }
        };
        /**
         * Responsible to set the item horizontally
         * @param {Object} container
         * @param {Object} target
         * @return{NONE}
         */
        $scope.setHorizontalPosition = function (container, arrTarget) {
            if (arrTarget == undefined) {
                return;
            }
            var tempRowHeight, tempRow, left = container.position().left + $scope.gap
                , top = parseInt(container.css('top')) + $scope.gap
                , bSetLeft = false;
            $scope.rowCount = 1;
            if ($scope.rowHeight != -1) {
                tempRowHeight = $scope.rowHeight + +$scope.gap;
                tempRow = tempRowHeight;
            }
            var containerWidth = (left + container.innerWidth()) + ($scope.gap);
            //$(event.target).position().left + $(event.target).innerWidth() + $scope.gap
            for (var i = 0; i < arrTarget.length; i++) {
                var target = arrTarget[i];
                if (containerWidth < (left + target.innerWidth() + $scope.gap)) {
                    $scope.rowCount = $scope.rowCount + 1;
                    left = container.position().left + $scope.gap;
                    top = top + target.innerHeight() + $scope.gap;
                    if ($scope.rowHeight != -1) {
                        tempRowHeight = tempRow + tempRowHeight;
                    }
                }
                if ($scope.rowHeight != -1) {
                    top = (tempRowHeight - target.innerHeight()) + parseInt(container.css('top'));
                }
                target.css('left', left + 'px');
                target.css('top', top + 'px');
                left = left + target.innerWidth() + $scope.gap;
                $scope.lastLeft = left;
            }
        };
        /**
         * Responsible to set the item horizontally and by row
         * when a row is filled then a new row will be created on the
         * top of existing row.
         *
         * @param {Object} container
         * @param {Array} arrTarget
         * @return{NONE}
         */
        $scope.alignHorizontalBT = function (container, arrTarget) {
            var left = parseInt(container.css('left'))
                , top = parseInt(container.css('top'))
                , bSetLeft = false;
            top = top + (container.height() / 2) - 10;
            for (var i = 1; i <= arrTarget.length; i++) {
                var target = arrTarget[i - 1];
                if (bSetLeft == true) {
                    left = left + target.innerWidth() + $scope.gap;
                }
                else {
                    bSetLeft = true;
                }
                target.css('left', left + 'px');
                target.css('top', top + 'px');
                if (((i % $scope.colCount) == 0) && i > 1) {
                    bSetLeft = false;
                    left = parseInt(container.css('left'));
                    top = top = top - target.innerHeight() + $scope.gap;
                }
            }
        };
        /**
         * Reset the screen
         */
        $scope.reset = function () {
            for (key in $scope.dict_drop_item) {
                if (key.indexOf("name") == -1) {
                    var objTargetList = $scope.dict_drop_item[key];
                    var len = objTargetList.length;
                    for (var i = 0; i < len; i++) {
                        var objItem = objTargetList[0];
                        $scope.setToOriginalPosition(objItem);
                        $scope.updateMapping(objItem);
                    }
                }
            }
            $scope.rowCount = 0;
            //$scope.dict_drop_item = {};
            $scope.dict_drag_item = {};
        };
    };
    angular.module("VLApp").controller("dndcompCtrl", ["$scope", "appService", DndController]);
})();