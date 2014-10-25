;(function (window, angular, Hammer) {

'use strict';

/**
 * Throws error when a condition in not truthy.
 * @param  {Any}    cond
 * @param  {String} message
 * @return {Error|Null}
 */
function assert(cond, message) {
  if (!cond) {
    throw new Error(message);
  }
}

assert(angular, '`angular` is not defined.');
assert(Hammer, '`Hammer` is not defined.');

/**
 * Capitalizes string.
 * @param  {String} str
 * @return {String}
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts directive name in HTML form to JS form.
 * @param  {String}  directive
 * @param  {Boolean} all Should capitalize all items.
 * @return {String}
 */
function toJSDirective(directive, all) {
  return directive.split('-').map(function (item, i) {
    if (!all && i === 0) return item;
    return capitalize(item);
  }).join('');
}

/**
 * Checks if a given directive is optimized.
 * @param  {String}  d directive
 * @return {Boolean}
 */
function isOptimized(d) {
  return d.charAt(d.length - 1) === 'O';
}

/**
 * Retrives or creates a `Hammer.Manager`.
 * @param  {Object}      scope
 * @param  {HTMLElement} element
 * @return {Object}      `Hammer.Manager` instance
 *
 * @todo `$hammer` should be an object to support methods
 *                 to retrieve `Hammer.Manager` isntances.
 */
function hammerManagerFromScope(scope, element) {
  var managers = scope.$hammer || (scope.$hammer = []);
  var found = null;

  managers.forEach(function (m) {
    if (!found && m.element === element) {
      found = m;
    }
  });

  if (!found) {
    found = new Hammer.Manager(element);
    managers.push(found);
  }

  return found;
}

/**
 * Converts directive to Hammer.JS recognizer name.
 * @param  {String} d          directive
 * @return {String}
 */
function recognizerFromDirective(d) {
  var optimized = isOptimized(d);
  return d.slice(prefix.length, d.length - !!optimized);
}

/**
 * Parses expression using `$evel`.
 * @param  {Object} scope
 * @param  {String} expr
 * @return {Object}
 */
function parseOptionsExpr(scope, expr) {
  return scope.$eval(expr);
}

/**
 * Retrives options for a given directive (if exists).
 * @param  {Object}  scope
 * @param  {Object}  attr   directive's attributes
 * @param  {String}  d
 * @return {Object}
 */
function hammerOpts(scope, attr, d) {
  var optsDirective = d + (isOptimized(d) ? 'pts' : 'Opts');
  return parseOptionsExpr(scope, attr[optsDirective]) || {};
}

/**
 * Checks whether an expression has a `with` keyword.
 * @param  {String}  expr
 * @return {Boolean}
 */
function hasWithToken(expr) {
  return expr.indexOf(' with ') > -1;
}

/**
 * Splits an expression.
 * @param  {String} expr
 * @return {Array}
 */
function splitExpr(expr) {
  if (!hasWithToken(expr)) {
    return [expr.trim()];
  }

  return expr.split(' with ').map(function (expr) {
    return expr.trim();
  });
}

/**
 * Retrives directive callback form `attr` object.
 * @param  {Function} $parse
 * @param  {Object} scope
 * @param  {Object} attr
 * @param  {String} d        directive name
 * @return {Function}        directive callback
 */
function directiveCallback($parse, scope, attr, d) {
  var dirVal = attr[d];
  return $parse(
    hasWithToken(dirVal)
      ? splitExpr(dirVal)[0]
      : dirVal
  );
}

/**
 * Retrives directives options.
 * @param  {Object} scope
 * @param  {Object} attr
 * @param  {String} d     directive name
 * @return {Object}       options object passed to HammerJS
 */
function directiveOptions(scope, attr, d) {
  if (hasWithToken(attr[d])) {
    return parseOptionsExpr(scope, splitExpr(attr[d])[1]);
  } else {
    return hammerOpts(scope, attr, d);
  }
}

/**
 * Constructs link function passed to the directive definition.
 * @param  {Function} $parse
 * @param  {String}   directive directive name
 * @return {Function}           link function
 */
function constructLinkFn($parse, directive) {
  return function linkFn(scope, element, attr) {
    var callback = directiveCallback($parse, scope, attr, directive);
    var opts = directiveOptions(scope, attr, directive);

    if (!callback) {
      console.warn('[ linkFn ] no callback for directive = `' + directive + '`');
      return;
    }

    var recognizer = recognizerFromDirective(directive);
    assert(Hammer[recognizer], '`' + recognizer + '` is not supported by Hammer.js.');

    var eventName = opts.event || recognizer.toLowerCase();
    delete opts.event;
    opts = angular.extend({ event: eventName }, opts);

    var $hammer = hammerManagerFromScope(scope, element[0]);
    var fn = isOptimized(directive)
      ? function eventCallbackOptimized(ev) {
          callback(scope, { $hmEvent: ev });
        }
      : function eventCallbackNotOptimized(ev) {
          scope.$apply(function () {
            callback(scope, { $hmEvent: ev });
          });
        };

    // @TODO: it's possible to add multiple recognizers of the same type.
    var recognizerInstance = new Hammer[recognizer](opts);
    $hammer.add(recognizerInstance);
    $hammer.on(eventName, fn);

    scope.$on('$destroy', function () {
      $hammer.off(eventName, fn);

      var left = Object.keys(recognizerInstance.manager.handlers).length;
      if (left === 0) {
        $hammer.destroy();
      }
    });
  };
}

/**
 * @module hammer
 * @type {Object}
 */
var module = angular.module('hammer', []);

/**
 * @const {String}
 */
var prefix = 'hm';

/**
 * List of all available recognizers defined by Hammer.
 * @type {Array}
 */
var RECOGNIZERS = [
  'pan',
  'pan-o',
  'pinch',
  'pinch-o',
  'press',
  'rotate',
  'rotate-o',
  'swipe',
  'tap'
];

RECOGNIZERS.forEach(function (recognizer) {
  var directive = toJSDirective(prefix + '-' + recognizer);

  module.directive(directive, ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: constructLinkFn($parse, directive)
    };
  }]);
});

}(window, window.angular, window.Hammer));
