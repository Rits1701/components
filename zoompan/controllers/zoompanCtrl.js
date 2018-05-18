VLApp.controller('zoompanCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    
    $scope.fetchComponentData = function (strCompId) {
         if($scope.$parent.appData.data[strCompId]) { 
            
         }         
    }

    // $scope.imageData = {
    //     "img" : [
    //         {
    //             "imgSource": "midnaight zone_with spotlight.png",
    //             "imgHeight" : "400",
    //             "imgWidth" : "400"
    //         },
    //         {
    //             "imgSource": "ELS19_VL07_R2101226.png",
    //             "imgHeight" : "400",
    //             "imgWidth" : "400"
    //         }
    //     ],        
    //     "imgParentDivId" : "imageGalleryPanel",
    //     "imgDivId" : "imageGalleryExpanded"
    // }
    
}]);