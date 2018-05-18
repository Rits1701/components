VLApp.directive('sidepanelDirective', [function () {

    return {

        retrict: "EA",

        replace: true,

        scope : {
           contentid: '=' 
        },
        transclude:true,
        controller: "sidepanelCtrl",

        templateUrl: "templates/sidepanelTemplate.html",

        link: function (scope, el, attr) {
            console.log("attr",attr.id)
            if(attr.id){
                scope.compId = (attr.id).toString().trim();
                scope.fetchComponentData(scope.compId);                
            } else{
                var data = JSON.parse(attr.data);
                scope.panelData = JSON.parse(attr.data);
                scope.compId = undefined;                
                angular.element(el).attr("id", scope.panelData.panel_id);
            }

            /*if(scope.panelData.sub_view == undefined){
                scope.panelData.sub_view = 0;
            }*/
            //angular.element(".content-container").html(scope.panelData.txt);
                   
        }

    };

}]);