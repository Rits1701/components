VLApp.directive('tabDirective', function () {

    return {

        retrict: "E",

        replace: true,

        scope: true,

        controller: "tabCtrl",

        templateUrl: "templates/tabTemplate.html",

        link: function (scope, el, attrs) {
            if(undefined != attrs.id) {
                scope.fetchComponentData(attrs.id);
            } else {
                scope.fetchComponentDataFrmData(attrs.data);
            }            

            scope.emitTabClickedId = function(tab) {
                scope.$emit("tabClicked", tab);
            };
        }

    };

});