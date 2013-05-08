# angular-hammer

angular-hammer is a [Hammer.js](http://eightmedia.github.io/hammer.js/) adapter for [AngularJS](http://angularjs.org/). It gives a possibility to use directives which handle Hammer.js gestures.

The directives are build in this way: `hammer-{hammer_gesture}`, for instance `hammer-tap`.

## Usage

angular-hammer defines a single directive for each gesture. For instance, for `tap` gesture, it defines `hammer-tap` directive. [Here](https://github.com/EightMedia/hammer.js/wiki/Getting-Started#gesture-events) you can find all hammer.js gestures.

### Simple Example

```html
<span class="test-item" hammer-tap="changeColor($event)"></span>

<script>
	angular.module('app', []).controller('Main', function Main($scope) {
		$scope.changeColor = function changeColor(e) {
			console.log(e.currentTarget);
			angular.element(e.currentTarget).addClass('red');
		}
	});
</script>
```

### Passing options

Hammer.js has several [gesture options](https://github.com/EightMedia/hammer.js/wiki/Getting-Started#gesture-options). They can be passed in this way:

```html
<span class="test-item" hammer-tap="{ fn: 'changeColor($event)', hold_timeout: 1000 }"></span>
```

`hold_timeout` is passed in an option object to Hammer.js.

## License

MIT