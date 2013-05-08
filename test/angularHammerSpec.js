/*global chai: false, FakeTouches: false */

'use strict';

var expect = chai.expect;

describe("angular-hammer", function () {
  var rootScope, compile;

  beforeEach(module('hammer'));

  beforeEach(inject(function ($rootScope, $compile) {
    rootScope = $rootScope;
    compile = $compile;
  }));

  it("test hammer-tap directive without options", function (done) {
    var elem, scope, faker;

    elem = angular.element('<div hammer-hold="testTouch($event)">test 1</div>');
    document.body.appendChild(elem[0]);

    scope = rootScope.$new();
    scope.testTouch = function (e) {
      var el = e.currentTarget;
      el.innerText = 'after test 1';
    };

    compile(elem)(scope);

    faker = new FakeTouches(elem[0]);
    faker.setTouchType(FakeTouches.TOUCH_EVENTS);

    expect(elem.text()).to.equal('test 1');

    faker.triggerGesture('Hold', function() {
      expect(elem.text()).to.equal('after test 1');
      document.body.removeChild(elem[0]);
      done();
    });
  });

  it("test hammer-tap directive with touch option", function (done) {
    var elem, scope, faker;

    elem = angular.element(
      '<div>' +
        '<div hammer-touch="{ fn: \'testTouch2($event)\', touch: false }">test 2</div>' +
        '<div hammer-touch="{ fn: \'testTouch3($event)\', touch: true }">test 3</div>' +
      '</div>'
    );
    document.body.appendChild(elem[0]);

    scope = rootScope.$new();
    scope.testTouch2 = function (e) {
      var el = e.currentTarget;
      el.innerText = 'after test 2';
    };
    scope.testTouch3 = function (e) {
      var el = e.currentTarget;
      el.innerText = 'after test 3';
    };

    compile(elem)(scope);

    // trigger testTouch2

    faker = new FakeTouches(elem.find('div').eq(0)[0]);
    faker.setTouchType(FakeTouches.TOUCH_EVENTS);

    expect(elem.find('div').eq(0).text()).to.equal('test 2');

    faker.triggerGesture('Tap', function () {
      expect(elem.find('div').eq(0).text()).to.equal('test 2'); // should not change because of touch: false
    });

    // trigger testTouch3

    faker = new FakeTouches(elem.find('div').eq(1)[0]);
    faker.setTouchType(FakeTouches.TOUCH_EVENTS);

    expect(elem.find('div').eq(1).text()).to.equal('test 3');

    faker.triggerGesture('Tap', function () {
      expect(elem.find('div').eq(1).text()).to.equal('after test 3');
      elem.remove();
      done();
    });
  });
});