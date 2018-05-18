VLApp.directive("noteBook", [function() {
	return {
		restrict: "E",
		replace: true,
		controller: "notebookCtrl",
		templateUrl: "templates/notebook.html",
		link:function ($scope,element, attrs) {
			AccessibilityManager.registerActionHandler('closenotebook',$scope,'',$scope.closeNoteBook);
			if(attrs.id) {
				$scope.fetchComponentData(attrs.id);
			}
		}
	}
}]);

VLApp.directive("notebookSlide", [function() {
	return {
		restrict: "E",
		replace: true,
		controller: "notebookLabCtrl",
		templateUrl: "templates/notebookSlide.html"

	}
}]);

VLApp.directive("textareaButton", ['$rootScope', '$timeout', function($rootScope, $timeout) {
	return {
		restrict: "E",
		transclude: true,
		replace: true,
		scope:{},
		templateUrl: "templates/textarea-button.html",
		link: function($scope, element, attrs, controllers) {
			$scope.activeBold = false;
			$scope.activeItalic = false;
			$scope.activeUnderline = false;
			$scope.activeList = false;

			$scope.$watch(function() {
				return tinyMCE.activeEditor ? tinyMCE.activeEditor.id : "";
			}, function(newValue, oldValue) {
				angular.forEach(element.find("textarea"), function(value, key) {
					if (tinyMCE.activeEditor && tinyMCE.activeEditor.quirks && (value.id == newValue)) {
						$scope.activeBold = tinyMCE.activeEditor.queryCommandState("bold")
						$scope.activeItalic = tinyMCE.activeEditor.queryCommandState("italic")
						$scope.activeUnderline = tinyMCE.activeEditor.queryCommandState("underline")
						$scope.activeList = tinyMCE.activeEditor.queryCommandState("InsertUnorderedList")
					}
				})
			})

//			$scope.$watch(function() {
//				return tinyMCE.activeEditor && tinyMCE.activeEditor.quirks ? tinyMCE.activeEditor.getContent(): ""
//			}, function(newValue, oldValue) {
//                console.log(newValue, oldValue)
//				if (newValue == "" && oldValue == "") {
//                    console.log("if working")
//                    if(tinyMCE.activeEditor) {
//                        tinyMCE.activeEditor.execCommand("fontSize", false, "19px");
//                    }
//					
//				}
//			})

			$scope.$watch(function() {
				return tinyMCE.activeEditor && tinyMCE.activeEditor.quirks ? tinyMCE.activeEditor.queryCommandState("bold") : false;
			}, function(newValue, oldValue) {
				angular.forEach(element.find("textarea"), function(value, key) {
					if (tinyMCE.activeEditor && tinyMCE.activeEditor.quirks && (value.id == tinyMCE.activeEditor.id)) {
						$scope.activeBold = newValue
					}
				})
			})

			$scope.$watch(function() {
				return tinyMCE.activeEditor && tinyMCE.activeEditor.quirks ? tinyMCE.activeEditor.queryCommandState("italic") : false;
			}, function(newValue, oldValue) {
				angular.forEach(element.find("textarea"), function(value, key) {
					if (tinyMCE.activeEditor && tinyMCE.activeEditor.quirks && (value.id == tinyMCE.activeEditor.id)) {
						$scope.activeItalic = newValue
					}
				})
			})

			$scope.$watch(function() {
				return tinyMCE.activeEditor && tinyMCE.activeEditor.quirks ? tinyMCE.activeEditor.queryCommandState("underline") : false;
			}, function(newValue, oldValue) {
				angular.forEach(element.find("textarea"), function(value, key) {
					if (tinyMCE.activeEditor && tinyMCE.activeEditor.quirks && (value.id == tinyMCE.activeEditor.id)) {
						$scope.activeUnderline = newValue
					}
				})
			})

			$scope.$watch(function() {
				return tinyMCE.activeEditor && tinyMCE.activeEditor.quirks ? tinyMCE.activeEditor.queryCommandState("InsertUnorderedList") : false;
			}, function(newValue, oldValue) {
				angular.forEach(element.find("textarea"), function(value, key) {
					if (tinyMCE.activeEditor && tinyMCE.activeEditor.quirks && (value.id == tinyMCE.activeEditor.id)) {
						$scope.activeList = newValue
					}
				})
			})

			$scope.bold = function() {
				if (tinyMCE.activeEditor) {
					console.log(element.find("textarea"))
					angular.forEach(element.find("textarea"), function(value, key) {
						console.log(value.id)
						console.log(tinyMCE.activeEditor.id)
						if (value.id == tinyMCE.activeEditor.id) {
							tinyMCE.activeEditor.execCommand("bold")
							$timeout(function() {
								tinyMCE.activeEditor.focus()
							}, 0)
						}
					})
				}
			}

			$scope.italic = function() {
				if (tinyMCE.activeEditor) {
					angular.forEach(element.find("textarea"), function(value, key) {
						if (value.id == tinyMCE.activeEditor.id) {
							tinyMCE.activeEditor.execCommand("italic")
							$timeout(function() {
								tinyMCE.activeEditor.focus()
							}, 0)
						}
					})
				}
			}

			$scope.underline = function() {
				if (tinyMCE.activeEditor) {
					angular.forEach(element.find("textarea"), function(value, key) {
						if (value.id == tinyMCE.activeEditor.id) {
							tinyMCE.activeEditor.execCommand("underline")
							$timeout(function() {
								tinyMCE.activeEditor.focus()
							}, 0)
						}
					})
				}
			}

			$scope.unOrderedList = function() {
				if (tinyMCE.activeEditor) {
					angular.forEach(element.find("textarea"), function(value, key) {
						if (value.id == tinyMCE.activeEditor.id) {
							tinyMCE.activeEditor.execCommand("InsertUnorderedList")
							$timeout(function() {
								tinyMCE.activeEditor.focus()
							}, 0)
						}
					})
				}
			}

			$scope.getTextSize = function(size) {
				if (tinyMCE.activeEditor) {
					angular.forEach(element.find("textarea"), function(value, key) {
						if (value.id == tinyMCE.activeEditor.id) {
							var fontSize = "";
							switch (size) {
								case "small":
									fontSize = "12px";
									break;
								case "normal":
									fontSize = "19px";
									break;
								case "large":
									fontSize = "23px";
									break;
								case "huge":
									fontSize = "30px";
									break;
							}

							if (tinyMCE.activeEditor.queryCommandValue("fontSize") != fontSize) {
								tinyMCE.activeEditor.execCommand("fontSize", false, fontSize);
							}

							$timeout(function() {
								$scope.bshowPopupFonts = false;
								tinyMCE.activeEditor.focus();
								$scope.$apply()
							}, 1)
						}
					})
				}
			}
		}
	}
}])

/*VLApp.directive("vlTabindex", function($timeout) {
	return {
		restrict: "A",
		link: function($scope, element, attrs, controllers) {
			$scope.$on("newEvent", function(event, start, end, set) {
				if (parseInt(attrs.vlTabindex) >= parseInt(start) && parseInt(attrs.vlTabindex) <= parseInt(end)) {
					attrs.$set('tabindex', attrs.vlTabindex);
					if (!element.hasClass("carousel-control") ) {
						attrs.$set('aria-hidden', "false");
					} else {
					}
					

				} else {
					attrs.$set('tabindex', "-1");
					if (!element.hasClass("carousel-control")) {
						attrs.$set('aria-hidden', "true");
					}
				}

				if (parseInt(attrs.vlTabindex) === parseInt(set)) {
					$timeout(function() {
						angular.element('[tabindex=' + set + ']').focus();
						$scope.$apply()
					}, 100)
				}
			});
		}
	}
});*/

/*VLApp.factory("$vlTabindex", function($rootScope) {
	return {
		set: function(start, end, set) {
			$rootScope.$broadcast('newEvent', start, end, set);
		}
	}
});*/
