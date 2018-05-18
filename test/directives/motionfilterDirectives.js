VLApp.directive('motionfilterDirective', [function() {    
    var vldir = {};
    vldir.restrict = 'E';
    vldir.replace = true;
    vldir.templateUrl = "templates/motionfilterTemplate.html"


    return {

        retrict : "E",

        replace: true,

        templateUrl: "templates/motionfilterTemplate.html",

        link: function(scope, el, attrs){
            scope.fetchComponentData(attrs.id);
        }

    };
    
}]);