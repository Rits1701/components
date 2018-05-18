VLApp.directive('tableDirective', [function(){
    var tableDir = {};
    tableDir.restrict = 'E';
    tableDir.replace = true;
    tableDir.templateUrl = "templates/table.html",
    tableDir.controller = "tableCtrl",
    tableDir.scope = {
        
    },
    tableDir.link = function(scope, elm, attr){        
        if(attr.id) {
            scope.fetchComponentData(attr.id);
        } else {
            scope.tableData = JSON.parse(attr.data);
        }
    }
    return tableDir;
}])