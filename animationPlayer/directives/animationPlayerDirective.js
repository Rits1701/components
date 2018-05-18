VLApp.directive('animationplayerDirective', function () {

    return {

        retrict: "E",

        replace: true,

        scope: true,

        controller: "animationPlayerCtrl",

        templateUrl: "templates/animationPlayerTemplate.html",

        link: function (scope, el, attrs) {
            // console.log(attrs.id);
            scope.fetchComponentData(attrs.id);
        }

    };

});