VLApp.directive('sliderDirective', ['APPCONSTANT',function (APPCONSTANT) {

    return {

        retrict: "E",

        replace: true,

        scope: true,

        controller: "sliderCtrl",

        templateUrl: "templates/sliderTemplate.html",

        link: function (scope, elem, attrs) {
            //console.log(" elem ", elem.children().children()[0]);
            var sliderComp = elem.children()[0];
            //console.log("slider comp ", sliderComp);
            scope.fetchComponentData(attrs.id);
            //console.log("directive id ", attrs.id);

            var sliderValueChanged = function (e) {
                //console.log(" valueChange called... ", e.target.value);
                scope.$emit("slider_value_changed", {
                    "id": attrs.id,
                    "data": sliderComp.value
                });
            };

            var sliderValueChanging = function (e) {
                //console.log(" valueChanging... ", e.target.value);
                scope.$emit("slider_progress", {
                    "id": attrs.id,
                    "data": sliderComp.value
                });
            };

            sliderComp.addEventListener("change", sliderValueChanged, false);
            sliderComp.addEventListener("input", sliderValueChanging, false);
            ActionManager.registerActionHandler(APPCONSTANT.UPDATE_SLIDER_VALUE, function(data){
                if(attrs.id == data.id){
                    sliderComp.value = data.value;
                }
            });

            ActionManager.registerActionHandler(APPCONSTANT.UPDATE_SLIDER_ARIA_LABEL, function(data){
                if(attrs.id == data.id){
                    console.log(" data.value ", data.value)
                    sliderComp.setAttribute("aria-label", data.value);
                    sliderComp.setAttribute("originallabel",data.value);
                }
            });
        }
    };

}]);