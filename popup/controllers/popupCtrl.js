VLApp.controller('popupCtrl', ['$scope', '$rootScope', '$sce', 'APPCONSTANT', '$timeout', function ($scope, $rootScope, $sce,  APPCONSTANT, $timeout) {
    
    $scope.state = {};
    $scope.popupOn = false;
    $scope.autoClose = 0;

    $rootScope.$on('LAB_DATA_LOADED', function () {

    })

    $scope.fetchComponentData = function (strCompId) {
        $scope.state = $scope.$parent.appData.data[strCompId]["content"][$scope.contentid];
        $scope.hideHeader = $scope.state.hideHeader || false;        
        $scope.type = $scope.state.type; 
        $scope.headerText = $scope.state.headerText || '';       
        $scope.textContent = $sce.trustAsHtml($scope.state.textContent) || '';
        $scope.imageCaption = $scope.state.imageCaption || '';
        if($scope.dynamicpopuptext) {
            //$scope.imageCaption = $scope.dynamicpopuptext;
            $scope.textContent = $scope.dynamicpopuptext;
        }
        $scope.imagePath = $scope.state.imagePath;
        $scope.imageHeight = $scope.state.imageHeight || 100;
        $scope.imageWidth = $scope.state.imageWidth || 150;            
        $scope.audioPath = $scope.state.audioPath || '';
        $scope.hideClose  = $scope.state.hideClose || false;
        $scope.containerDiv = $scope.state.container || '';    
        if($scope.state.autoClose) {
            $scope.autoClose = $scope.state.autoClose * 1000;
        } else {
            $scope.autoClose = 0;
        }
    }

    $scope.closePopup = function (e) {
        $scope.popupOn = false;
        $scope.$emit("popupClosed");
        /*ActionManager.dispatchAction("STOP_ALL_AUDIO_DIS");*/
        // $(".popupParent").modal("hide");
    }

    $scope.$on('closeImagePopup', function(e) {
        $scope.popupOn = false;
         // $(".popupParent").modal("hide");
    })

    $scope.$on("togglepopup", function() {
        $timeout(function() {
            $scope.fetchComponentData($scope.compId);
            $scope.popupOn = !$scope.popupOn;
            if(($scope.popupOn == true) && ($scope.autoClose > 0)) {
                $timeout(function (argument) {
                    $scope.closePopup();
                }, $scope.autoClose);
            }
            if($scope.containerDiv) {
                $(".popupParent").appendTo($scope.containerDiv);
                // $(".popupParent").appendTo($scope.containerDiv).modal("show");
            }            
            
            //appending modal background inside the  div
            // $('.modal-backdrop').appendTo($scope.containerDiv); 
            // $('.modal-backdrop').css("position", "absolute"); 
    
        //remove the padding right and modal-open class from the body tag which bootstrap adds when a modal is shown
       /*
        $('body').removeClass("modal-open")
        $('body').css("padding-right",""); */
        },50)
    });
    
}]);