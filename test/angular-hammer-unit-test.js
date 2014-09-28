/*global describe: false, it: false, expect: false, beforeEach: false, spyOn: false,
         angular: false, Hammer: false, jQuery: false, inject: false */

'use strict';

function getWindowForElement(element) {
  var doc = element.ownerDocument;
  return (doc.defaultView || doc.parentWindow);
}

describe('angular-hammer unit tests ::', function () {

  var $compile;
  var scope;
  var el;

  beforeEach(module('hammer'));

  beforeEach(inject(
    ['$compile','$rootScope', function($compile__, $rootScope__) {
      $compile = $compile__;
      scope = $rootScope__;
      scope.method = function ($hmEvent) { console.log('==='); };
    }]
  ));

  it('should match a plain directive', function () {
    el = $compile('<div hm-tap="method()"></div>')(scope);
    expect(scope.$hammer).toBeDefined();
    expect(scope.$hammer.length).toBe(1);

    var tapRecognizer = scope.$hammer[0].get('tap');
    expect(tapRecognizer instanceof Hammer.Tap).toBeTruthy();
  });

  it('should match a directive with value that contains `with` keyword', function () {
    el = $compile('<div hm-tap="method() with { taps: 2, other: true }"></div>')(scope);
    expect(scope.$hammer).toBeDefined();
    expect(scope.$hammer.length).toBe(1);

    var tapRecognizer = scope.$hammer[0].get('tap');
    expect(tapRecognizer instanceof Hammer.Tap).toBeTruthy();
    expect(tapRecognizer.options.taps).toEqual(2);
    expect(tapRecognizer.options.other).toEqual(true);
  });

  it('should match an optimized directive', function () {
    el = $compile('<div hm-pan-o="method()"></div>')(scope);
    expect(scope.$hammer).toBeDefined();
    expect(scope.$hammer.length).toBe(1);

    var pan = scope.$hammer[0].get('pan');
    expect(pan instanceof Hammer.Pan).toBeTruthy();
  });

  it('should match multiple directives', function () {
    el = $compile('<div hm-tap="method()" hm-swipe="method()"></div>')(scope);
    expect(scope.$hammer).toBeDefined();
    expect(scope.$hammer.length).toBe(1);
    expect(scope.$hammer[0].recognizers.length).toBe(2);
  });

  it('should match `hm-*-opts` directive', function () {
    el = $compile('<div hm-tap="method()" hm-tap-opts="{ taps: 2 }"></div>')(scope);
    expect(scope.$hammer).toBeDefined();
    expect(scope.$hammer.length).toBe(1);

    var tapRecognizer = scope.$hammer[0].get('tap');
    expect(tapRecognizer instanceof Hammer.Tap).toBeTruthy();
    expect(tapRecognizer.options.taps).toEqual(2);
  });

  it('should create two `Hammer.Manager` instances because of different elements', function () {
    el = $compile('<div hm-tap="method()"><div hm-swipe="method()"></div></div>')(scope);
    expect(scope.$hammer).toBeDefined();
    expect(scope.$hammer.length).toBe(2);

    scope.$hammer.forEach(function ($hammer) {
      expect($hammer.recognizers.length).toBe(1);
    });
  });

  it('should call directive callback', function () {
    el = $compile('<div hm-tap="method()"></div>')(scope);

    spyOn(scope, 'method');

    browserTrigger(el, 'mousedown', {
      keys: [],
      x: 10,
      y: 10
    });

    browserTrigger(getWindowForElement(el[0]), 'mouseup', {
      keys: [],
      x: 10,
      y: 10
    });

    expect(scope.method).toHaveBeenCalled();
  });
});
