VLApp.directive('globalinstructionDirective', ['$timeout', function($timeout) {
	return {
		retrict: "E",
		replace: true,
		link: function($scope, element, attrs) {
			$timeout(function() {
				 AccessibilityManager.registerActionHandler('closeinfo',$scope,'',$scope.onCloseInstruction);
			}, 1000);
			if(attrs.id) {
				scope.fetchComponentData(attrs.id);
			}              
		},
		templateUrl: "templates/globalinstructionTemplate.html"
	};
}]);
