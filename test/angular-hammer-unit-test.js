/*global describe: false, it: false, expect: false, beforeEach: false,
         angular: false, Hammer: false, inject: false */

'use strict';

describe('`angular-hammer` unit tests ::', function () {

  var $compile;
  var $scope;

  beforeEach(angular.mock.module('hammer'));

  beforeEach(inject(
    ['$compile','$rootScope', function($c, $r) {
      $compile = $c;
      $scope = $r.$new();

      $scope.method = function (hmEvent) {};
    }]
  ));

  it('should match a plain directive', function () {
    $compile('<div hm-tap="method()"></div>')($scope);
    expect($scope.$hammer).toBeDefined();
    expect($scope.$hammer.recognizers.length).toBe(1);

    var tapRecognizer = $scope.$hammer.get('tap');
    expect(tapRecognizer instanceof Hammer.Tap).toBeTruthy();
  });

  it('should match a directive with value that contains `with` keyword', function () {
    $compile('<div hm-tap="method() with { taps: 2, other: true }"></div>')($scope);
    expect($scope.$hammer).toBeDefined();
    expect($scope.$hammer.recognizers.length).toBe(1);

    var tapRecognizer = $scope.$hammer.get('tap');
    expect(tapRecognizer instanceof Hammer.Tap).toBeTruthy();
    expect(tapRecognizer.options.taps).toEqual(2);
    expect(tapRecognizer.options.other).toEqual(true);
  });

  it('should match an optimized directive', function () {
    $compile('<div hm-pan-o="method()"></div>')($scope);
    expect($scope.$hammer).toBeDefined();
    expect($scope.$hammer.recognizers.length).toBe(1);

    var pan = $scope.$hammer.get('pan');
    expect(pan instanceof Hammer.Pan).toBeTruthy();
  });

  it('should match multiple directives', function () {
    $compile('<div hm-tap="method()" hm-swipe="method()"></div>')($scope);
    expect($scope.$hammer).toBeDefined();
    expect($scope.$hammer.recognizers.length).toBe(2);
  });

  it('should match `hm-*-opts` directive', function () {
    $compile('<div hm-tap="method()" hm-tap-opts="{ taps: 2 }"></div>')($scope);
    expect($scope.$hammer).toBeDefined();
    expect($scope.$hammer.recognizers.length).toBe(1);

    var tapRecognizer = $scope.$hammer.get('tap');
    expect(tapRecognizer instanceof Hammer.Tap).toBeTruthy();
    expect(tapRecognizer.options.taps).toEqual(2);
  });
});
