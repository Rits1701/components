VLApp.directive('dragdropDirective', [function(){
    return{
        restrict : 'E',
        controller : 'dragDropCtrl',
        templateUrl : 'templates/dragDrop.html'
    }
}])