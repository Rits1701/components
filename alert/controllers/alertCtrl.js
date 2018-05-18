VLApp.controller('alertCtrl', ['$scope', '$rootScope', 'APPCONSTANT', '$timeout', function($scope, $rootScope, APPCONSTANT, $timeout) {
    //$scope.data =
    $rootScope.$on('LAB_DATA_LOADED', function() {

    });

    $scope.options.autoclose = false;

    $scope.fetchComponentData = function(strCompId) {
        if($scope.$parent.appData.data[strCompId]) {
            
        }
    }

    $scope.init = function() {
        //var cancel = angular.element(document.querySelector( '.buttonHolder .cancel' ))[0];
        //var ok = angular.element(document.querySelector( '.buttonHolder .prime-button' ))[0];
        var popupOverlay = angular.element(document.querySelector('.popupOverlay'))[0];

        $scope.$watch("options.autoclose", function() {
            // alert($scope.autoclose)
            if ($scope.options.autoclose) {
                $(popupOverlay).css("z-index", 999);
                var timer = $timeout(function() {
                    $scope.$emit(APPCONSTANT.AUTO_CLOSED_ALERT);
                    $timeout.cancel(timer);
                    $(popupOverlay).css("z-index", "");
                    AccessibilityManager.panelCloseHandler();
                    $('.tab').each(function(index, el) {
                        AccessibilityManager.toggleState($(el).find('a')[0], 0);
                    });
                    AccessibilityManager.toggleState($('.tab.selected a')[0], 1);
                    $timeout(function() {
                        $scope.options.autoclose = false;
                        $scope.$apply()
                    }, 200);
                }, 2000);
            }
        });

        /*$scope.$watchCollection("options", function(){
            if(!$scope.options.autoclose){
                $(popupOverlay).on("click", function(){
                   $(popupOverlay).off("click");
                   $scope.onHideAlert('no');
               })
            }
        });*/


    }

    $scope.onHideAlert = function(status) {
        $scope.options.autoclose = false;
        var sendingObj = {};
        sendingObj.state = status;
        sendingObj.alertplace = $scope.options.alertplace;
        sendingObj.isSubmitClick = $scope.options.isSubmitClick;

        console.log("$scope.options: ", $scope.options);

        $scope.$emit(APPCONSTANT.HIDE_ALERT, sendingObj);
        AccessibilityManager.panelCloseHandler();
        $('.tab').each(function(index, el) {
            AccessibilityManager.toggleState($(el).find('a')[0], 0);
        });
        AccessibilityManager.toggleState($('.tab.selected a')[0], 1);
        if (sendingObj.isSubmitClick === true) {
            AccessibilityManager.toggleState($('.next-button'), 1);
        }

        // $scope.options ={};

    }

}]);
