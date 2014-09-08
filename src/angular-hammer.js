;(function (window, angular, Hammer) {

'use strict';

if (!angular) {
  throw new Error('`angular` is not defined.');
}

if (!Hammer) {
  throw new Error('`Hammer` is not defined.');
}

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
 * @param  {String} directive
 * @return {String}
 */
function toJSDirective(directive, all) {
  return directive.split('-').map(function (item, i) {
    if (!all && i === 0) return item;
    return capitalize(item);
  }).join('');
}

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

/**
 * @const {String}
 */
var prefix = 'hm';

/**
 * 'hammer' module.
 * @type {Objecy}
 */
var module = angular.module('hammer', []);

function isOptimized(d) {
  return d.charAt(d.length - 1) === 'O';
}

function get$hammer(scope, element) {
  return scope.$hammer || (scope.$hammer = new Hammer.Manager(element[0]));
}

function recognizerFromDirective(d, optimized) {
  return d.slice(prefix.length, d.length - !!optimized);
}

function constructLinkFn($parse, directive) {
  return function linkFn(scope, element, attr) {
    var $hammer = get$hammer(scope, element);
    var optimized = isOptimized(directive);
    var recognizer = recognizerFromDirective(directive, optimized);
    var eventName = recognizer.toLowerCase();
    var callback = $parse(attr[directive]);
    var eventCallback = angular.noop;

    if (!Hammer[recognizer]) {
      throw new Error('`' + recognizer + '` is not supported by Hammer.js.');
    }

    if (optimized) {
      eventCallback = function eventCallbackOptimized(ev) {
        callback(scope, { hmEvent: ev });
      };
    } else {
      eventCallback = function eventCallbackNotOptimized(ev) {
        scope.$apply(function () {
          callback(scope, { hmEvent: ev });
        });
      };
    }

    $hammer.add(new Hammer[recognizer]());
    $hammer.on(eventName, eventCallback);
  };
}

RECOGNIZERS.forEach(function (recognizer) {
  var directive = toJSDirective(prefix + '-' + recognizer);

  module.directive(directive, ['$parse', function ($parse) {
    return {
      restrict: 'AC',
      link: constructLinkFn($parse, directive)
    };
  }]);
});

}(window, window.angular, window.Hammer));
