/*
templateUrl : is used to define which html is loaded on view.
controller  : is used to define which controller is used for template view and functionalty part is written in controller
audioplayerDirective    : is used on view where we want to use our component.
*/
VLApp.directive('drawingpadDirectives', ['$window', function ($window) {
    var drawingpaddir = {};
    drawingpaddir.restrict = 'E';
    drawingpaddir.replace = true;
    drawingpaddir.controller = "drawingpadCtrl";
    drawingpaddir.templateUrl = "templates/drawingpadTemplate.html";
    drawingpaddir.link = function(scope, elem, attr) {			
		if(attr.id) {
			scope.fetchComponentData(attr.id);
		} else {
            scope.compData = null;
            scope.canvasFromComp = false;
            scope.activateCanvas = false;
        }
	}
    return drawingpaddir;
}]);