VLApp.directive('videocompDirective', [function () {

    return {

        retrict: "E",

        replace: true,

        scope: {
            source : "@"
        },

        controller: "videocompCtrl",

        templateUrl: "templates/videocompTemplate.html",

        link: function (scope, el, attrs) {
            if(attrs.customcontrol) {
                scope.showCustomControl(attrs.customcontrol);
            }
            
            if(attrs.id) {
                scope.fetchComponentData(attrs.id);
            }
            scope.element = el.children();
            scope.$watch('source',function(){
                scope.videoControl = angular.element(scope.element.children()[0])[0];
                scope.init();
            });
        }

    };

}]);