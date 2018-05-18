VLApp.directive('motionfilterDirective', [function() {    
    var vldir = {};
    vldir.restrict = 'E';
    vldir.replace = true;
    vldir.templateUrl = "templates/motionfilterTemplate.html",
    vldir.link= function($scope, element, attrs) {		
		if(attrs.id) {
			$scope.fetchComponentData(attrs.id);
		}              
	}

    return vldir;
    
}]);