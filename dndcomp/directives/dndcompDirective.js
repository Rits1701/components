VLApp.directive('dndcompDirective', [function () {
    return {
        retrict: "E"
        , replace: true
        , scope: true
        , controller: "dndcompCtrl"
        , templateUrl: "templates/dndcompTemplate.html"
        , link: {
            post: function (scope, elem, attr) {
                scope.fetchComponentData(attr.id);
                scope.name = 'Paul';
                scope.greeting = 'Hey, I am ';
            }
        }
    };
}]);
VLApp.directive('draggableDirective', [function () {
    return {
        restrict: 'EA'
        , link: function (scope, elem, attr) {
            elem.css('position', 'absolute');
            //registering itself with controller
            scope.registerDragItems(elem, attr);

            elem.draggable(scope.state.dragOptions);
            elem.draggable( "option", {
                start: function (event, ui) {
                    //calling controller Method
                    scope.onItemDragStart(event, ui);
                },
                drag : function(event,ui)  {
                    scope.onItemDrag(event, ui);
                },
                stop: function (event, ui) {
                    //calling controller Method
                    scope.onItemDragStop(event, ui);
                }
            });
        }
    };
}]);
VLApp.directive('droppableDirective', [function () {
    return {
        restrict: 'EA'
        , link: function (scope, elem, attr) {
            elem.css('position', 'absolute');
            elem.droppable(scope.state.dropOptions);
            elem.droppable( "option", {
                accept:scope.state.dropResponses[attr.id]['accept'],
                drop: function (event, ui) {
                    //calling controller onItemDrop Method
                    scope.onItemDrop(event, ui);
                }
                , out: function (event, ui) {
                    scope.onItemDragOut(event, ui);
                },
                over: function(event,ui){
                    scope.onItemDragOver(event, ui);
                }
            });
        }
    };
}]);
