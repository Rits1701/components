VLApp.directive('concludeDirective', function () {

    return {

        retrict: "EA",

        replace: true,

        scope : {
           contentid: '=' 
        },

        transclude:true,

        controller: "concludeCtrl",

        templateUrl: "templates/concludeTemplate.html",

        link: function (scope, el, attr) {
            //console.log(attrs.id);
           // scope.fetchComponentData(attr.id);
            if(attr.id){
                scope.compId = (attr.id).toString().trim();
                scope.fetchComponentData(scope.compId);                
            }
        }

    };

});