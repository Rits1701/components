VLApp.controller('notebookCtrl', ['$scope', '$rootScope', '$compile', '$timeout', 'APPCONSTANT', 'appService', '$html2canvas', '$window', function($scope, $rootScope, $compile, $timeout, APPCONSTANT, appService, $html2canvas, $window) {
	var currentTabIndex = 0;
	var currentSubTabIndex = "";
	var currentActiveTabIndex = 0;
	var currentActiveSubTabIndex = "";
	var totalSnapshots = 0;

	$scope.currentIndex = 0;
	$scope.notebookPageIndex = 0;
	$scope.add = true;
	$scope.addActive = true;
	$scope.delete = false;
	$scope.showBottomLine = false;

	$scope.fetchComponentData = function(strCompId) {
		if ($scope.appData.data[strCompId]) {

		}
	}

	try {
		if ($scope.appData.data.tincan && $scope.appData.data.tincan.notebook.notebookSavedData && $scope.appData.data.tincan.notebook.notebookSavedData.pages) {
			$scope.appData.data.noteBookComp = $scope.appData.data.tincan.notebook.notebookSavedData;
		}
	} catch (e) {

	}

	try {
		if ($scope.appData.data.tincan) {
			currentTabIndex = parseInt($scope.appData.data.tincan.selectedTabIndex);
			currentActiveTabIndex = parseInt($scope.appData.data.tincan.selectedTabIndex);
		}
	} catch (e) {

	}

	$scope.notebookData = $scope.appData.data.noteBookComp.pages;
	$scope.notebookAccessibilityData = $scope.appData.data.noteBookComp.notebook_accessibility;
	$scope.showNoteBook = false;
	$scope.showLeftArrow = false;
	$scope.showRightArrow = true;
	$scope.activeLeftArrow = true;
	$scope.activeRightArrow = true;
	$scope.selectNotebookOptions = {
		minimumResultsForSearch: -1
	};

	$scope.tinymceNotebookPageOptions = {
		menubar: false,
		statusbar: false,
		toolbar: false,
		plugins: "placeholder tabindex",
		setup: function(editor) {
			editor.on("init", function() {
				editor.execCommand("fontSize", false, "19px");
			})
		}
	};

	$scope.tinymceNotebookImageOptions = {
		menubar: false,
		statusbar: false,
		toolbar: false,
		plugins: "placeholder tabindex",

		setup: function(editor) {
			editor.on("init", function() {
				editor.execCommand("fontSize", false, "19px");
			})
		}
	};

	$scope.$on('CURRENT_TAB_INDEX', function(event, data) {
		currentTabIndex = data;
		currentActiveTabIndex = data;
		currentSubTabIndex = "";
		currentActiveSubTabIndex = "";
	});

	ActionManager.registerActionHandler(APPCONSTANT.CURRENT_SUB_TAB_INDEX, function(data) {
		currentSubTabIndex = data;
		currentActiveSubTabIndex = data;
	});
	AccessibilityManager.registerActionHandler('closeAlertBox', 'document', '', function() {
		angular.element('.alert-bg .cancel').trigger('click')
	})

	AccessibilityManager.registerActionHandler('opennotebookbyimagine', 'document', '', function() {
		$scope.launchNotebook()
	})
	ActionManager.registerActionHandler(APPCONSTANT.NOTE_BOOK_OPENED, function() {
		$scope.launchNotebook()
	})

	ActionManager.registerActionHandler(APPCONSTANT.TAKE_SNAPSHOT, function(data) {
		capturePage();
	});


	$scope.launchNotebook = function() {
		AccessibilityManager.disableElements(['.lab-header', '.virtualLabMainContainer', '.next-button-container']);
		removeAllActive();
		setActive(currentActiveTabIndex, currentActiveSubTabIndex);
		openNotebook();
		$('#notebookCarousel iframe').each(function() {
			$(this).contents().find('p').each(function() {
				if (!$(this).text().length) {
					$(this).remove();
				}
			})
			if ($(this).contents().find('body')[0].innerText.toString().trim().length == 0) {
				$(this).next('label').show()
			}
		})
		//setActiveByIndex(activeIndex);
	}

	$scope.closeNoteBook = function() {
		ActionManager.dispatchAction(APPCONSTANT.NOTE_BOOK_CLOSED);
		$scope.$broadcast(APPCONSTANT.NOTE_BOOK_CLOSED);
		angular.element(document.querySelector('.drawing-tool .tool-box .icon-snapshot')).css('pointer-events', '');
		$scope.showNoteBook = false;
		angular.element(document.activeElement).blur();

		angular.element('.notebookContainer').css("display", "none")
		angular.element('.notebookContainer').animate({
			bottom: -627,
			opacity: 0
		}, 300, "swing");
		$scope.$emit(APPCONSTANT.HIDE_OVRLAY);

		if (!$scope.$$phase) {
			$scope.$apply();
		}
		AccessibilityManager.panelCloseHandler();
		AccessibilityManager.enableElements(['.lab-header', '.virtualLabMainContainer', '.next-button-container']);
		setTimeout(function() {
			$("[tabIndex='3']").focus();
		}, 100)
		$scope.appData.data.tincan.notebook.notebookSavedData = $scope.appData.data.noteBookComp;

		TincanManager.updateNoteBookTincanData($scope.appData.data.tincan, "notebook", "notebook", {
			"name": "notebook",
			"data": "notebook",
			"score": 1
		});

		ActionManager.dispatchAction(APPCONSTANT.SAVE_TINCAN_DATA);
	}

	var openNotebook = function() {
		ActionManager.dispatchAction("STOP_ALL_AUDIO_DIS");
		$scope.showNoteBook = true;
		ActionManager.dispatchAction(APPCONSTANT.SHOW_OVRLAY);
		angular.element('.notebookContainer').css("display", "block")

		angular.element('.notebookContainer').animate({
			bottom: -11,
			opacity: 1
		}, 300, "swing");

		$('.select2-container').find('a').off('click').on('click', select2Focus).on('blur', function() {})
		$timeout(function() {
			var activeIndex = parseInt(angular.element("#notebookCarousel .item.active").attr("data-active-index"));
			elementsJSON['elemSeq']['mainparent']['children']['notebook']['children'] = $scope.appData.data.noteBookComp.notebook_accessibility[activeIndex];
			AccessibilityManager.setTabGroup('notebook')
			AccessibilityManager.updateTabOrder('notebook', function() {
				$('#notebookCarousel .item.active').find('.notebook-header-container').focus()
			});
		}, 500)
	}

	function select2Focus() {
		var obj = $(this)
		$(this).closest('.select2-container').next('select').select2('open');
		$(this).closest('.select2-container').next('select').off('select2-close').on("select2-close", function() {
			setTimeout(function() {
				AccessibilityManager.updateTabOrder('notebook', function() {
					setTimeout(function() {
						obj.focus();
					}, 100)
				})
			}, 1);
		});
	}

	var removeAllActive = function() {
		angular.forEach($scope.notebookData, function(value, index) {
			value.active = false
		})
		$timeout(function() {
			$scope.$apply()
		})
	}

	var setActive = function(tab, subTab) {
		angular.forEach($scope.notebookData, function(value, index) {
			if (subTab !== "") {
				if (value.index === tab && value.subIndex === subTab && value.parent === "") {
					value.active = true;
				} else {
					value.active = false;
				}
			} else {
				if (value.index === tab && value.parent === "") {
					value.active = true;
				} else {
					value.active = false;
				}
			}
		})
		$timeout(function() {
			$scope.$apply()
		})
	}

	var setActiveByIndex = function(activeIndex) {
		angular.forEach($scope.notebookData, function(value, index) {
			if (index === activeIndex) {
				value.active = true;
			} else {
				value.active = false;
			}
		})
		$timeout(function() {
			$scope.$apply()
		})
	}

	var getCurrentTaxIndexData = function() {
		var activeNote = {}
		for (var i = 0; i < $scope.notebookData.length; i++) {
			if ($scope.notebookData[i].active == true) {
				activeNote["data"] = $scope.notebookData[i]
				activeNote["index"] = i
				break;
			}
		}
		return activeNote;
	}

	var getCurrentTaxIndexParentData = function() {
		var activeNote = {}
		for (var i = 0; i < $scope.notebookData.length; i++) {
			if ($scope.notebookData[i].active == true) {
				activeNote["data"] = $scope.notebookData[i]
				activeNote["index"] = i
				break;
			}
		}

		if (activeNote.data.parent !== "") {
			var activeNoteParent = {}

			if (activeNote.data.subIndex !== "") {
				for (var j = 0; j < $scope.notebookData.length; j++) {
					if ($scope.notebookData[j].index === activeNote.data.parent && $scope.notebookData[j].subIndex === activeNote.data.subIndex) {
						activeNoteParent["data"] = $scope.notebookData[j]
						activeNoteParent["index"] = j
						break;
					}
				}
				return activeNoteParent;
			} else {
				for (var j = 0; j < $scope.notebookData.length; j++) {
					if ($scope.notebookData[j].index === activeNote.data.parent) {
						activeNoteParent["data"] = $scope.notebookData[j]
						activeNoteParent["index"] = j
						break;
					}
				}
				return activeNoteParent;
			}
		} else {
			return activeNote;
		}
	}

	var getCurrentActiveTabIndexData = function() {
		var activeNote = {}
		for (var i = 0; i < $scope.notebookData.length; i++) {
			if (currentActiveSubTabIndex === "") {
				if ($scope.notebookData[i].index == currentActiveTabIndex) {
					activeNote["data"] = $scope.notebookData[i]
					activeNote["index"] = i
					break;
				}
			} else {
				if ($scope.notebookData[i].index == currentActiveTabIndex && $scope.notebookData[i].subIndex == currentActiveSubTabIndex) {
					activeNote["data"] = $scope.notebookData[i]
					activeNote["index"] = i
					break;
				}
			}
		}
		return activeNote;
	}

	var capturePage = function() {
		angular.element('.notebookContainer').css("display", "block")
		var noteObject = getCurrentActiveTabIndexData();
		if (totalSnapshots < 10) {
			ActionManager.dispatchAction(APPCONSTANT.TAKE_SNAPSHOT_BEFORE);
			$scope.$broadcast(APPCONSTANT.TAKE_SNAPSHOT_BEFORE);
			var audio = new Audio('assets/audios/camera_shutter_click.mp3');
			audio.play();
			$html2canvas.render().then(function(screenShot) {
				var newImageJson = {
					"pageTitle": noteObject.data.pageTitle + " Screenshot",
					"pageSubtitle": "",
					"parent": noteObject.data.index,
					"index": noteObject.data.index,
					"subIndex": noteObject.data.subIndex,
					"template": "templates/notebook-image.html",
					"pageType": "image",
					"active": false,
					"model": "",
					"image": screenShot,
					"pageTitleCounterText": noteObject.data.imageCounter + 1,
					"bottomLine": false
				};

				noteObject.data.imageCounter = noteObject.data.imageCounter + 1
				var pushIndex = noteObject.index + noteObject.data.pageCounter + noteObject.data.imageCounter;
				$scope.notebookData.splice(pushIndex, 0, newImageJson);
				$scope.notebookAccessibilityData.splice(pushIndex, 0, newPageAccessibilityImgJson);

				elementsJSON['elemSeq']['mainparent']['children']['notebook']['children'] = $scope.appData.data.noteBookComp.notebook_accessibility[pushIndex];
				AccessibilityManager.updateTabOrder('notebook');
				$timeout(function() {
					$('#notebookCarousel .item.active').find('.notebook-header-container').focus()
				}, 1000)

				setActiveByIndex(pushIndex);
				totalSnapshots = totalSnapshots + 1;
				$timeout(function() {
					openNotebook();
					angular.element(".loading-container").hide();
					$scope.$broadcast(APPCONSTANT.TAKE_SNAPSHOT_AFTER);
					$scope.$apply();
					ActionManager.dispatchAction(APPCONSTANT.TAKE_SNAPSHOT_AFTER);
				}, 100)
			})
		} else {
			var alertMsg = 'Oh snap! Reel over! No more photos can be taken.';
			var alertObj = {
				show_alert: true,
				alert_msg: alertMsg,
				alert_button_txt1: "Cancel",
				alert_button_txt2: "OK",
				autoclose: true,
				bOverlay: true,
				alertplace: "screenShot"
			}
			$scope.onShowAlert(alertObj);
			$timeout(function() {
				$scope.$apply()
			})
		}
	}

	$scope.$watch("notebookData", function(newValue, oldValue) {
		var noteObject = getCurrentTaxIndexData()
		if ("data" in noteObject) {
			$scope.notebookPageIndex = noteObject.index + 1
			if (noteObject.data.parent === "") {
				$scope.delete = false;
			} else {
				$scope.delete = true;
			}

			if (noteObject.data.parent === "") {
				$scope.add = true;
			} else {
				if (noteObject.data.pageType === "text") {
					$scope.add = true;
				} else {
					$scope.add = false;
				}
			}

			if (noteObject.index === 0) {
				$scope.showLeftArrow = false
			} else {
				$scope.showLeftArrow = true
			}

			if (noteObject.index === $scope.notebookData.length - 1) {
				$scope.showRightArrow = false
			} else {
				$scope.showRightArrow = true
			}

			$scope.showBottomLine = "bottomLine" in noteObject.data ? noteObject.data.bottomLine : false;
		}
		$timeout(function() {
			$scope.$apply()
		})
	}, true)

	var newPageAccessibilityJson = {
		"notebook_1": {
			"selector": ".notebook-header-container",
			"attributes": {
				"aria-label": {
					"en": "",
					"es": ""
				}
			}
		},
		"notebook_2": {
			"selector": ".notebook-page-page iframe",
			"attributes": {
				"role": "text",
				"aria-label": {
					"en": "Write your notes here",
					"es": ""
				}
			}
		},
		"notebook_2_1": {
			"selector": "#notebookCarousel .notebook-page-page .editor",
			"naturalTabOrder": true,
			"attributes": {
				"role": "textbox",
				"checkDisable": "editor",
				"aria-label": {
					"en": "Enter your notes here"
				}
			}
		},
		"notebook_3": {
			"selector": "#notebookCarousel .icon-discard",
			"attributes": {
				"role": "button",
				"aria-label": {
					"en": "Delete a page",
					"es": ""
				}
			},
			'naturalTabOrder': true,
			"data": {
				"keys": {
					"enter": {
						"action": "click"
					}
				},
				"globalHotkeys": {
					'escape': {
						"action": 'closeAlertBox',
						"autoFocus": ".alert-bg .msg-box"
					}
				},
				'isCyclicTabTrap': 'notebook_3',
				'focusTgt': '.alert-bg .msg-box'
			},
			"children": {
				"notebook_3_1": {
					"selector": ".alert-bg .msg-box",
					'naturalTabOrder': true,
					"attributes": {
						"role": "text",
						"aria-label": {
							"en": "Are you sure want to delete the page",
							"es": ""
						}
					}
				},
				"notebook_3_2": {
					"selector": ".alert-bg .cancel",
					"attributes": {
						"role": "button",
						"aria-label": {
							"en": "Cancel",
							"es": ""
						}
					},
					'naturalTabOrder': true,
					"data": {
						"keys": {
							"enter": {
								"action": "click",
								'autoFocus': '#notebookCarousel .icon-discard'
							}
						},
						"focusTgt": "#notebookCarousel .icon-discard"
					}
				},
				"notebook_3_3": {
					"selector": ".alert-bg .prime-button",
					"attributes": {
						"role": "button",
						"aria-label": {
							"en": "Ok",
							"es": ""
						}
					},
					"data": {
						"keys": {
							"enter": {
								"action": "click",
								'autoFocus': '#notebookCarousel .icon-discard'
							}
						},
						"focusTgt": "#notebookCarousel .icon-discard"
					}
				}
			}
		},
		"notebook_4": {
			"selector": "#notebookCarousel .icon-print",
			"attributes": {
				"role": "button",
				"aria-label": {
					"en": "Print a page",
					"es": ""
				}
			},
			"data": {
				"keys": {
					"enter": {
						"action": "click"
					}
				},
				"focusTgt": "#notebookCarousel .icon-print"
			}
		},
		"notebook_5": {
			"selector": "#notebookCarousel .icon-add",
			"attributes": {
				"role": "button",
				"aria-label": {
					"en": "Add a new page",
					"es": ""
				}
			},
			"data": {
				"keys": {
					"enter": {
						"action": "click"
					}
				},
				"focusTgt": "#notebookCarousel .icon-add"
			}
		},
		"notebook_6": {
			"selector": "#notebookCarousel .notebook-carousel-control a.left",
			"attributes": {
				"role": "button",
				"aria-label": {
					"en": "Go to previous notebook page",
					"es": ""
				}
			},
			"data": {
				"keys": {
					"enter": {
						"action": "click"
					}
				},
				"focusTgt": "#notebookCarousel .notebook-carousel-control a.left"
			}
		},
		"notebook_7": {
			"selector": "#notebookCarousel .notebook-carousel-control a.right",
			"attributes": {
				"role": "button",
				"aria-label": {
					"en": "Go to next notebook page",
					"es": ""
				}
			},
			"data": {
				"keys": {
					"enter": {
						"action": "click"
					}
				},
				"focusTgt": "#notebookCarousel .notebook-carousel-control a.right"
			}
		},
		"notebook_8": {
			"selector": ".close-notebook .icon-closenote",
			"attributes": {
				"role": "button",
				"aria-label": {
					"en": "Close",
					"es": ""
				}
			},
			"data": {
				"keys": {
					"enter": {
						"action": "click"
					}
				},
				"focusTgt": ".tab.selected a"
			}
		}
	}

	var newPageAccessibilityImgJson = {
		"notebook_1": {
			"selector": ".notebook-header-container",
			"attributes": {
				"aria-label": {
					"en": "",
					"es": ""
				}
			}
		},
		"notebook_2": {
			"selector": ".notebook-image-page .image-container",
			"attributes": {
				"aria-label": {
					"en": "It is a Captured Image",
					"es": ""
				}
			},
			'naturalTabOrder': true,
		},
		"notebook_2_1": {
			"selector": ".notebook-image-page .text-container iframe",
			"attributes": {
				"aria-label": {
					"en": "Write your text here.",
					"es": ""
				}
			}
		},
		"notebook_2_1_1": {
			"selector": "#notebookCarousel .notebook-image-page .editor",
			"naturalTabOrder": true,
			"attributes": {
				"role": "textbox",
				"checkDisable": "editor",
				"aria-label": {
					"en": "Enter your notes here"
				}
			}
		},
		"notebook_3": {
			"selector": "#notebookCarousel .icon-discard",
			"attributes": {
				"role": "button",
				"aria-label": {
					"en": "Delete a page",
					"es": ""
				}
			},
			'naturalTabOrder': true,
			"data": {
				"keys": {
					"enter": {
						"action": "click"
					}
				},
				"globalHotkeys": {
					'escape': {
						"action": 'closeAlertBox',
						"autoFocus": ".alert-bg .msg-box"
					}
				},
				'isCyclicTabTrap': 'notebook_3',
				'focusTgt': '.alert-bg .msg-box'
			},
			"children": {
				"notebook_3_1": {
					"selector": ".alert-bg .msg-box",
					"attributes": {
						"role": "text",
						"aria-label": {
							"en": "Are you sure want to delete the page",
							"es": ""
						}
					},
					'naturalTabOrder': true,
				},
				"notebook_3_2": {
					"selector": ".alert-bg .cancel",
					"attributes": {
						"role": "button",
						"aria-label": {
							"en": "Cancel",
							"es": ""
						}
					},
					'naturalTabOrder': true,
					"data": {
						"keys": {
							"enter": {
								"action": "click",
								'autoFocus': '#notebookCarousel .icon-discard'
							}
						},
						"focusTgt": "#notebookCarousel .icon-discard"
					}
				},
				"notebook_3_3": {
					"selector": ".alert-bg .prime-button",
					"attributes": {
						"role": "button",
						"aria-label": {
							"en": "Ok",
							"es": ""
						}
					},
					'naturalTabOrder': true,
					"data": {
						"keys": {
							"enter": {
								"action": "click",
								'autoFocus': '#notebookCarousel .icon-discard'
							}
						},
						"focusTgt": "#notebookCarousel .icon-discard"
					}
				}

			}

		},
		"notebook_4": {
			"selector": "#notebookCarousel .icon-print",
			"attributes": {
				"role": "button",
				"aria-label": {
					"en": "Print a page",
					"es": ""
				}
			},
			"data": {
				"keys": {
					"enter": {
						"action": "click"
					}
				},
				"focusTgt": "#notebookCarousel .icon-print"
			}
		},
		"notebook_5": {
			"selector": "#notebookCarousel .icon-add",
			"attributes": {
				"role": "button",
				"aria-label": {
					"en": "Add a new page",
					"es": ""
				}
			},
			"data": {
				"keys": {
					"enter": {
						"action": "click"
					}
				},
				"focusTgt": "#notebookCarousel .icon-add"
			}
		},
		"notebook_6": {
			"selector": "#notebookCarousel .notebook-carousel-control a.left",
			"attributes": {
				"role": "button",
				"aria-label": {
					"en": "Go to previous page",
					"es": ""
				}
			},
			"data": {
				"keys": {
					"enter": {
						"action": "click"
					}
				},
				"focusTgt": "#notebookCarousel .notebook-carousel-control a.left"
			}
		},
		"notebook_7": {
			"selector": "#notebookCarousel .notebook-carousel-control a.right",
			"attributes": {
				"role": "button",
				"aria-label": {
					"en": "Go to next page",
					"es": ""
				}
			},
			"data": {
				"keys": {
					"enter": {
						"action": "click"
					}
				},
				"focusTgt": "#notebookCarousel .notebook-carousel-control a.left"
			}
		},
		"notebook_8": {
			"selector": ".close-notebook .icon-closenote",
			"attributes": {
				"role": "button",
				"aria-label": {
					"en": "Close notebook",
					"es": ""
				}
			},
			"data": {
				"keys": {
					"enter": {
						"action": "click"
					}
				},
				"focusTgt": ".tab.selected a"
			}
		}
	}

	$scope.addPage = function() {
		var noteObject = getCurrentTaxIndexParentData();
		angular.element(".tool-bar .icon-add").addClass("disabledNextBtn");
		$scope.addActive = false;
		if (noteObject.data.pageCounter < 3) {

			var newPageJson = {
				"pageTitle": noteObject.data.pageTitle + " " + noteObject.data.pageSubtitle,
				"pageSubtitle": "",
				"parent": noteObject.data.index,
				"index": noteObject.data.index,
				"subIndex": noteObject.data.subIndex,
				"template": "templates/notebook-page.html",
				"pageType": "text",
				"active": false,
				"model": "",
				"pageTitleCounterText": noteObject.data.pageCounter + 2,
				"bottomLine": false
			};
			noteObject.data.pageCounter = noteObject.data.pageCounter + 1

			var pushIndex = noteObject.index + noteObject.data.pageCounter;
			$scope.notebookData.splice(pushIndex, 0, newPageJson);

			$scope.notebookAccessibilityData.splice(pushIndex, 0, newPageAccessibilityJson);

			$timeout(function() {
				angular.element("#notebookCarousel").carousel(pushIndex)
				$timeout(function() {
					angular.element(".tool-bar .icon-add").removeClass("disabledNextBtn");
				}, 1000);
				$scope.$apply()
			}, 800)
			$timeout(function() {
				$scope.addActive = true;

			}, 1500)
		} else {
			var alertMsg = "You can not add more than 3 pages";
			var alertObj = {
				show_alert: true,
				alert_msg: alertMsg,
				alert_button_txt1: "Cancel",
				alert_button_txt2: "OK",
				autoclose: true,
				bOverlay: true,
				alertplace: "screenShot"
			}
			$scope.onShowAlert(alertObj);
			$timeout(function() {
				angular.element(".tool-bar .icon-add").removeClass("disabledNextBtn");
				$scope.addActive = true;
				$scope.$apply()
			}, 2300)
		}
	}

	$scope.notebookAlert = function(alertMsg, callback) {
		var alertObj = {
			show_alert: true,
			alert_msg: alertMsg,
			alert_button_txt1: "Cancel",
			alert_button_txt2: "OK",
			autoclose: false,
			bOverlay: true,
			alertplace: "notebook"
		};

		$timeout(function() {
			$scope.$apply()
		}, 300)

		angular.element(document.querySelector('.popupOverlay')).css({
			'z-index': '999'
		});
		$scope.onShowAlert(alertObj);
		$scope.alertAction = $scope.$on(APPCONSTANT.ALERT_ACTION, function(event, data) {
			if (data != undefined && data.alertplace == "notebook") {
				$scope.$broadcast(APPCONSTANT.SHOW_OVRLAY);
				angular.element(document.querySelectorAll('.popupOverlay')).css({
					'z-index': ''
				});
				callback(data);
			}
		});
	}

	$scope.deletePage = function() {
		var alertMsg = "";
		var activeNote = getCurrentTaxIndexData();
		if (activeNote.data.pageType === "text") {
			alertMsg = "Are you sure want to delete the page";
		} else {
			alertMsg = "Are you sure want to delete the screenshot page";
		}

		$timeout(function() {
			if (!$(document.activeElement).parents('.alert-bg').length) {
				AccessibilityManager.setFocus($('.alert-bg .msg-box'))
			}
		}, 900)
		$scope.notebookAlert(alertMsg, function(data) {
			if (data.state == 'yes') {
				if (activeNote.data.pageType === "text") {

					if ($scope.notebookData[activeNote.index + 1] && $scope.notebookData[activeNote.index + 1].parent !== "") {
						for (var i = activeNote.index + 1; i < $scope.notebookData.length; i++) {
							if ($scope.notebookData[i].pageType === "text") {
								$scope.notebookData[i].pageTitleCounterText = $scope.notebookData[i].pageTitleCounterText - 1
							} else {
								break;
							}
						}
					}

					var activeNoteParent = getCurrentTaxIndexParentData();
					activeNoteParent.data.pageCounter = activeNoteParent.data.pageCounter - 1;

					angular.element("#notebookCarousel").carousel("prev");


					$timeout(function() {
						$scope.notebookData.splice(activeNote.index, 1);
						$scope.notebookAccessibilityData.splice(activeNote.index, 1);
						AccessibilityManager.updateTabOrder('notebook', function() {
							AccessibilityManager.setFocus($('.alert-bg .msg-box'))
						})
						$scope.$apply()
					}, 800)
				} else if (activeNote.data.pageType === "image") {
					if ($scope.notebookData[activeNote.index].parent !== "") {
						for (var i = activeNote.index + 1; i < $scope.notebookData.length; i++) {
							if ($scope.notebookData[i].pageType === "image") {
								$scope.notebookData[i].pageTitleCounterText = $scope.notebookData[i].pageTitleCounterText - 1
							} else {
								break;
							}
						}
					}

					var activeNoteParent = getCurrentTaxIndexParentData();
					activeNoteParent.data.imageCounter = activeNoteParent.data.imageCounter - 1;
					angular.element("#notebookCarousel").carousel("prev");
					totalSnapshots = totalSnapshots - 1;
					$timeout(function() {
						$scope.notebookData.splice(activeNote.index, 1);
						$scope.notebookAccessibilityData.splice(activeNote.index, 1);
						AccessibilityManager.updateTabOrder('notebook', function() {
							AccessibilityManager.setFocus($('.alert-bg .msg-box'))
						})
						$scope.$apply()
					}, 800)
				}

				$scope.$on('$destroy', $scope.alertAction());
				return false;
			} else if (data.state == 'no') {

				$scope.$on('$destroy', $scope.alertAction());
				return false;
			}
			AccessibilityManager.panelCloseHandler();
		});
	}

	$scope.disableNavigation = function() {
		$scope.activeLeftArrow = false;
		$scope.activeRightArrow = false;
	}

	$scope.notebookPrint = function() {
		var container = angular.element("#notebookCarousel .item.active")
		container.find("textarea").each(function(index, element) {
			setTinymceDataForPrint(element.id)
		})
		angular.element("#notebookCarousel .item.active .notebook-page-container").css({
			"height": "100%",
			"overflow-y": "visible"
		})
		angular.element("#notebookCarousel div[contenteditable]").css({
			"overflow": "hidden"
		})
		var section = angular.element("#notebookCarousel .item.active .notebook-header-container span").text();
		section = section.replace(/([a-z])([A-Z])/g, '$1 $2');
		var printData = {};
		printData.title = $scope.appData.title;
		printData.section = "Notebook - " + section;
		printData.footer = $scope.appData.footer;
		var printWindow = appService.isIpadDevice() ? $window.open('', 'Print-Page', 'height=400,width=800') : null;

		$timeout(function() {
			angular.element("#notebookCarousel .item.active .notebook-page-container").css({
				"height": "",
				"overflow-y": ""
			})
			angular.element("#notebookCarousel div[contenteditable]").css({
				"overflow": ""
			})
		}, 30);

		/*angular.element('#notebook-print').html(angular.element("#notebookCarousel .item.active .notebook-page-container").html());
		appService.printContainer('#notebook-print', printWindow, printData);
		container.find("textarea").each(function(index, element) {
		    removeTinymceDataForPrint(element.id)
		    angular.element("#notebookCarousel .item.active .notebook-page-container").css({
		        "height": "398px",
		        "overflow-y": "scroll"
		    })
		});*/

		html2canvas(angular.element("#notebookCarousel .item.active .notebook-page-container"), {
			onrendered: function(canvas) {
				var screenShot = canvas.toDataURL("image/png");
				angular.element('#notebook-print').html('<img src="' + screenShot + '" class="print-image" alt="" width="720">');
				appService.printContainer('#notebook-print', printWindow, printData);


				container.find("textarea").each(function(index, element) {
					removeTinymceDataForPrint(element.id)
					angular.element("#notebookCarousel .item.active .notebook-page-container").css({
						"height": "398px",
						"overflow-y": "scroll"
					})
				})
			}
		});
	}

	var setTinymceDataForPrint = function(editorId) {
		var editor = tinyMCE.get(editorId)
		var contentAreaContainer = editor.getContentAreaContainer();
		var placeholder_attrs = {
			style: {
				"position": 'absolute',
				"top": 0,
				"left": 0,
				"width": "calc(100% - 16px)",
				"height": "100%",
				"z-index": 2,
				"background-color": "white",
				"margin": "0 8px",
				"padding-top": "5px",
				"box-sizing": "border-box"
			},
			class: "notebook-print-container"
		};
		tinymce.DOM.add(contentAreaContainer, "div", placeholder_attrs, editor.getContent());
	}

	var removeTinymceDataForPrint = function(editorId) {
		var editor = tinyMCE.get(editorId)
		var contentAreaContainer = editor.getContentAreaContainer();
		angular.element(contentAreaContainer).children("div").remove()
	}

	angular.element(document).ready(function() {

		angular.element("#notebookCarousel").on("slide.bs.carousel", function() {
			$('.notebook-header-container').attr('aria-label', '');
		});

		angular.element("#notebookCarousel").on("slid.bs.carousel", function() {
			$(".notebook-container .icon-size").scope().showFontSizes = false;

			var activeIndex = parseInt(angular.element("#notebookCarousel .item.active").attr("data-active-index"));
			elementsJSON['elemSeq']['mainparent']['children']['notebook']['children'] = $scope.appData.data.noteBookComp.notebook_accessibility[activeIndex];

			AccessibilityManager.updateTabOrder('notebook', function() {
				$('#notebookCarousel .item.active').find('.notebook-header-container').focus()
			});

			$timeout(function() {
				setActiveByIndex(activeIndex);
				currentTabIndex = $scope.notebookData[activeIndex].index;
				currentSubTabIndex = $scope.notebookData[activeIndex].subIndex;

				$timeout(function() {
					$scope.activeLeftArrow = true;
					$scope.activeRightArrow = true;
					$scope.$apply();
					$timeout(function() {
						if ($scope.delete == true) {
							AccessibilityManager.enableElements($('#notebookCarousel .icon-discard'));
							$('#notebookCarousel .icon-discard').attr('aria-label', $('#notebookCarousel .icon-discard').attr('originallabel'));
						} else {
							AccessibilityManager.disableElements($('#notebookCarousel .icon-discard'));
						}
					}, 200);
				}, 200);
			}, 200);

			$scope.appData.data.tincan.notebook.notebookSavedData = $scope.appData.data.noteBookComp;

			TincanManager.updateNoteBookTincanData($scope.appData.data.tincan, "notebook", "notebook", {
				"name": "notebook",
				"data": "notebook",
				"score": 1
			});

			ActionManager.dispatchAction(APPCONSTANT.SAVE_TINCAN_DATA);
		})
	})
}])

VLApp.factory('$html2canvas', ['$q', function($q) {
	return {
		render: function() {
			var deferred = $q.defer();
			var labView = angular.element(".screen-view>.screen-view").not(".ng-hide");
			html2canvas(labView, {
				onrendered: function(canvas) {
					var screenShot = canvas.toDataURL("image/png");
					deferred.resolve(screenShot);
				}
			});
			return deferred.promise;
		}
	}
}])

VLApp.filter('pageTitle', [function() {
	return function(data) {
		if (data.parent === "") {
			return data.pageTitle
		} else {
			return data.pageTitle + " - " + data.pageTitleCounterText
		}
	}
}])
