VLApp.controller('motionfilterCtrl', ['$scope', 'appService', function ($scope, appService) {
    $scope.state = {}
    
    $scope.fetchComponentData = function(strCompId)
    {
    	//$scope.$apply(function(){
    		$scope.state = $scope.appData.data[strCompId];
    	//})
    	
    }
}]);