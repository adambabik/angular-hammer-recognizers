# angular-hammer-recognizers

`angular-hammer-recognizers` is a [Hammer.js](http://eightmedia.github.io/hammer.js/) adapter for [AngularJS](http://angularjs.org/). It allows one to use directives which handle Hammer.js recognizers.

`angular-hammer-recognizers` defines a single directive for each gesture recognizer. The directives are build in the following way: `hm-{HAMMER_RECOGNIZER}`, for instance `hm-tap`. 

## Installation

Using Bower:

`$ bower install angular-hammer-recognizers --save`

Using npm:

`$ npm install angular-hammer-recognizers --save`

Or manually, downloading a suitable file from `dist` directory.

## Usage

To add a simple tap gesture recognizer use `hmTap` directive:

```html
<div hm-tap="method($hmEvent)"></div>
```

If you want to specify more options use `with` keyword:

```html
<div hm-tap="method($hmEvent) with { taps: 2 }"></div>
```

or `hmTapOpts` directive:

```html
<div hm-tap="method($hmEvent)" hm-tap-opts="{ taps: 2 }"></div>
```

## Optimized directives

In some situation you may want to add a gesture recognizer which does not trigger `$digest` cycle automatically. In order to do this, add `-o` prefix to the directive, e.g. `hm-pan-o="method($hmEvent)`.

The following directives are available in an optimized form: `pan`, `pinch`, `rotate`.

## Changelog

### v1.0.1

* Changed lib name to `angular-hammer-recognizers`.

### v1.0.0

* Directives based on HammerJS recognizers.

## License

MIT
