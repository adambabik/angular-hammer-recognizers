/*global describe: false, it: false, expect: false, beforeEach: false, inject: false, angular: false, Hammer: false */

'use strict';

describe('angular-hammer unit tests', function () {

	var $compile;
	var $scope;

	beforeEach(angular.mock.module('hammer'));

	beforeEach(inject(
    ['$compile','$rootScope', function($c, $r) {
      $compile = $c;
      $scope = $r.$new();
    }]
  ));

	describe('defining directives', function () {
		it('should instantiate directive with simple definition', function () {
			$compile('<div hm-tap="test()"></div>')($scope);
			expect($scope.$hammer).toBeDefined();
			expect($scope.$hammer.recognizers.length).toBe(1);
		});

		it('should instantiate directive with `with` keyword', function () {
			$scope.test = function () {};

			$compile('<div hm-tap="test() with { taps: 2 }"></div>')($scope);

			expect($scope.$hammer).toBeDefined();

			var tapRecognizer = $scope.$hammer.get('tap');
			expect(tapRecognizer instanceof Hammer.Tap).toBeTruthy();

		});
	});
});
