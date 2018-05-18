VLApp.controller('motionfilterCtrl', ['$scope', function ($scope) {
    $scope.message = "";
    $scope.ObjectClass = "normal";
    $scope.slider_floor_ceil = {
        value: 10,
        options: {
            floor: 5,
            ceil: 15,
            step: 5,             
            onEnd: function () {
                
                if($scope.slider_floor_ceil.value == 5){
                    $scope.ObjectClass = "slow";
                }else if($scope.slider_floor_ceil.value == 10){
                    $scope.ObjectClass = "normal";
                }else if($scope.slider_floor_ceil.value == 15){
                    $scope.ObjectClass = "fast";
                }
            }
        }
    };

    $scope.fetchComponentData = function(strCompId) {
        if($scope.appData.data[strCompId]) {
            
        }
    }
}]);