VLApp.controller('globalinstructionCtrl', ['$scope', 'APPCONSTANT', '$timeout', function($scope, APPCONSTANT, $timeout) {
    $scope.instructionsData = $scope.appData.data.instructions;
    $scope.bottomInfo = $scope.instructionsData.bottom_info;
    $scope.startButtonInfo = $scope.instructionsData.launchInfo;
    //$scope.arialabel =  $scope.instructionsData.globalInfoText
    if (navigator.platform.match('Mac') !== null) {
        angular.element("#instructionsIcon-ins").css("padding-top", "3px");
    }
    elementsJSON['elemSeq']['mainparent']['children']['instruction']['children']['instruction_1']['attributes']['aria-label']['en'] = $scope.instructionsData.globalInfoText
    elementsJSON['elemSeq']['mainparent']['children']['instruction']['children']['instruction_2']['attributes']['aria-label']['en'] = $scope.instructionsData.launchInfo

    $scope.fetchComponentData = function(strCompId) {
        if($scope.appData.data[strCompId]) {
            
        }
    }

    $scope.$on("CURRENT_TAB_INDEX", function() {
        if ($scope.tabIndex == 4) {
            $scope.bottomInfo = $scope.instructionsData.bottom_final_info;
        } else {
            $scope.bottomInfo = $scope.instructionsData.bottom_info;
        }
    });

    $scope.onCloseInstruction = function() {
        $scope.bInfoPopup = false;
        $scope.appData.data.tincan.isFirstTime = false;
        if ($scope.instructionsData.instruction_type == 1) {
            $(".informationPopup1").fadeOut(APPCONSTANT.FADE_DURATION, function() {
                $('.instruction-topic2').hide();

                $scope.startButtonInfo = $scope.instructionsData.labInfo;
                elementsJSON['elemSeq']['mainparent']['children']['instruction']['children']['instruction_1']['attributes']['aria-label']['en'] = $scope.instructionsData.globalInfoText1
                elementsJSON['elemSeq']['mainparent']['children']['instruction']['children']['instruction_2']['attributes']['aria-label']['en'] = $scope.instructionsData.labInfo
                    //console.log('closeInstruction')
                AccessibilityManager.panelCloseHandler();
                setTimeout(function() {
                    $("[tabIndex='3']").focus();
                }, 100)
                $('.tab').each(function(index, el) {
                    AccessibilityManager.toggleState($(el).find('a')[0], 0);   
                });
                AccessibilityManager.toggleState($('.tab.selected a')[0], 1);

            });
        }

    };


    $scope.openGlobalInfoPopup = function() {
        //console.log("openGlobalInfoPopup");
        if ($scope.appData.data.tincan.isFirstTime == false) {
            $(".informationPopup1").fadeOut(APPCONSTANT.FADE_DURATION, function() {
                $('.instruction-topic2').hide();
                $scope.startButtonInfo = $scope.instructionsData.labInfo;
                $scope.arialabel = $scope.instructionsData.globalInfoText1
                $timeout(function() {
                    $("[tabIndex='3']").focus();
                }, 1000)
            });
        }
        $timeout(function() {

            $scope.$apply()
        }, 3000)
    };
}]);
