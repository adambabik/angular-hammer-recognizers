/*global describe: false, it: false, expect: false, beforeEach: false, spyOn: false,
         angular: false, Hammer: false, jQuery: false, inject: false */

'use strict';

describe('`angular-hammer` unit tests ::', function () {

  var $compile;
  var scope;

  beforeEach(module('hammer'));

  beforeEach(inject(
    ['$compile','$rootScope', function($compile__, $rootScope__) {
      $compile = $compile__;
      scope = $rootScope__.$new();
      scope.method = function ($hmEvent) {};
    }]
  ));

  it('should match a plain directive', function () {
    $compile('<div hm-tap="method()"></div>')(scope);
    expect(scope.$hammer).toBeDefined();
    expect(scope.$hammer.length).toBe(1);

    var tapRecognizer = scope.$hammer[0].get('tap');
    expect(tapRecognizer instanceof Hammer.Tap).toBeTruthy();
  });

  it('should match a directive with value that contains `with` keyword', function () {
    $compile('<div hm-tap="method() with { taps: 2, other: true }"></div>')(scope);
    expect(scope.$hammer).toBeDefined();
    expect(scope.$hammer.length).toBe(1);

    var tapRecognizer = scope.$hammer[0].get('tap');
    expect(tapRecognizer instanceof Hammer.Tap).toBeTruthy();
    expect(tapRecognizer.options.taps).toEqual(2);
    expect(tapRecognizer.options.other).toEqual(true);
  });

  it('should match an optimized directive', function () {
    $compile('<div hm-pan-o="method()"></div>')(scope);
    expect(scope.$hammer).toBeDefined();
    expect(scope.$hammer.length).toBe(1);

    var pan = scope.$hammer[0].get('pan');
    expect(pan instanceof Hammer.Pan).toBeTruthy();
  });

  it('should match multiple directives', function () {
    $compile('<div hm-tap="method()" hm-swipe="method()"></div>')(scope);
    expect(scope.$hammer).toBeDefined();
    expect(scope.$hammer.length).toBe(1);
    expect(scope.$hammer[0].recognizers.length).toBe(2);
  });

  it('should match `hm-*-opts` directive', function () {
    $compile('<div hm-tap="method()" hm-tap-opts="{ taps: 2 }"></div>')(scope);
    expect(scope.$hammer).toBeDefined();
    expect(scope.$hammer.length).toBe(1);

    var tapRecognizer = scope.$hammer[0].get('tap');
    expect(tapRecognizer instanceof Hammer.Tap).toBeTruthy();
    expect(tapRecognizer.options.taps).toEqual(2);
  });

  it('should create two `Hammer.Manager` instances because of different elements', function () {
    $compile('<div hm-tap="method()"><div hm-swipe="method()"></div></div>')(scope);
    expect(scope.$hammer).toBeDefined();
    expect(scope.$hammer.length).toBe(2);

    scope.$hammer.forEach(function ($hammer) {
      expect($hammer.recognizers.length).toBe(1);
    });
  });

  // @todo more tests connected with calling events,
  //       check out https://github.com/angular/angular.js/tree/master/test/ngTouch

  it('should call directive callback', function () {
    $compile('<div hm-tap="method()"></div>')(scope);

    spyOn(scope, 'method');

    // @todo trigger events using `browserTrigger()`
    expect(scope.method).toHaveBeenCalled();
  });
});
