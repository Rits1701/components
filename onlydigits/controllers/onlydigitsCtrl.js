VLApp.controller('onlydigitsCtrl', function ($scope, $rootScope) {
    //$scope.data = 
    $scope.state = {};
    
    $scope.fetchComponentData = function (strCompId) {
        $scope.state = $scope.appData.data[strCompId];
    }
    
    $scope.$on('LAB_DATA_LOADED', function () {

    });
    
});