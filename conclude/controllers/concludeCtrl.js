VLApp.controller('concludeCtrl', ['$scope', '$rootScope', '$timeout', 'APPCONSTANT', 'appService', '$sce', '$window', function($scope, $rootScope, $timeout, APPCONSTANT, appService, $sce, $window) {
    //$scope.data = 
    $scope.state = {};
    $scope.active = false;
    $scope.paratext = [];
    $scope.fetchComponentData = function(strCompId) {
        $scope.concludeData = $scope.$parent.appData.data[strCompId]["conclude"][$scope.contentid];
        if ($scope.concludeData.questiontxt) {
            $scope.quesHTML = $sce.trustAsHtml($scope.concludeData.questiontxt);
        }
        if ($scope.concludeData.para) {
            $scope.paratext = [];
            angular.forEach($scope.concludeData.para, function(value, key) {
                $scope.paratext.push($sce.trustAsHtml(value));
            });
        }
        // console.log($scope.concludeData)
    }

    $scope.$on('LAB_DATA_LOADED', function() {
        ActionManager.registerActionHandler(APPCONSTANT.UPDATE_TINCAN_DATA, function() {
            $timeout(function() {
                updatedTincanData();
            }, 300)
        });
    });
    angular.element(document).ready(function() {
        $scope.$on("change_conclude_size", function() {
            $scope.concludeResize();
        });
    });
    $scope.concludeBtnClick = function() {
        angular.element('#' + $scope.concludeData.comp_id + ' .conclude_button_area button.active').removeClass('active')
        angular.element(event.target).addClass('active')
        var clickSate = {
            'id': angular.element(event.target).attr('id')
        }
        var score = angular.element('#' + $scope.concludeData.comp_id + ' .conclude_button_area button.active').length ? 1 : 0;
        var tabIndex = angular.element('.tab.selected a').attr('id');
        TincanManager.updateSectionTincanData($scope.$parent.appData.data.tincan, "section_" + tabIndex, $scope.concludeData.comp_id + '_activebutton', { "name": $scope.concludeData.comp_id + '_activebutton', "data": clickSate.id, "score": score });

        $scope.$emit("conclude_button_click", clickSate);
    }
    $scope.selectRadio = function(event) {
        angular.element('#' + $scope.concludeData.comp_id).find('.radiobutton').removeClass('checked')
        angular.element(event.currentTarget).addClass("checked")
        var radiobuttondata = {
            'value': angular.element(event.currentTarget).text(),
            'id': angular.element(event.currentTarget).attr('id')
        }
        var score = angular.element('#' + $scope.concludeData.comp_id + ' .radio-button-holder .radiobutton.checked').length ? 1 : 0;
        var tabIndex = angular.element('.tab.selected a').attr('id');
        TincanManager.updateSectionTincanData($scope.$parent.appData.data.tincan, "section_" + tabIndex, $scope.concludeData.comp_id + '_radiobutton', { "name": $scope.concludeData.comp_id + '_radiobutton', "data": radiobuttondata.id, "score": score });
    }
    $scope.conclude_textarea_changed = function() {
        var score = $scope.concludeData.editor == "" ? 0 : 1;
        var tabIndex = angular.element('.tab.selected a').attr('id');
        TincanManager.updateSectionTincanData($scope.$parent.appData.data.tincan, "section_" + tabIndex, $scope.concludeData.comp_id + '_textarea', { "name": $scope.concludeData.comp_id + '_textarea', "data": $scope.concludeData.editor, "score": score });
    }

    var updatedTincanData = function() {
        var tabIndex = angular.element('.tab.selected a').attr('id');
        var viewTincanData = $scope.$parent.appData.data.tincan.screens[tabIndex].elements;
        for (elem in viewTincanData) {
            if (viewTincanData[elem].name && viewTincanData[elem].name != "") {
                if (viewTincanData[elem].name == $scope.concludeData.comp_id + '_textarea') {
                    $scope.concludeData.editor = viewTincanData[elem].data
                }
                if (viewTincanData[elem].name == $scope.concludeData.comp_id + '_activebutton') {
                    angular.element('#' + $scope.concludeData.comp_id).find('#' + viewTincanData[elem].data).addClass('active')
                }
                if (viewTincanData[elem].name == $scope.concludeData.comp_id + '_radiobutton') {
                    angular.element('#' + $scope.concludeData.comp_id).find('#' + viewTincanData[elem].data).addClass('checked')
                }

            }
        }
    }

    $scope.concludeResize = function() {
        var stingrayContainerHeight, availableHeight, availableWidth, ratio, scale, contentHeight, contentWidth,
            new_left_content_width, new_right_content_width;
        $timeout(function() {
            if (appService.getOrientation() != 'portrait') {
                if ($scope.concludeData.imgSource !== undefined) {
                    availableWidth = angular.element('#' + $scope.concludeData.comp_id).parent().parent().width();
                    availableHeight = angular.element('#' + $scope.concludeData.comp_id).parent().parent().height();
                    contentHeight = $scope.concludeData.natuaral_size.height
                    contentWidth = $scope.concludeData.natuaral_size.width
                    scale = availableHeight / contentHeight;

                    var h = scale * contentHeight;
                    var w = scale * contentWidth;
                    new_left_content_width = w;
                    new_right_content_width = availableWidth - new_left_content_width;
                    var minRightWidth = 290;
                    if (new_right_content_width < minRightWidth) {
                        scale = (availableWidth - minRightWidth) / contentWidth;
                        h = contentHeight * scale;
                        w = contentWidth * scale;
                        new_right_content_width = minRightWidth
                    }

                    angular.element('#' + $scope.concludeData.comp_id).find('.conclude_scaleContainer').css({
                        'transform': "scale(" + scale + ")",
                        'transform-origin': "left top"
                    });
                    angular.element('#' + $scope.concludeData.comp_id).find('.contentContainer').css({
                        'height': ''
                    })
                    angular.element('#' + $scope.concludeData.comp_id).find('.concludePage-scale-view').css({
                        'height': h + 'px',
                        'width': w + 'px'
                    });
                    angular.element('#' + $scope.concludeData.comp_id).find('.rightSection').css({
                        'width': new_right_content_width + "px",
                        'height': ''
                    });
                }
                $scope.calculateEditorHeight()

            } else {
                angular.element('#' + $scope.concludeData.comp_id).find('.rightSection').css({
                    'width': ""
                });
                angular.element('#' + $scope.concludeData.comp_id).find('.conclude_scaleContainer').css({
                    'transform': "",
                    'transform-origin': ""
                });
                angular.element('#' + $scope.concludeData.comp_id).find('.concludePage-scale-view').css({
                    'width': "",
                    'height': ""
                });
                if ($scope.concludeData.imgSource == undefined) {
                    $scope.calculateEditorHeight()
                } else {
                    angular.element('#' + $scope.concludeData.comp_id + ' .editor-container').css({
                        'height': ''
                    })
                    availableHeight = angular.element('.conclude_page').parent().height();
                    var leftSection_height = angular.element('.leftSection').height()
                    var rightSection_height = availableHeight - leftSection_height - 5;
                    angular.element('#' + $scope.concludeData.comp_id).find('.rightSection').css({
                        'height': rightSection_height + 'px'
                    })
                    if (angular.element('#' + $scope.concludeData.comp_id + ' .audioButtonContainer').length) {
                        angular.element('#' + $scope.concludeData.comp_id).find('.contentContainer').css({
                            'height': (rightSection_height - 50) + 'px'
                        })
                    } else {
                        angular.element('#' + $scope.concludeData.comp_id).find('.contentContainer').css({
                            'height': rightSection_height + 'px'
                        })

                    }
                }
            }
            $timeout(function() {
                updatedTincanData()
            }, 200)
        }, 10)
    }

    $scope.calculateEditorHeight = function() {
        var availableHeight = angular.element('#' + $scope.concludeData.comp_id).parent().parent().height();
        var audioContainerHeight = angular.element('#' + $scope.concludeData.comp_id + ' .audioButtonContainer').length ? angular.element('#' + $scope.concludeData.comp_id + ' .audioButtonContainer').height() : 0;
        var questionAreaHeight = angular.element('#' + $scope.concludeData.comp_id + ' .Questionblock').length ? angular.element('#' + $scope.concludeData.comp_id + ' .Questionblock').height() : 0;
        var buttonAreaHeight = angular.element('#' + $scope.concludeData.comp_id + ' .conclude_button_area').length ? angular.element('#' + $scope.concludeData.comp_id + ' .conclude_button_area').height() : 0;
        var instHeight = angular.element('#' + $scope.concludeData.comp_id + ' .conclude_instruction').length ? angular.element('#' + $scope.concludeData.comp_id + ' .conclude_instruction').height() : 0;
        var radiobuttonHolder = angular.element('#' + $scope.concludeData.comp_id + ' .radio-button-holder').length ? angular.element('#' + $scope.concludeData.comp_id + ' .radio-button-holder').height() : 0;
        // var textareaButtonContainerHeight = angular.element('#' + $scope.concludeData.comp_id +' .textarea-button-container').length ? angular.element('#' + $scope.concludeData.comp_id +' .textarea-button-container').height() :0;
        var editorHeight = availableHeight - audioContainerHeight - questionAreaHeight - buttonAreaHeight - radiobuttonHolder - instHeight - 2 - parseInt(angular.element('#' + $scope.concludeData.comp_id + ' .rightSection').css('padding-top'))
        // console.log(angular.element('#' + $scope.concludeData.comp_id + ' .editor-container').length, editorHeight)
        angular.element('#' + $scope.concludeData.comp_id + ' .editor-container').css({
            'height': editorHeight + 'px'
        })
    }


    $scope.concludePrint = function() {
        var container = angular.element('#' + $scope.concludeData.comp_id)
        container.find(".editor").each(function(index, element) {
            setDataForPrint(element.id)
        })

        var printData = {};
        printData.title = $scope.$parent.appData.title;
        printData.section = $scope.concludeData.sectionnameforprint;
        printData.footer = $scope.$parent.appData.footer;
        var printWindow = appService.isIpadDevice() ? $window.open('', 'Print-Page', 'height=400,width=800') : null;



        html2canvas(container, {
            onrendered: function(canvas) {
                var screenShot = canvas.toDataURL("image/png");
                container.find(".editor").each(function(index, element) {
                    removeDataForPrint(element.id)
                })
                angular.element('#' + $scope.concludeData.comp_id + ' .print_container').html('<img src="' + screenShot + '" class="print-image" alt="" width="720">');
                appService.printContainer('#' + $scope.concludeData.comp_id + ' .print_container', printWindow, printData);
            }
        })
    }
    setDataForPrint = function(id) {
        var normal_height = angular.element('#' + id).find('div:first').height()
        var editor_height = angular.element('#' + id).height() - 20
        $('#' + id).children('div').each(function(index) {
            normal_height += $(this).height();
            if (normal_height > editor_height) {
                // $(this).hide()
                $(this).nextAll('div').hide()
                return false;
            }
        })
    }
    removeDataForPrint = function(id) {
        $('#' + id).children('div').show()
    }

    ActionManager.registerActionHandler(APPCONSTANT.TAKE_SNAPSHOT_BEFORE, function(data) {
        var container = angular.element('#' + $scope.concludeData.comp_id)
        container.find(".editor").each(function(index, element) {
            if (!element.id) {} else {
                setDataForPrint(element.id);
            }
        })
        angular.element('#' + $scope.concludeData.comp_id).find('.leftSection').css({
            "background-image": "url(" + $scope.concludeData.imgSource + ")",
            "background-repeat": "no-repeat",
            "background-size": "cover"
        });
        angular.element('#' + $scope.concludeData.comp_id).find('.conclude_scaleContainer  img').css('display', 'none');

    });
    ActionManager.registerActionHandler(APPCONSTANT.TAKE_SNAPSHOT_AFTER, function(data) {
        var container = angular.element('#' + $scope.concludeData.comp_id)
        container.find(".editor").each(function(index, element) {
            if (element.id) {
                removeDataForPrint(element.id);
            }
        })
        angular.element('#' + $scope.concludeData.comp_id).find('.leftSection').css({
            "background-image": "none",
        });
        angular.element('#' + $scope.concludeData.comp_id).find('.conclude_scaleContainer  img').css('display', 'block');
    });

}]);