;(function (window, angular, Hammer) {

'use strict';

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
 * @return {Object}
 */
function hammerManagerFromScope(scope, element) {
  return scope.$hammer || (scope.$hammer = new Hammer.Manager(element[0]));
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
 * Retrives options for a given directive (if exists).
 * @param  {Object}  scope
 * @param  {Object}  attr      directive's attributes
 * @param  {String}  d
 * @return {Object}
 */
function hammerOpts(scope, attr, d) {
  var optsDirective = d + (isOptimized(d) ? 'pts' : 'Opts');
  return scope.$eval(attr[optsDirective]) || {};
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
 * @module hammer
 * @type {Object}
 */
var module = angular.module('hammer', []);

function constructLinkFn($parse, directive) {
  return function linkFn(scope, element, attr) {
    var callback = $parse(attr[directive]);
    if (!callback) return;

    var recognizer = recognizerFromDirective(directive);
    assert(Hammer[recognizer], '`' + recognizer + '` is not supported by Hammer.js.');

    var $hammer = hammerManagerFromScope(scope, element);
    var eventName = recognizer.toLowerCase();
    var opts = angular.extend({ event: eventName }, hammerOpts(scope, attr, directive));

    console.log('[ linkFn ]', {
      directive: directive,
      optimized: isOptimized(directive),
      event: eventName,
      opts: opts
    });

    $hammer.add(new Hammer[recognizer](opts));
    $hammer.on(eventName, (function (optimized) {
      if (optimized) {
        return function eventCallbackOptimized(ev) {
          callback(scope, { hmEvent: ev });
        };
      } else {
        return function eventCallbackNotOptimized(ev) {
          scope.$apply(function () {
            callback(scope, { hmEvent: ev });
          });
        };
      }
    }(isOptimized(directive))));
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
