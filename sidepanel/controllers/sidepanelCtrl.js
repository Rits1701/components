VLApp.controller('sidepanelCtrl', ['$scope', '$rootScope', '$timeout', 'APPCONSTANT', 'appService', function($scope, $rootScope, $timeout, APPCONSTANT, appService) {
    //$scope.data = 
    $scope.state = {};
    $scope.bLeft = false;
    $scope.bRight = false;
    var appcontainer_height, srcWidth, srcHeight, parent_panel, current_view_data, panel_data_holder;
    const BASE_HEIGHT = 752;
    const FADE_DURATION = 300;
    angular.element(document).ready(function() {

        $scope.$on("change_sidepanel_size", function() {

            $scope.calculatePopupHeight();
        });
    });

    $scope.$on(APPCONSTANT.LAB_DATA_LOADED, function() {
        $scope.refreshPanelContent();
    });

    ActionManager.registerActionHandler(APPCONSTANT.TAKE_SNAPSHOT_BEFORE, function(data) {
        angular.element('.sidePanel .content-container').css('overflow-y', 'hidden');
    })

    ActionManager.registerActionHandler(APPCONSTANT.TAKE_SNAPSHOT_AFTER, function(data) {
        angular.element('.sidePanel .content-container').css('overflow-y', 'auto');
    })

    $scope.$on('updateSidePanelContent', function() {
        if ($scope.compId) {
            setTimeout(function() {
                $scope.fetchComponentData($scope.compId);
                $scope.refreshPanelContent();
                $scope.calculatePopupHeight();
            }, 100);
        }
    });

    $scope.fetchComponentData = function(strCompId) {
        if ($scope.$parent.appData.data[strCompId]) {
            $scope.panelData = $scope.$parent.appData.data[strCompId]["sidepanel"][$scope.contentid];
            console.log($scope.panelData);
        }
    }

    $scope.refreshPanelContent = function() {
        parent_panel = '#' + $scope.panelData.panel_id;
        if ($scope.panelData.sub_view == undefined) {
            $scope.panelData.sub_view = 0;
        }
        current_view_data = $scope.panelData.info[$scope.panelData.sub_view];
        $scope.onCheckActiveData();
    };


    $scope.closeSidePanel = function() {
        $scope.$emit("side_panel_hide", $scope.panelData.panel_id);
    }

    $scope.calculatePopupHeight = function() {
        var stingrayContainerHeight, availableHeight, availableWidth, ratio;



        $timeout(function() {

            if (appService.getOrientation() != 'portrait') {

                if ($scope.panelData.info.length == 1) {
                    panel_data_holder = 10;
                } else {
                    panel_data_holder = 60;
                }

                angular.element(parent_panel + ' .panel-data-holder .content-container').css({
                    'top': '',
                    'height': ''
                });


                if (current_view_data.imgSource == undefined) {

                    angular.element(parent_panel + ' .panel-data-holder').css({
                        'height': 'calc(100% - ' + panel_data_holder + 'px)',
                        'top': ''
                    });

                    if (current_view_data.audioSource == undefined) {
                        angular.element(parent_panel + ' .panel-data-holder').css({
                            'top': '0px',
                            'height': 'calc(100% - ' + panel_data_holder + 'px)',
                        });

                        angular.element(parent_panel + ' .panel-data-holder .content-container').css({
                            'top': '0px',
                            'height': '100%'
                        });
                    }

                    return;
                }

                appcontainer_height = angular.element(".appContainer").height();

                availableHeight = angular.element(parent_panel).height() * 50 / 100;
                availableWidth = angular.element(parent_panel).width();

                if (appcontainer_height < BASE_HEIGHT) {
                    if (current_view_data.natuaral_size != undefined) {
                        srcWidth = parseInt(current_view_data.natuaral_size.width);
                        srcHeight = parseInt(current_view_data.natuaral_size.height);
                    }
                    ratio = Math.min(availableWidth / srcWidth, availableHeight / srcHeight);
                    var padding_val = 2*parseInt(angular.element(parent_panel + ' .image-holder').parent().css('padding-left'))
                    angular.element(parent_panel + ' .image-holder').css({
                        'width': (srcWidth * ratio - padding_val) + "px",
                        'height': (srcHeight * ratio - padding_val) + "px"
                    });
                    stingrayContainerHeight = angular.element(parent_panel + " .image-holder").outerHeight();

                    if (current_view_data.audioSource == undefined) {
                        angular.element(parent_panel + ' .panel-data-holder').css({
                            'top': '0px',
                            'height': 'calc(100% - ' + panel_data_holder + 'px)',
                        });

                        angular.element(parent_panel + ' .panel-data-holder .content-container').css({
                            'top': '0px',
                            'height': '100%'
                        });
                    } else {

                        panel_data_holder += stingrayContainerHeight;

                        angular.element(parent_panel + ' .panel-data-holder').css({
                            'height': 'calc(100% - ' + panel_data_holder + 'px)',
                            'top': ''
                        });
                    }


                } else {
                    //  stingrayContainerHeight = angular.element(parent_panel + " .image-holder").outerHeight();

                    // stingrayContainerHeight = angular.element(parent_panel + " .image-holder").outerHeight();
                    var keepgoing = true;
                    if (angular.element(parent_panel + " .image-holder").length > 1) {
                        angular.forEach(angular.element(parent_panel + " .image-holder"), function(value, key) {
                            if (keepgoing) {
                                stingrayContainerHeight = angular.element(value).outerHeight()
                                if (stingrayContainerHeight != 0) {
                                    keepgoing = false
                                }
                            }
                        })

                    } else {
                        stingrayContainerHeight = angular.element(parent_panel + " .image-holder").outerHeight();
                    }

                    angular.element(parent_panel + ' .image-holder').css({
                        'width': "",
                        'height': ""
                    });

                    if (current_view_data.audioSource == undefined) {
                        angular.element(parent_panel + ' .panel-data-holder').css({
                            'top': '0px',
                            'height': 'calc(100% - ' + panel_data_holder + 'px)',
                        });

                        angular.element(parent_panel + ' .panel-data-holder .content-container').css({
                            'top': '0px',
                            'height': '100%'
                        });
                    } else {
                        panel_data_holder += stingrayContainerHeight;
                        angular.element(parent_panel + ' .panel-data-holder').css({
                            'height': 'calc(100% - ' + panel_data_holder + 'px)',
                            'top': ''
                        });
                    }

                }
            } else {

                if (current_view_data.imgSource == undefined) {
                    angular.element(parent_panel + ' .panel-data-holder').css({
                        'width': '100%'
                    });
                }else{
                     angular.element(parent_panel + ' .panel-data-holder').css({
                        'width': ''
                    });
                }

                if ($scope.panelData.info.length > 1) {
                    angular.element(parent_panel + ' .panel-data-holder').css({
                        'top': '0px',
                        'height': '',
                    });

                } else {
                    if (current_view_data.audioSource == undefined) {
                        angular.element(parent_panel + ' .panel-data-holder').css({
                            'top': '0px',
                            'height': 'calc(100% - ' + panel_data_holder + 'px)',
                        });

                        angular.element(parent_panel + ' .panel-data-holder .content-container').css({
                            'top': '0px',
                            'height': '100%'
                        });
                    } else {

                        angular.element(parent_panel + ' .panel-data-holder').css({
                            'height': '',
                            'top': ''
                        });
                    }
                }


                angular.element(parent_panel + ' .image-holder').css({
                    'width': "",
                    'height': ""
                });

                angular.element(parent_panel + ' .side-carousel-control-container').css({
                    'width': angular.element(parent_panel + ' .panel-data-holder').width()
                });
            }


        }, 250)

    }

    $scope.onChangeActiveData = function(evt, ind) {
        angular.element(parent_panel + " .panel-item").removeClass("active");

        angular.element("#" + $scope.panelData.panel_id + "_subview_" + $scope.panelData.sub_view).fadeOut(FADE_DURATION, function() {
            $scope.panelData.sub_view = ind;
            angular.element("#" + $scope.panelData.panel_id + "_subview_" + $scope.panelData.sub_view).fadeIn(FADE_DURATION);
            angular.element(evt.currentTarget).addClass("active");
            $scope.refreshPanelContent()
            $scope.onCheckActiveData();
        });


    }

    $scope.showBassFish = function() {
        var activeElement = angular.element(parent_panel + ' .panel-item.active')
        var ind = activeElement.index();
        if (activeElement.prev().length) {
            angular.element("#" + $scope.panelData.panel_id + "_subview_" + $scope.panelData.sub_view).fadeOut(FADE_DURATION, function() {
                $scope.panelData.sub_view = ind - 1;
                angular.element("#" + $scope.panelData.panel_id + "_subview_" + $scope.panelData.sub_view).fadeIn(FADE_DURATION);
                $scope.refreshPanelContent()
                $scope.onCheckActiveData();
            });
        }
    }

    $scope.showShadFish = function() {
        var activeElement = angular.element(parent_panel + ' .panel-item.active')
        var ind = activeElement.index();
        if (activeElement.next().length) {
            angular.element("#" + $scope.panelData.panel_id + "_subview_" + $scope.panelData.sub_view).fadeOut(FADE_DURATION, function() {
                $scope.panelData.sub_view = ind + 1;
                angular.element("#" + $scope.panelData.panel_id + "_subview_" + $scope.panelData.sub_view).fadeIn(FADE_DURATION);
                $scope.refreshPanelContent()
                $scope.onCheckActiveData();
            });
        }
    }
    $scope.onCheckActiveData = function() {
        // $scope.refreshPanelContent();
        $scope.$emit("change_sub_view",  $scope.panelData.sub_view);
        var leftArrow = angular.element(parent_panel + " .left-arrow");
        var rightArrow = angular.element(parent_panel + " .right-arrow");
         ActionManager.dispatchAction("STOP_ALL_AUDIO_DIS");
        switch ($scope.panelData.sub_view) {
            case 0:
                leftArrow.addClass('elem-hidden');
                rightArrow.removeClass('elem-hidden');
                break;
            case $scope.panelData.info.length - 1:
                leftArrow.removeClass('elem-hidden');
                rightArrow.addClass('elem-hidden');
                break;
            default:
                leftArrow.removeClass('elem-hidden');
                rightArrow.removeClass('elem-hidden');
                break;
        }



        $scope.safeApply(function() {
            $scope.$broadcast("change_sidepanel_size");
            console.log("Side Panel Update");
        });

    }

    $scope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };
}]);
