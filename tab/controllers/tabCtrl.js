VLApp.controller('tabCtrl', function ($scope, $rootScope, APPCONSTANT, $sce) {
    //$scope.data = 
    $scope.state = {};
    $scope.tabComponentData = [];
    $scope.container = ".left-side";
    $scope.TabWidth = 0;
    
    $scope.fetchComponentData = function (strCompId) {
        $scope.state = $scope.appData.data[strCompId];
        for(tDataInd in $scope.state.tabdata) {      
            $scope.state.tabdata[tDataInd].tabName = $sce.trustAsHtml($scope.state.tabdata[tDataInd].tabName);
        }
        $scope.tabComponentData = $scope.state.tabdata;
        $scope.container = $scope.state.container;
        $scope.calculateTabsWidth();
    }


    $scope.fetchComponentDataFrmData = function (data) {
        $scope.state = JSON.parse(data);
        for(tDataInd in $scope.state.tabdata) {          
            $scope.state.tabdata[tDataInd].tabName = $sce.trustAsHtml($scope.state.tabdata[tDataInd].tabName);
        }
        $scope.tabComponentData = $scope.state.tabdata;
        $scope.container = $scope.state.container;
        $scope.calculateTabsWidth();
    }
    
    $scope.calculateTabsWidth = function() {
    	var numberOfTabs = $scope.tabComponentData.length;
        var distenceBetTabs = 2; /* in pxels */
        var containerWidth = angular.element($scope.container).width(); 
        var effectiveAvailableWidth = parseInt(containerWidth) - distenceBetTabs*numberOfTabs;
        $scope.TabWidth = effectiveAvailableWidth/numberOfTabs;
        angular.element(".tab-li").css("width", $scope.TabWidth);
    }

    $scope.$on(APPCONSTANT.LAB_VIEW_LOADED, function(){
    	$scope.calculateTabsWidth();
    });

    $scope.$on('LAB_DATA_LOADED', function () {

    });
    
});