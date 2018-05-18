VLApp.directive('popupDirective', [function () {

    return {

        retrict: "E",

        replace: true,

        scope: {
            "contentid": "=",
            "dynamicpopuptext": "="            
        },

        controller: "popupCtrl",

        templateUrl: "templates/popupTemplate.html",

        link: function (scope, el, attrs) {            
            if(attrs.id) {
                scope.compId = attrs.id;
                scope.fetchComponentData(attrs.id);
            }
        }

    };

}]);