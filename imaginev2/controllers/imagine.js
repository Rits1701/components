VLApp.controller('imagineCtrl', function($scope, $attrs, $timeout, $window, $sce, appService, APPCONSTANT) {
    $scope.dragList = $scope.appData.data.imaginev2Comp.dragItems.drag;
    $scope.InsText1 = $sce.trustAsHtml($scope.appData.data.imaginev2Comp.InstructionText1.textpara);
    $scope.InsText2 = $sce.trustAsHtml($scope.appData.data.imaginev2Comp.InstructionText2.textpara);
    $scope.editor = $scope.appData.data.imaginev2Comp.editor;
    $scope.editortool = $scope.appData.data.imaginev2Comp.editortool;
    $scope.printEditor = $scope.appData.data.imaginev2Comp.printineditor;
    $scope.zIndex = 1;
    $scope.bSticky = false;
    $scope.scale = 1;
    $scope.imagineeditor = ''
    var TOTAL_STICKY_NOTES = 3;
    $scope.stickyCount = 0;
    var depth = 10;
    var MAX_CHAR = 45;
    var IS_IPAD = appService.isIpadDevice();
    $scope.enableReset = false;

    angular.element(document).ready(function() {
        $('.imagine-buttons2').bind('click', function(e) {
            $('.disabled-div').removeClass('disabled-div')
        })
    })

    var setScaling = function() {
        var totalWidth, totalHeight, contentWidth, contentHeight, minRightWidth;
        if ($scope.orientation != 'portrait') {
            totalWidth = angular.element(".imagine-page-container")[0].offsetWidth;
            totalHeight = angular.element(".imagine-page-container")[0].offsetHeight;
            contentWidth = 615;
            contentHeight = 437;
            minRightWidth = 290;

            $scope.scale = (totalHeight - 35) / contentHeight;
            $scope.imageContainerHeight = parseInt(contentHeight * $scope.scale);
            $scope.imageContainerWidth = parseInt(contentWidth * $scope.scale);
            $scope.rightSectionWidth = totalWidth - $scope.imageContainerWidth

            if (parseInt($scope.rightSectionWidth) < minRightWidth) {
                $scope.scale = (totalWidth - minRightWidth) / contentWidth;
                $scope.imageContainerHeight = contentHeight * $scope.scale;
                $scope.imageContainerWidth = contentWidth * $scope.scale;
                $scope.rightSectionWidth = minRightWidth
            }
        } else {
            $scope.scale = 1;
            $scope.imageContainerHeight = "";
            $scope.imageContainerWidth = "";
            $scope.rightSectionWidth = "";
        }

        if ($scope.editor) {
            $timeout(function() {
                setEditorHeight()
            }, 100)
        }

		if ($scope.orientation != 'portrait') {
			$scope.imagine_canvas_width_landscape = $scope.imageContainerWidth;
			$scope.imagine_canvas_height_landscape = (contentHeight - parseInt($attrs.dragAreaHeight)) * $scope.scale
		} else {
			$scope.imagine_canvas_width_portrait = 615;
			$scope.imagine_canvas_height_portrait = 437 - parseInt($attrs.dragAreaHeight);
		}
    }

    var setEditorHeight = function() {
        var totalHeight = angular.element('.imaginePage .imagine-right-div').height()
        var header_height = angular.element('.imaginePage .InstructionNotesHeader').height();
        var text_height = angular.element('.imaginePage .InstructionText').height()
        var remaining_height = totalHeight - header_height - text_height
        angular.element('.imaginePage .editor-container').css({ 'height': remaining_height + 'px' })
        if (!$scope.editortool) {
            angular.element('.imaginePage .editor-container').find('.editor').css({ 'height': remaining_height - 10 + 'px' })
        }
    }

    $scope.$on("CURRENT_TAB_INDEX", function(event, data) {
        if (data == 4) {
            // setScaling("current")
            $timeout(function() {
                $scope.labStyle.opacity = 1;
            }, 0);
        }
    });
    $scope.imagine_textarea_changed = function(e, val) {
        var score = (val == "") ? 0 : 1;
        var tabIndex = angular.element('.tab.selected a').attr('id');
        TincanManager.updateSectionTincanData($scope.appData.data.tincan, "section_" + tabIndex, 'imagine_textarea', { "name": 'imagine_textarea', "data": val, "score": score });

    }
    var updatedTincanData = function() {
        var tabIndex = angular.element('.tab.selected a').attr('id');
        var viewTincanData = $scope.appData.data.tincan.screens[tabIndex].elements;
        for (elem in viewTincanData) {
            if (viewTincanData[elem].name && viewTincanData[elem].name != "") {
                if (viewTincanData[elem].name == 'imagine_textarea') {
                    $scope.imagineeditor = viewTincanData[elem].data
                }
            }
        }
    }
    $scope.$on(APPCONSTANT.LAB_VIEW_LOADED, function() {
        ActionManager.registerActionHandler(APPCONSTANT.UPDATE_TINCAN_DATA, function() {
            $timeout(function() {
                updatedTincanData();
            }, 0);

        });
        if ($scope.tabIndex == 4) {
            setScaling()
            $timeout(function() {
                $scope.labStyle.opacity = 1;
            }, 0);

            $.ui.ddmanager.prepareOffsets = function(t, event) {
                var i, j, m = $.ui.ddmanager.droppables[t.options.scope] || [],
                    type = event ? event.type : null,
                    list = (t.currentItem || t.element).find(":data(ui-droppable)").addBack();
                droppablesLoop: for (i = 0; i < m.length; i++) {
                    if (m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0], (t.currentItem || t.element)))) {
                        continue;
                    }
                    for (j = 0; j < list.length; j++) {
                        if (list[j] === m[i].element[0]) {
                            m[i].proportions().height = 0;
                            continue droppablesLoop;
                        }
                    }
                    m[i].visible = m[i].element.css("display") !== "none";
                    if (!m[i].visible) {
                        continue;
                    }
                    if (type === "mousedown") {
                        m[i]._activate.call(m[i], event);
                    }
                    m[i].offset = m[i].element.offset();
                    m[i].proportions({
                        width: m[i].element[0].offsetWidth * $scope.scale,
                        height: m[i].element[0].offsetHeight * $scope.scale
                    });
                }
            };

            $('.imagine-draggable-Item').draggable({
                helper: function() {
                    return $(this).clone().appendTo(".dnd-wrapper").css("zIndex", 2).show();
                },
                revert: 'false',
                cursor: "move",
                start: startFixDndWrapper,
                drag: dragFix,
                stop: function(event, ui) {
                    var $drag = ui.helper;
                }
            });

            $timeout(function() {
                $('.droppable-container').droppable({
                    accept: '.draggable',
                    tolerance: "touch",
                    greedy: true,
                    drop: function(event, ui) {
                        var droppableContainerHeight = $('.droppable-container').height()
                        if ((ui.position.top + $(ui.draggable).height()) < droppableContainerHeight) {
                            var clone = $(ui.draggable).clone();
                            $scope.dropContainerPos = $('.droppable-container').position();
                            clone.css("position", "absolute");
                            clone.css('left', ui.position.left - $scope.dropContainerPos.left);
                            clone.css('top', ui.position.top - $scope.dropContainerPos.top);
                            $(this).prepend(clone);
                            clone.attr('prevLeft', ui.position.left - $scope.dropContainerPos.left)
                            clone.attr('prevTop', ui.position.top - $scope.dropContainerPos.top)
                            $(".droppable-container .draggable").removeClass("imagine-draggable-Item");
                            $(".droppable-container .draggable").addClass("dropped-item");
                            $(".droppable-container .draggable").css("z-index", depth++);
                            $(".dropped-item").removeClass("ui-draggable draggable");
                            $(".dropped-item").draggable({
                                revert: "false",
                                helper: "original",
                                start: startFixImageContainer,
                                drag: dragFix,
                                stop: function(event, ui) {
                                    var $drag = ui.helper;
                                    $scope.$emit("DragStop", { 'ui': ui.position, 'clone': $drag });
                                }
                            });

                            $timeout(function() {
                                $scope.$apply()
                            })

                            TincanManager.updateSectionTincanData($scope.appData.data.tincan, "section_" + $scope.tabIndex, "draggable", {
                                "score": 1,
                                "name": "draggable"
                            });
                            $scope.$emit("Dropped", { 'ui': ui.position, 'clone': clone });
                        }
                    }
                });

                $(".dropped-item").draggable({
                    revert: "false",
                    helper: "original",
                    start: startFixImageContainer,
                    drag: dragFix,
                    stop: function(event, ui) {
                        var $drag = ui.helper;
                    }
                });
            }, 200)
        }
    });

    ActionManager.registerActionHandler(APPCONSTANT.AUDIO_STARTED, function() {
        if ($scope.tabIndex == 4) {
            TincanManager.updateSectionTincanData($scope.appData.data.tincan, "section_" + $scope.tabIndex, "draggable", {
                "score": 1,
                "name": "draggable"
            });
        }
    });

    ActionManager.registerActionHandler(APPCONSTANT.TAKE_SNAPSHOT_BEFORE, function(data) {
        if ($scope.tabIndex == 4) {
            var startScrol = $('.drag-panel').scrollLeft();
            var total_Width = $('.drag-panel').width() + startScrol;
            var startWidth = $('.draggable-content').width();
            $('.draggable-content').each(function(ind) {
                if (startWidth > startScrol && startWidth <= total_Width) {
                    $(this).css('display', 'inline-block');
                } else {
                    $(this).css('display', 'none');
                }
                startWidth += $(this).width();
            });
        }
    })

    ActionManager.registerActionHandler(APPCONSTANT.TAKE_SNAPSHOT_AFTER, function(data) {
        if ($scope.tabIndex == 4) {
            var startScrol = $('.drag-panel').scrollLeft();
            $('.draggable-content').css('display', 'inline-block');
            $('.drag-panel').scrollLeft(startScrol);
        }
    })

    $scope.openNotebookImagine = function() {
        ActionManager.dispatchAction(APPCONSTANT.NOTE_BOOK_OPENED);
    }

    var containmentW,
        containmentH,
        objW,
        objH;

    function dragFix(event, ui) {
        var boundReached = false;
        var changeLeft = ui.position.left - ui.originalPosition.left,
            newLeft = ui.originalPosition.left + changeLeft / $scope.scale,
            changeTop = ui.position.top - ui.originalPosition.top,
            newTop = ui.originalPosition.top + changeTop / $scope.scale;
        ui.position.left = newLeft;
        ui.position.top = newTop;

        if (ui.position.left > containmentW - objW) {
            newLeft = (containmentW - objW)
            boundReached = true;
        }

        // left bound check
        if (newLeft < 0) {
            newLeft = 0;
            boundReached = true;
        }

        // bottom bound check
        if (ui.position.top > containmentH - objH) {
            newTop = (containmentH - objH)
            boundReached = true;
        }

        // top bound check
        if (newTop < 0) {
            newTop = 0;
            boundReached = true;
        }

        // fix position
        ui.position.left = newLeft;
        ui.position.top = newTop;

        // inside bounds
        if (!boundReached) {
            // do stuff when element is dragged inside bounds
        }
    }

    function startFixDndWrapper(event, ui) {
        ui.position.left = 0;
        ui.position.top = 0;
        ui.helper.css("z-index", depth++);

        var imagineDrag = angular.element('.dnd-wrapper');
        imagineDrag.unbind("mousedown mousemove mouseleave");
        $timeout(function() {
            imagineDrag.off("touchstart touchmove touchend");
        }, 10);
        containmentW = $('.dnd-wrapper').width();
        containmentH = $('.dnd-wrapper').height();
        objW = $(this).outerWidth();
        objH = $(this).outerHeight();
    }

    function startFixImageContainer(event, ui) {
        ui.position.left = 0;
        ui.position.top = 0;
        ui.helper.css("z-index", depth++);

        var imagineDrag = angular.element('.imagine_container');
        imagineDrag.unbind("mousedown mousemove mouseleave");
        $timeout(function() {
            imagineDrag.off("touchstart touchmove touchend");
        }, 10);
        containmentW = $('.imagine_container').width();
        containmentH = $('.imagine_container').height();
        objW = $(this).outerWidth();
        objH = $(this).outerHeight();
    }

    function startFixDroppableContainer(event, ui) {
        ui.position.left = 0;
        ui.position.top = 0;
        ui.helper.css("z-index", depth++);

        var imagineDrag = angular.element('.droppable-container');
        imagineDrag.unbind("mousedown mousemove mouseleave");
        $timeout(function() {
            imagineDrag.off("touchstart touchmove touchend");
        }, 10);
        containmentW = $('.droppable-container').width();
        containmentH = $('.droppable-container').height();
        objW = $(this).outerWidth();
        objH = $(this).outerHeight();
    }

    //new code for accesibility drag and drop
    $scope.triggerDropWithKey = function(data) {
        if ($scope.tabIndex == 4) {
            clone = $(data).clone();
            $scope.dropContainerPos = $('.droppable-container').position();
            clone.css("position", "relative");
            $('.droppable-container').append(clone);
            $(".droppable-container .draggable").addClass("dropped-item");
            $(".dropped-item").removeClass("ui-draggable draggable");

            $(".dropped-item").draggable({
                revert: "false",
                helper: "original",
                start: startFixImageContainer,
                drag: dragFix,
                stop: function(event, ui) {
                    var $drag = ui.helper;
                }
            });
            $('.selectedimg').removeClass('selectedimg');
            $timeout(function() {
                $scope.$apply()
            })
        }
    };

    var makeStickyDraggable = function() {
        $('.stickyWrapper').draggable({
            cancel: ".stickNotes",
            start: startFixDroppableContainer,
            drag: dragFix
        });
        $('.stickNotes').on('click', function() {
            $(this).focus()
            $('.stickyWrapper').draggable({'disabled':true})
        })
         $('.stickNotes').on('blur', function() {
            $('.stickyWrapper').draggable({'disabled':false})
        })
       /* $('.stickNotes').on('focus', function() {
        	var range, selection;
        	if (document.createRange) {
        		range = document.createRange();
        		range.selectNodeContents(this);
        		range.collapse(false);
        		selection = window.getSelection();
        		selection.removeAllRanges();
        		selection.addRange(range);
        	} else if (document.selection) {
        		range = document.body.createTextRange();
        		range.moveToElementText(this);
        		range.collapse(false);
        		range.select();
        	}
        })*/

        $('.stickNotes').on('keydown', function(event) {
            if ($(this).text().length === MAX_CHAR && event.keyCode != 8 || event.keyCode == 13) {
                event.preventDefault();
            }
        });

        $(".stickNotes").on("paste", function(e) {
            e.preventDefault();
            return;
        });

        $('.stickNotes').focus(function(event) {
            var input = $(this);
            if (input.text() == input.attr('placeholder')) {
                input.text('');
                input.removeClass('placeholder');
            }
        })

        $('.stickNotes').blur(function() {
            var input = $(this);
            if (input.text() == '' || input.text() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder')).text(input.attr('placeholder'));
            }
        }).blur()
    };

    $scope.resetScreen = function() {
        $scope.$broadcast("STOP_ALL_AUDIO_DIS");
        ActionManager.dispatchAction("STOP_ALL_AUDIO_DIS");
        var draggables = $(".dropped-item");
        $scope.$emit("CLEAR_DRAWING_PAD");
        $scope.bSticky = false;
        $scope.enableDraggables();
        draggables.remove();

        $('.droppable-container').children('*:not(".popupParent")').remove();
        $('.imagine-action-btn .sticky').removeClass("disabled-div");
        $scope.stickyCount = 0;
        depth = 10;
    };

    $scope.disableDraggables = function() {
        var cloneDrags = $(".dropped-item")
        $scope.dragDisableClass = "disableDraggables";
        cloneDrags.addClass("disableDraggables");
        // if (!$scope.$$phase) {
        // 	$scope.$apply();
        // }
    };

    $scope.enableDraggables = function() {
        var cloneDrags = $(".dropped-item")
        $scope.dragDisableClass = "";
        cloneDrags.removeClass("disableDraggables");
        // if (!$scope.$$phase) {
        // 	$scope.$apply();
        // }
    };

    $scope.showStickyNotes = function(evt) {
        if ($scope.stickyCount < TOTAL_STICKY_NOTES) {
            var elm = '<div class="stickyWrapper"><div id=sticky' + $scope.stickyCount + ' class="stickNotes" placeholder="Add notes here...." checkDisable="stickNotes" acstouch="true" contenteditable="true" ng-show="bSticky"></div></div>';
            $('.droppable-container').append(elm);
            angular.element("#sticky" + $scope.stickyCount).parent().css("top", 80 * $scope.stickyCount + 20);
            $(".droppable-container .stickNotes:last-child").css("z-index", depth++);
            makeStickyDraggable();
            $scope.stickyCount++;
            if ($scope.stickyCount == TOTAL_STICKY_NOTES) {
                $(evt.currentTarget).addClass("disabled-div");
            }
        }
    };

    $scope.$watch(function() {
        return angular.element("#imagine_container").children().length
    }, function(newValue, oldValue) {
        if (newValue == 0) {
            $scope.enableReset = false
        } else {
            $scope.enableReset = true
        }
    })

    $scope.printScreen = function(evt) {
        var printData = {};
        printData.title = $scope.appData.title;
        printData.section = $scope.appData.tabs[$scope.tabIndex].title;
        printData.footer = $scope.appData.footer;

        $(".imagine-footer").css("pointer-events", "none");
        var draw_can = ($scope.orientation == "landscape") ? "canvas_landscape_5" : "canvas_portrait_5";
        var printWindow = IS_IPAD ? $window.open('', 'Print-Page', 'height=400,width=800') : null;

        var startScroll = makeScrollVisible();

        html2canvas(document.querySelectorAll('.lab-view'), {
            onrendered: function(canvas) {
                // canvas is the final rendered <canvas> element
                var screenShot = canvas.toDataURL("image/png");
                $('#printHolder').html('<img src="' + screenShot + '" class="print-image" alt="" width="720">');
                appService.printContainer('#printHolder', printWindow, printData);
                resetScrollVisible(startScroll);
                $(".imagine-footer").css("pointer-events", "visible");
            }
        });
    };

    var makeScrollVisible = function() {
        var startScrol = $('.drag-panel').scrollLeft();
        var total_Width = $('.drag-panel').width() + startScrol;
        var startWidth = $('.draggable-content').width();
        // $('.draggable-content').css()
        $('.draggable-content').each(function(ind) {
            if (startWidth > startScrol && startWidth <= total_Width) {
                $(this).css('display', 'inline-block');

            } else {
                $(this).css('display', 'none');
            }
            startWidth += $(this).width();
        });
        return startScrol;
    }

    var resetScrollVisible = function(startScrol) {
        $('.draggable-content').css('display', 'inline-block');
        $('.drag-panel').scrollLeft(startScrol);
    }
})
