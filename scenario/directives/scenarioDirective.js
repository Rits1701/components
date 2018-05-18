VLApp.directive('scenarioDirective', ["$sce", function ($sce) {

    return {

        retrict: "EA",

        replace: true,

        /*scope: true,*/

        controller: "scenarioCtrl",

        templateUrl: "templates/scenarioTemplate.html",

        link: function (scope, el, attr) {
            if(attr.data) {
                var data = JSON.parse(attr.data);
                scope.tabindex = data.tabindex;
                scope.audio = data.audioSource;
                scope.img = data.imgSource;
                scope.textinfoone = $sce.trustAsHtml(data.paraOne);
                scope.textinfotwo = $sce.trustAsHtml(data.paraTwo);
                if(undefined==data.htmlText) {
                    scope.htmlText = '';
                } else {
                    scope.htmlText = $sce.trustAsHtml(data.htmlText);
                }
                
            } 
            if(attr.id) {                
                scope.fetchComponentData(attr.id);    
            }            
            angular.element(".scenerio-imageContainer").css('background-image', 'url(' + scope.img + ')');
        }

    };

}]);