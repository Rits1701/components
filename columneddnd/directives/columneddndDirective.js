VLApp.directive('columneddndDirective', function () {

    return {

        retrict: "E",

        replace: true,

        scope: true,

        controller: "columneddndCtrl",

        templateUrl: "templates/columneddndTemplate.html",

        link: function (scope, el, attrs) {
            //console.log(attrs.id);
            scope.fetchComponentData(attr.dndData, attr.dragItemsAndCols);            
        }

    };

});