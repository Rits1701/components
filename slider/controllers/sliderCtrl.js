VLApp.controller('sliderCtrl', ['$scope', '$rootScope', 'APPCONSTANT', function ($scope, $rootScope, APPCONSTANT) {
    //$scope.data =
    $scope.state = {};
    
    $scope.fetchComponentData = function (strCompId) {
        $scope.state = $scope.appData.data[strCompId];
    }

    $scope.setTincanData = function () {

    };

    $scope.getTincanData = function () {

    };

    $scope.reset = function () {

    };

    $scope.destroy = function () {

    };
}]);