VLApp.directive('alertDirective', [function () {

    return {

        retrict: "E",

        replace: true,

        scope: {
            options: '='
        },

        controller: "alertCtrl",

        templateUrl: "templates/alertTemplate.html",

        link: function (scope, el, attrs) {
            //console.log(scope.msg);
            scope.init();
            if(attrs.id) {
                scope.fetchComponentData(attrs.id);
            }
           // sliderComp.addEventListener("input", sliderValueChanging, false);
          

        }


    };

}]);