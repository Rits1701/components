VLApp.controller("tableCtrl", ['$scope', function($scope){
    $scope.tableData;
    $scope.seach ="Rajib";

    $scope.fetchComponentData = function (strCompId) {
         if($scope.$parent.appData.data[strCompId]) { 
            $scope.tableData = $scope.$parent.appData.data[strCompId];            
         }         
    }

    /**
    *This method is used to validate  the user input data.
    *@param:
    *@return: boolean
    **/
    $scope.dataValidation = function(event, row){
        var strData = event.target.innerText;
        var isValid = false;
        var bKeyEnable = false;
        var keyCode = (event.charCode != 0) ? event.charCode : event.keyCode ;


        switch(row.datatype){
            case "numeric": isValid = (keyCode < 48 || keyCode > 57) ? true : false; break;
            case "alpha":
                isValid = ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122)) ? false : true;
                break;
            case "alphanumeric":
                isValid = ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (keyCode >= 48 && keyCode <= 57)) ? false : true;
                break;
        }
        
        if(keyCode == 8 || keyCode == 127){
            isValid = false;
            bKeyEnable = true;
        }

        if((strData.trim().length >= row.maxlength)){
            if(!bKeyEnable){
                event.preventDefault();
            }
            return false;
        }else if(isValid){
            event.preventDefault();
            return false;
        }else{
            return true;
        }
        //return (event.target.innerText.length >= row.maxlength ? false : true );
    };
    
    $scope.updateTableData = function() {
        //console.log('changed', $scope.tableData);
        $scope.$emit("table_data_updated_"+$scope.tableData.data.tableId, $scope.tableData);
      }

}]);
