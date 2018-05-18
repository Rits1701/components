VLApp.directive('dndcompDirective', [function () {
    return {
        retrict: "A",        
        controller: "dndcompCtrl",
        link: function (scope, elem, attr) {
            scope.fetchComponentData(attr.id);
            scope.initDnD(attr.id);
        }
    };
}]);

VLApp.directive('draggableDirective', [function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            elem.ready(function() {
                scope.registerDragItems(elem, attr);
                elem.draggable(scope.state.dragOptions); 
                var helperStr = "original";
                if(scope.state.dragOptions && scope.state.dragOptions.helper) {
                    helperStr = scope.state.dragOptions.helper;
                } else if(scope.state.customDragOptions && scope.state.customDragOptions.helper) {
                    helperStr = scope.state.customDragOptions.helper;
                } else if(scope.state.customDragOptions && scope.state.customDragOptions.containment) {
                    helperStr = function() {
                        return $(this).clone().appendTo(scope.state.customDragOptions.containment).css("zIndex", 2).show();
                    }
                } else {
                    helperStr = "original";
                }
                elem.draggable("option", {
                    helper: helperStr,
                    start: function (event, ui) {
                        scope.onItemDragStart(event, ui, scope.state.customDragOptions);
                    },
                    drag : function(event,ui)  {
                        scope.onItemDrag(event, ui, scope.state.customDragOptions);
                    },
                    stop: function (event, ui) {
                        scope.onItemDragStop(event, ui, scope.state.customDragOptions);
                    }
                });                
            });
        }
    };
}]);

VLApp.directive('droppableDirective', [function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            elem.ready(function() {
                scope.registerDropTargets(elem, attr);
                elem.droppable(scope.state.dropOptions);
                elem.droppable( "option", {                    
                    drop: function (event, ui) {                        
                        scope.onItemDrop(event, ui, scope.state.customDropOptions);
                    },
                    out: function (event, ui) {
                        scope.onItemDragOut(event, ui, scope.state.customDropOptions);
                    },
                    over: function(event,ui){
                        scope.onItemDragOver(event, ui, scope.state.customDropOptions);
                    }
                });
            })
        }
    };
}]);
