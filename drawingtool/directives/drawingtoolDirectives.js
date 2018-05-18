/*
templateUrl : is used to define which html is loaded on view.
controller  : is used to define which controller is used for template view and functionalty part is written in controller
audioplayerDirective    : is used on view where we want to use our component.
*/
VLApp.directive('drawingtoolDirectives', ['$window', function($window) {
    var drawingtooldir = {};
    drawingtooldir.restrict = 'E';
    drawingtooldir.replace = true;    
    drawingtooldir.templateUrl = "templates/drawingtoolTemplate.html";
    drawingtooldir.controller = "drawingtoolCtrl"; 
    drawingtooldir.link = function(scope, elem, attr) {			
		if(attr.id) {
			scope.fetchComponentData(attr.id);
		}
	}
    return drawingtooldir;    
}]);