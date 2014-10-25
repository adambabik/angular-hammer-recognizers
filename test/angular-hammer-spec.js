/*global describe: false, it: false, beforeEach: false, afterEach: false, expect: false, browser: false, element: false, by: false */

'use strict';

var el;

beforeEach(function () {
  browser.get('test/angular-hammer-spec.html');
  el = element(by.binding('action'));
  expect(el.getText()).toEqual('');
});

describe('Spec Page', function() {
  it('should load a spec page', function() {
    expect(browser.getTitle()).toEqual('Angular.js Hammer Spec');
  });

  it('should handle tap-single', function () {
    element(by.id('tap-single')).click();
    expect(el.getText()).toBe('tap-single');
  });

  it('should handle tap-double', function () {
    element(by.id('tap-double')).click();
    element(by.id('tap-double')).click();
    expect(el.getText()).toBe('tap-double');
  });

  it('should handle pan', function () {
    var panEl = element(by.id('pan'));
    var actions = browser.actions.bind(browser);

    actions().mouseDown(panEl).perform().then(function () {
      return actions().mouseMove(element(by.id('tap-double'))).perform();
    }).then(function () {
      return actions().mouseUp().perform();
    }).then(function () {
      expect(el.getText()).toBe('pan');
    });
  });
});
