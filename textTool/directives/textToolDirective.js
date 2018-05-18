VLApp.directive("editortools", function($document, $editor, $timeout) {
	return {
		restrict: 'A',
		replace: true,
		scope: {},
		templateUrl: 'templates/textTool.html',
		link: function($scope, element, attrs, controllers) {
			$scope.activeBold = false;
			$scope.activeItalic = false;
			$scope.activeUnderline = false;
			$scope.activeUnorderList = false;
			$scope.showFontSizes = false;

			$scope.openFontSizes = function() {
				$scope.showFontSizes = !$scope.showFontSizes;
			}

			$scope.bold = function() {
				if ($editor.focusedEditor) {
					$document[0].execCommand('bold', false, null);
					$editor.setEmphasis("bold")
				}
			}

			$scope.italic = function() {
				if ($editor.focusedEditor) {
					$document[0].execCommand('italic', false, null);
					$editor.setEmphasis("italic")
				}
			}

			$scope.underline = function() {
				if ($editor.focusedEditor) {
					$document[0].execCommand('underline', false, null);
					$editor.setEmphasis("underline")
				}
			}

			$scope.unOrderedList = function() {
				if ($editor.focusedEditor) {
					$document[0].execCommand('InsertUnorderedList', false, null);
					$editor.setEmphasis("unorderlist")
				}
			}

			$scope.getTextSize = function(fontsize) {
				$scope.showFontSizes = false;
				if ($editor.focusedEditor) {
					$document[0].execCommand('FontSize', false, fontsize);
					$editor.setEmphasis("fontsize", fontsize)
				}
			}

			$scope.$watch(function() {
				return $editor.focusedEditor.bold
			}, function(newValue) {
				if (newValue != null) {
					if (element[0].parentNode.querySelector("#" + $editor.focusedEditor.id)) {
						$scope.activeBold = newValue
					}
				}
			})

			$scope.$watch(function() {
				return $editor.focusedEditor.italic
			}, function(newValue) {
				if (newValue != null) {
					if (element[0].parentNode.querySelector("#" + $editor.focusedEditor.id)) {
						$scope.activeItalic = newValue
					}
				}
			})

			$scope.$watch(function() {
				return $editor.focusedEditor.underline
			}, function(newValue) {
				if (newValue != null) {
					if (element[0].parentNode.querySelector("#" + $editor.focusedEditor.id)) {
						$scope.activeUnderline = newValue
					}
				}
			})

			$scope.$watch(function() {
				return $editor.focusedEditor.unorderlist
			}, function(newValue) {
				if (newValue != null) {
					if (element[0].parentNode.querySelector("#" + $editor.focusedEditor.id)) {
						$scope.activeUnorderList = newValue
					}
				}
			})

			$scope.$on("CLOSE_FONT_SIZE", function() {
				$scope.showFontSizes = false;
			})
		}
	}
})

VLApp.factory("$editortools", function($rootScope) {
	return {
		setEmphasis: function(type, value) {
			$rootScope.$emit(type + "_emphasis", value);
		}
	}
})

VLApp.directive("editor", function($rootScope, $document, $editor, $editortools, $timeout, $sce) {
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function($scope, element, attrs, ngModel) {
			var id = "editor_" + (+new Date())
			attrs.$set('id', id);

			if (!ngModel) return;

			ngModel.$render = function() {
				element.html(ngModel.$viewValue || '');
				read();
			};

			element.on('blur keyup change', function() {
				$rootScope.$broadcast("CLOSE_FONT_SIZE")
				$scope.$evalAsync(read);
			});

			function read() {
				var html = element.html();
				if (attrs.stripBr && html === '<br>') {
					html = '';
				}

				ngModel.$setViewValue(html);
			}

			$scope.$watch(function() {
				return ngModel.$viewValue
			}, function(newValue) {
				if (newValue == "") {
					$timeout(function() {
						// element[0].innerHTML = "";
						var k = document.getElementById(id)
						k.innerHTML = "";
					}, 500)
				}
			})

			var elementObject = {
				bold: false,
				italic: false,
				underline: false,
				unorderlist: false,
				dom: element,
				id: id
			}

			var updateStyle = function() {
				var range = rangy.getSelection().getRangeAt(0);
				var container = range.commonAncestorContainer
				var style = {
					bold: false,
					italic: false,
					underline: false,
					unorderlist: false
				}
				checkTagAndSetStyle(container.parentNode, style, function(data) {
					elementObject.bold = data.bold
					elementObject.italic = data.italic
					elementObject.underline = data.underline
					elementObject.unorderlist = data.unorderlist
					$timeout(function() {
						$editor.setFocusedEditor(elementObject);
						$scope.$apply()
					}, 2)
				})
			}

			var checkTagAndSetStyle = function(node, style, callback) {
				$document.designMode = "on"
				style = {
					bold: document.queryCommandState("bold"),
					italic: document.queryCommandState("italic"),
					underline: document.queryCommandState("underline"),
					unorderlist: document.queryCommandState("InsertUnorderedList")
				}
				$document.designMode = "off"
				callback(style)
			}

			element.bind('focus', function(e) {
				$editor.setFocusedEditor(elementObject);
				$editor.setActiveEditor(elementObject);
			});

			element.bind('blur', function(e) {
				$editor.setFocusedEditor();
			});

			element.bind('mouseup touchend', function(e) {
				$timeout(function() {
					updateStyle()
				}, 1)
			});

			$document.bind('mouseup', function(e) {
				if ($editor.focusedEditor.id === id) {
					$timeout(function() {
						if (ngModel.$viewValue) {
							updateStyle()
						}
					}, 1)
				}
			})

			element.bind('keydown', function(e) {
				$timeout(function() {
					updateStyle()
				}, 1)

				// if (e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 8 || e.keyCode == 46) {
				// 	$timeout(function() {
				// 		updateStyle()
				// 	}, 1)
				// }
				//
				// if (e.ctrlKey) {
				// 	if (e.keyCode == 65 || e.keyCode == 97) {
				// 		$timeout(function() {
				// 			updateStyle()
				// 		}, 1)
				// 	}
				// }
			});

			$scope.$on("bold_" + id, function(event, data) {
				elementObject.bold = !elementObject.bold
				$editor.focusedEditor.bold = elementObject.bold
			})

			$scope.$on("italic_" + id, function(event, data) {
				elementObject.italic = !elementObject.italic
				$editor.focusedEditor.italic = elementObject.italic
			})

			$scope.$on("underline_" + id, function(event, data) {
				elementObject.underline = !elementObject.underline
				$editor.focusedEditor.underline = elementObject.underline
			})

			$scope.$on("unorderlist_" + id, function(event, data) {
				elementObject.unorderlist = !elementObject.unorderlist
				$editor.focusedEditor.unorderlist = elementObject.unorderlist
			})
		}
	}
})

VLApp.factory("$editor", function($rootScope) {
	return {
		focusedEditor: "",
		activeEditor: "",
		setFocusedEditor: function(element) {
			if (element) {
				this.focusedEditor = element;
			} else {
				this.focusedEditor = "";
			}
		},
		setActiveEditor: function(element) {
			this.activeEditor = element
		},
		setFocus: function() {
			if (this.activeEditor) {
				this.activeEditor.dom[0].focus()
			}
		},
		setEmphasis: function(type) {
			$rootScope.$broadcast(type + "_" + this.focusedEditor.id);
		}
	}
})

VLApp.directive("editorButton", function() {
	return {
		restrict: "A",
		link: function($scope, element, attrs, controllers) {
			element.attr('unselectable', 'on');
			element.on('mousedown', function(e, eventData) {
				if (eventData) angular.extend(e, eventData);
				e.preventDefault();
				return false;
			})
		}
	}
})
