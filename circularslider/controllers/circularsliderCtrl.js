VLApp.controller('circularsliderCtrl', function ($scope, $rootScope) {
    //$scope.data = 
    $scope.state = {};
     function toInteger(o) {
    return (o | 0) === o;
  }

  function truthy() {
    return true;
  }

  function and(left, right) {
    return function(o) {
      return left(o) && right(o);
    };
  }

  // elem is jqLite
  function $$(elem) {
    // only one element
    var dom = elem[0];
    var computedStyle = window.getComputedStyle(dom, null);

    function getCss(prop) {
      return function() {
        return computedStyle[prop];
      };
    }

    function props(p) {
      return dom[p];
    }

    function getProps(prop) {
      return function() {
        return props(prop);
      };
    }

    function parseToFloat(value) {
      return parseFloat(value) || 0.0;
    }

    function addFloats(left, right) {
      return function() {
        return parseToFloat(left()) + parseToFloat(right());
      }
    }

    function applyFloatFn(fn) {
      return function(param) {
        return parseToFloat(fn(param));
      };
    }

    function offsetParent() {
      return angular.element(dom.offsetParent);
    }

    function offset() {
      var box = dom.getBoundingClientRect();
      var docElem = dom.ownerDocument.documentElement;

      return {
        top: box.top + docElem.scrollTop - docElem.clientTop,
        left: box.left + docElem.scrollLeft - docElem.clientLeft
      };
    }

    function position() {
      var box = offset();
      var parent = offsetParent();
      if (!parent.length) {
        return {
          top: box.top - parseToFloat(elem.css('marginTop')) + parseToFloat(elem.css('borderTopWidth')),
          left: box.left - parseToFloat(elem.css('marginLeft')) + parseToFloat(elem.css('borderLeftWidth')),
        };
      }

      var p = $$(parent);
      var po = p.offset();

      po.top += parseToFloat(p.css('borderTopWidth'));
      po.left += parseToFloat(p.css('borderLeftWidth'));

      return {
        top: box.top - po.top - parseToFloat(elem.css('marginTop')),
        left: box.left - po.left - parseToFloat(elem.css('marginLeft')),
      };
    }

    return {
      css: elem.css,
      prop: props,
      width: applyFloatFn(getCss('width')),
      height: applyFloatFn(getCss('height')),
      // outer area + margin
      outerWidth: addFloats(addFloats(getProps('offsetWidth'), getCss('marginLeft')),
        getCss('marginRight')),
      outerHeight: addFloats(addFloats(getProps('offsetHeight'), getCss('marginTop')),
        getCss('marginBottom')),
      innerWidth: addFloats(addFloats(getCss('width'), getCss('paddingLeft')),
        getCss('paddingRight')),
      innerHeight: addFloats(addFloats(getCss('height'), getCss('paddingTop')),
        getCss('paddingBottom')),
      offset: offset,
      offsetParent: offsetParent,
      position: position,
    };
  }
    $scope.fetchComponentData = function (strCompId) {
       // $scope.state = $scope.appData.data[strCompId];
        return $scope.state;
       
    }
    
    $scope.$on('LAB_DATA_LOADED', function () {

    });




    function typeErrorMsg(typeName) {
      return function(binding, value) {
        return [binding, '(', value, ') - Expected', typeName].join(' ');
      };
    }

    var shapes = ['Circle', 'Half Circle', 'Half Circle Left', 'Half Circle Right',
      'Half Circle Bottom'
    ];

    var transforms = {
      integer: {
        bindings: ['min', 'max', 'value', 'radius', 'animateDuration', 'borderWidth'],
        transform: parseInt
      },
      number: {
        bindings: ['innerCircleRatio', 'indicatorBallRatio', 'handleDistRatio'],
        transform: parseFloat,
      },
      'boolean': {
        bindings: ['touch', 'animate', 'selectable', 'clockwise', 'disabled'],
        transform: function(o) {
          return o === 'true' || o === true;
        },
      },
      'function': {
        bindings: ['onSlide', 'onSlideEnd'],
        transform: function(fun) {
          return fun ? fun : angular.noop;
        },
      }
    };

    var rules = {
      type: {
        integer: {
          bindings: ['min', 'max', 'value', 'radius', 'animateDuration', 'borderWidth'],
          test: toInteger,
          onError: typeErrorMsg('integer')
        },
        number: {
          bindings: ['innerCircleRatio', 'indicatorBallRatio', 'handleDistRatio'],
          test: isFinite,
          onError: typeErrorMsg('number')
        },
        'boolean': {
          bindings: ['touch', 'animate', 'selectable', 'clockwise', 'disabled'],
          test: truthy,
          onError: typeErrorMsg('boolean')
        },
        'function': {
          bindings: ['onSlide', 'onSlideEnd'],
          test: angular.isFunction,
          onError: typeErrorMsg('function')
        },
      },

      constraint: {
        range: {
          bindings: ['min', 'max'],
          test: function minMax() {
            return $scope.min <= $scope.max;
          },
          onError: function() {
            return ['Invalid slide range: [', $scope.min, ',', $scope.max, ']'].join('');
          },
        },
        value: {
          bindings: ['value'],
          test: function valueInRange(value) {
            return $scope.min <= value && value <= $scope.max;
          },
          onError: function() {
            return [$scope.value, '(value) out of range: [', $scope.min, ',', $scope.max,
              ']'
            ].join('');
          },
        },
        shape: {
          bindings: ['shape'],
          test: function shapeSupported() {
            return shapes.indexOf($scope.shape) !== -1;
          },
          onError: function() {
            return ['Unsupported shape: ', $scope.shape].join('');
          },
        },
        ratio: {
          bindings: ['innerCircleRatio', 'handleDistRatio', 'indicatorBallRatio'],
          test: function ratio(value) {
            return value >= 0.0 && value <= 1.0;
          },
          onError: function(b, value) {
            return [b + '(', value, ') is out of range: [0,1]'].join('');
          },
        },
      }
    };

    this.validateBindings = function(property) {
      var props = property ? property : this.props,
        p, binding;

      for (p in props) {
        // Apply binding transformer
        if (props[p].transform) {
          $scope[p] = props[p].transform($scope[p]);
        }
        // test binding types and constraints
        props[p].tests.forEach(function(t) {
          if (!t.test($scope[p])) {
            throw t.onError(p, $scope[p]);
          }
        });
      }
    };

    this.validateBinding = function(binding) {
      if (angular.isUndefined(binding)) return;
      var property = {};
      property[binding] = this.props[binding];
      this.validateBindings(property);
    };

    function init(controller) {

      // build constraints & transforms
      angular.forEach(rules, function(category, rule) {
        angular.forEach(category, function(action, name) {
          var bindings = action.bindings;
          bindings.map(function(binding) {
            controller[binding] = controller[binding] || {
              tests: []
            };
            controller[binding].tests.push({
              test: action.test,
              onError: action.onError
            });
          });
        });
      });

      angular.forEach(transforms, function(transformer) {
        angular.forEach(transformer.bindings, function(binding) {
          controller[binding].transform = transformer.transform;
        })
      });
    }

    init(this.props = {});
    
});